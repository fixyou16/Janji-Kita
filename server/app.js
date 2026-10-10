import {randomUUID} from 'node:crypto';
import bcrypt from 'bcryptjs';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SqliteSessionStore} from './session-store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomUUID(), 12);

const requireAuthentication = (database) => (req, res, next) => {
  const userId = req.session.userId;
  const user = userId
    ? database.get('SELECT id, name, email, phone, role, status, created_at AS createdAt FROM users WHERE id = ?', [userId])
    : null;

  if (!user || user.status !== 'active') {
    if (userId) req.session.destroy(() => {});
    return res.status(401).json({error: 'Silakan masuk kembali.'});
  }
  req.user = user;
  next();
};

const requireRole = (...roles) => (req, res, next) => (
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({error: 'Anda tidak memiliki izin untuk tindakan ini.'})
);

const rejectCrossOriginMutation = (trustedOrigins) => (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (!origin) return next();

  try {
    if (new URL(origin).host !== req.get('host') && !trustedOrigins.has(origin)) {
      return res.status(403).json({error: 'Permintaan lintas origin ditolak.'});
    }
  } catch {
    return res.status(403).json({error: 'Origin permintaan tidak valid.'});
  }
  next();
};

export function createApp({
  database,
  sessionSecret,
  production = false,
  trustProxy = false,
  trustedOrigins = [],
}) {
  if (production && (!sessionSecret || sessionSecret.length < 32)) {
    throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters in production.');
  }

  const app = express();
  if (trustProxy) app.set('trust proxy', trustProxy);
  app.disable('x-powered-by');
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'https://api.qrserver.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  }));
  app.use(express.json({limit: '32kb'}));
  app.use(rejectCrossOriginMutation(new Set(trustedOrigins)));
  app.use(session({
    name: 'mahligai.sid',
    secret: sessionSecret || 'development-only-change-this-session-secret',
    store: new SqliteSessionStore(database),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: 'strict',
      maxAge: SESSION_DURATION_MS,
      path: '/',
    },
  }));

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.'},
  });
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {error: 'Terlalu banyak pendaftaran. Coba lagi nanti.'},
  });
  const authenticated = requireAuthentication(database);
  const api = express.Router();

  api.get('/health', (_req, res) => res.json({status: 'ok'}));

  api.post('/auth/register', registerLimiter, async (req, res, next) => {
    try {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
      const password = typeof req.body?.password === 'string' ? req.body.password : '';

      if (name.length < 2 || name.length > 100
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
        || phone.length > 30 || password.length < 12 || password.length > 128) {
        return res.status(400).json({
          error: 'Nama, email, atau nomor telepon tidak valid. Kata sandi harus 12–128 karakter.',
        });
      }
      if (database.get('SELECT id FROM users WHERE email = ?', [email])) {
        return res.status(409).json({error: 'Email sudah terdaftar.'});
      }

      const user = {
        id: `usr_${randomUUID()}`,
        name,
        email,
        phone,
        passwordHash: await bcrypt.hash(password, 12),
      };
      try {
        database.run(
          `INSERT INTO users (id, name, email, phone, password_hash, role, status, created_at)
           VALUES (?, ?, ?, ?, ?, 'customer', 'active', ?)`,
          [user.id, user.name, user.email, user.phone, user.passwordHash, new Date().toISOString()],
        );
      } catch (error) {
        if (String(error).includes('UNIQUE constraint failed')) {
          return res.status(409).json({error: 'Email sudah terdaftar.'});
        }
        throw error;
      }

      req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.userId = user.id;
        req.session.save((saveError) => {
          if (saveError) return next(saveError);
          res.status(201).json({user: database.get(
            'SELECT id, name, email, phone, role, status, created_at AS createdAt FROM users WHERE id = ?',
            [user.id],
          )});
        });
      });
    } catch (error) {
      next(error);
    }
  });

  api.post('/auth/login', loginLimiter, async (req, res, next) => {
    try {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const password = typeof req.body?.password === 'string' ? req.body.password : '';
      const user = database.get('SELECT * FROM users WHERE email = ?', [email]);
      const passwordMatches = await bcrypt.compare(password, user?.password_hash || DUMMY_PASSWORD_HASH);

      if (!user || user.status !== 'active' || !passwordMatches) {
        return res.status(401).json({error: 'Email atau kata sandi salah.'});
      }

      req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.userId = user.id;
        req.session.save((saveError) => {
          if (saveError) return next(saveError);
          res.json({user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            createdAt: user.created_at,
          }});
        });
      });
    } catch (error) {
      next(error);
    }
  });

  api.post('/auth/logout', authenticated, (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error);
      res.clearCookie('mahligai.sid', {httpOnly: true, sameSite: 'strict', secure: production, path: '/'});
      res.status(204).end();
    });
  });

  api.get('/auth/me', (req, res) => {
    const user = req.session.userId
      ? database.get('SELECT id, name, email, phone, role, status, created_at AS createdAt FROM users WHERE id = ?', [req.session.userId])
      : null;
    if (!user || user.status !== 'active') {
      if (req.session.userId) req.session.destroy(() => {});
      return res.json({user: null});
    }
    res.json({user});
  });

  api.get('/admin/users', authenticated, requireRole('super_admin'), (_req, res) => {
    const users = database.all(
      `SELECT id, name, email, phone, role, status, created_at AS createdAt
       FROM users ORDER BY created_at DESC`,
    );
    res.json({users});
  });

  api.patch('/admin/users/:userId', authenticated, requireRole('super_admin'), (req, res) => {
    const {role, status} = req.body || {};
    const user = database.get('SELECT id, role, status FROM users WHERE id = ?', [req.params.userId]);
    if (!user) return res.status(404).json({error: 'Akun tidak ditemukan.'});
    if (user.id === req.user.id) {
      return res.status(400).json({error: 'Admin tidak dapat mengubah peran atau status akunnya sendiri.'});
    }

    const allowedRoles = ['customer', 'reseller'];
    const allowedStatuses = ['active', 'suspended'];
    if ((role !== undefined && !allowedRoles.includes(role))
      || (status !== undefined && !allowedStatuses.includes(status))
      || (role === undefined && status === undefined)) {
      return res.status(400).json({error: 'Peran atau status akun tidak valid.'});
    }
    database.run(
      'UPDATE users SET role = ?, status = ? WHERE id = ?',
      [role ?? user.role, status ?? user.status, user.id],
    );
    res.json({user: database.get(
      `SELECT id, name, email, phone, role, status, created_at AS createdAt
       FROM users WHERE id = ?`,
      [user.id],
    )});
  });

  app.use('/api', api);
  app.use('/api', (_req, res) => res.status(404).json({error: 'Endpoint API tidak ditemukan.'}));

  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath, {index: false}));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'), (error) => {
      if (error) next();
    });
  });

  app.use((error, _req, res, _next) => {
    console.error('Request failed:', error);
    res.status(500).json({error: 'Terjadi kesalahan pada server.'});
  });

  return app;
}
