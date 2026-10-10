import 'dotenv/config';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import bcrypt from 'bcryptjs';
import {createApp} from './server/app.js';
import {createDatabase} from './server/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const production = process.env.NODE_ENV === 'production';
const databasePath = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'), 'mahligai.sqlite');

const database = await createDatabase(databasePath);
await database.createAdminIfConfigured({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  hashPassword: (password) => bcrypt.hash(password, 12),
});

const app = createApp({
  database,
  sessionSecret: process.env.SESSION_SECRET,
  production,
  trustProxy: process.env.TRUST_PROXY === '1' ? 1 : false,
  trustedOrigins: production ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000'],
});
const port = Number(process.env.PORT || 8080);

const server = app.listen(port, () => {
  console.log(`Mahligai API server listening on port ${port}`);
});

const shutdown = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
