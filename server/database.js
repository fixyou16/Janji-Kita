import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import initSqlJs from 'sql.js';

const require = createRequire(import.meta.url);
const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');

export async function createDatabase(filename) {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(path.dirname(wasmPath), file),
  });

  if (filename !== ':memory:') {
    fs.mkdirSync(path.dirname(filename), {recursive: true});
  }

  const database = new SQL.Database(
    filename !== ':memory:' && fs.existsSync(filename)
      ? new Uint8Array(fs.readFileSync(filename))
      : undefined,
  );

  database.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('customer', 'reseller', 'super_admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
  `);

  const persist = () => {
    if (filename === ':memory:') return;
    const temporaryPath = `${filename}.tmp`;
    fs.writeFileSync(temporaryPath, Buffer.from(database.export()), {mode: 0o600});
    fs.renameSync(temporaryPath, filename);
  };

  const prepare = (sql, params = []) => {
    const statement = database.prepare(sql);
    statement.bind(params);
    return statement;
  };

  const all = (sql, params = []) => {
    const statement = prepare(sql, params);
    const rows = [];
    while (statement.step()) rows.push(statement.getAsObject());
    statement.free();
    return rows;
  };

  const get = (sql, params = []) => all(sql, params)[0] || null;

  const run = (sql, params = []) => {
    database.run(sql, params);
    const changes = database.getRowsModified();
    persist();
    return changes;
  };

  const createAdminIfConfigured = async ({email, password, hashPassword}) => {
    if (!email && !password) return;
    if (!email || !password || password.length < 12) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must both be set; the password must be at least 12 characters.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = get('SELECT id, role FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      if (existing.role !== 'super_admin') {
        throw new Error('ADMIN_EMAIL is already assigned to a non-admin account.');
      }
      return;
    }

    run(
      `INSERT INTO users (id, name, email, password_hash, role, status, created_at)
       VALUES (?, ?, ?, ?, 'super_admin', 'active', ?)`,
      [
        `usr_${randomUUID()}`,
        'Administrator',
        normalizedEmail,
        await hashPassword(password),
        new Date().toISOString(),
      ],
    );
  };

  return {all, get, run, persist, close: () => database.close(), createAdminIfConfigured};
}
