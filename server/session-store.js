import session from 'express-session';

export class SqliteSessionStore extends session.Store {
  constructor(database) {
    super();
    this.database = database;
  }

  get(sid, callback) {
    try {
      const row = this.database.get('SELECT data, expires_at FROM sessions WHERE sid = ?', [sid]);
      if (!row) return callback(null, null);
      if (row.expires_at <= Date.now()) {
        this.database.run('DELETE FROM sessions WHERE sid = ?', [sid]);
        return callback(null, null);
      }
      callback(null, JSON.parse(row.data));
    } catch (error) {
      callback(error);
    }
  }

  set(sid, value, callback = () => {}) {
    try {
      const expiresAt = value.cookie?.expires
        ? new Date(value.cookie.expires).getTime()
        : Date.now() + 24 * 60 * 60 * 1000;
      this.database.run(
        `INSERT INTO sessions (sid, expires_at, data) VALUES (?, ?, ?)
         ON CONFLICT(sid) DO UPDATE SET expires_at = excluded.expires_at, data = excluded.data`,
        [sid, expiresAt, JSON.stringify(value)],
      );
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      this.database.run('DELETE FROM sessions WHERE sid = ?', [sid]);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sid, value, callback = () => {}) {
    try {
      const expiresAt = value.cookie?.expires
        ? new Date(value.cookie.expires).getTime()
        : Date.now() + 24 * 60 * 60 * 1000;
      this.database.run('UPDATE sessions SET expires_at = ? WHERE sid = ?', [expiresAt, sid]);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}
