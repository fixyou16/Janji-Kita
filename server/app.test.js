import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, test} from 'node:test';
import bcrypt from 'bcryptjs';
import {createApp} from './app.js';
import {createDatabase} from './database.js';

let database;
let server;
let baseUrl;
let temporaryDirectory;

async function request(endpoint, {method = 'GET', body, cookie, origin} = {}) {
  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    method,
    headers: {
      ...(body ? {'Content-Type': 'application/json'} : {}),
      ...(cookie ? {Cookie: cookie} : {}),
      ...(origin ? {Origin: origin} : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  const setCookie = response.headers.get('set-cookie');
  return {
    response,
    data: response.status === 204 ? null : await response.json(),
    cookie: setCookie?.split(';', 1)[0] || cookie,
    setCookie,
  };
}

async function createAccount({name, email, phone = '', password}) {
  return request('/auth/register', {
    method: 'POST',
    body: {name, email, phone, password},
  });
}

beforeEach(async () => {
  database = await createDatabase(':memory:');
  await database.createAdminIfConfigured({
    email: 'admin@example.test',
    password: 'a-long-test-admin-password',
    hashPassword: (password) => bcrypt.hash(password, 12),
  });
  const app = createApp({database, sessionSecret: 'test-session-secret-that-is-long-enough'});
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  database?.close();
  if (temporaryDirectory) await rm(temporaryDirectory, {recursive: true, force: true});
  server = undefined;
  database = undefined;
  temporaryDirectory = undefined;
});

test('registration creates only a customer, stores a password hash, and issues a secure session cookie', async () => {
  const result = await createAccount({
    name: 'Customer Test',
    email: 'CUSTOMER@example.test',
    password: 'a-long-test-customer-password',
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.data.user.role, 'customer');
  assert.equal(result.data.user.email, 'customer@example.test');
  assert.equal('password_hash' in result.data.user, false);
  assert.equal('passwordHash' in result.data.user, false);
  assert.match(result.setCookie, /HttpOnly/i);
  assert.match(result.setCookie, /SameSite=Strict/i);
  const row = database.get('SELECT password_hash FROM users WHERE email = ?', ['customer@example.test']);
  assert.notEqual(row.password_hash, 'a-long-test-customer-password');
  assert.equal(await bcrypt.compare('a-long-test-customer-password', row.password_hash), true);
});

test('registration rejects short passwords and duplicate emails', async () => {
  const invalid = await createAccount({name: 'Customer', email: 'customer@example.test', password: 'short'});
  assert.equal(invalid.response.status, 400);

  await createAccount({name: 'Customer', email: 'customer@example.test', password: 'a-long-test-customer-password'});
  const duplicate = await createAccount({name: 'Another', email: 'CUSTOMER@example.test', password: 'another-long-test-password'});
  assert.equal(duplicate.response.status, 409);
});

test('a logged-in customer cannot read or mutate admin-managed accounts', async () => {
  const customer = await createAccount({
    name: 'Customer Test',
    email: 'customer@example.test',
    password: 'a-long-test-customer-password',
    role: 'super_admin',
  });

  const users = await request('/admin/users', {cookie: customer.cookie});
  const account = await request(`/admin/users/${customer.data.user.id}`, {
    method: 'PATCH',
    body: {role: 'reseller'},
    cookie: customer.cookie,
  });
  assert.equal(users.response.status, 403);
  assert.equal(account.response.status, 403);
  assert.equal(database.get('SELECT role FROM users WHERE id = ?', [customer.data.user.id]).role, 'customer');
});

test('login uses generic errors and rotates the session identifier', async () => {
  await createAccount({name: 'Customer Test', email: 'customer@example.test', password: 'a-long-test-customer-password'});

  const invalid = await request('/auth/login', {
    method: 'POST',
    body: {email: 'customer@example.test', password: 'incorrect-password'},
  });
  const missing = await request('/auth/login', {
    method: 'POST',
    body: {email: 'unknown@example.test', password: 'incorrect-password'},
  });
  assert.equal(invalid.response.status, 401);
  assert.deepEqual(invalid.data, missing.data);

  const registered = await createAccount({name: 'Another', email: 'another@example.test', password: 'another-long-test-password'});
  const login = await request('/auth/login', {
    method: 'POST',
    body: {email: 'customer@example.test', password: 'a-long-test-customer-password'},
    cookie: registered.cookie,
  });
  assert.equal(login.response.status, 200);
  assert.notEqual(login.cookie, registered.cookie);

  const oldSession = await request('/auth/me', {cookie: registered.cookie});
  const newSession = await request('/auth/me', {cookie: login.cookie});
  assert.equal(oldSession.data.user, null);
  assert.equal(newSession.data.user.email, 'customer@example.test');
});

test('logout revokes the server-side session', async () => {
  const registered = await createAccount({name: 'Customer Test', email: 'customer@example.test', password: 'a-long-test-customer-password'});
  const logout = await request('/auth/logout', {method: 'POST', cookie: registered.cookie});
  const current = await request('/auth/me', {cookie: registered.cookie});
  assert.equal(logout.response.status, 204);
  assert.equal(current.response.status, 401);
});

test('only admins can manage accounts; admins cannot grant the admin role or edit their own access', async () => {
  const customer = await createAccount({name: 'Customer Test', email: 'customer@example.test', password: 'a-long-test-customer-password'});
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: {email: 'admin@example.test', password: 'a-long-test-admin-password'},
  });

  const grantAdmin = await request(`/admin/users/${customer.data.user.id}`, {
    method: 'PATCH',
    body: {role: 'super_admin'},
    cookie: adminLogin.cookie,
  });
  const promote = await request(`/admin/users/${customer.data.user.id}`, {
    method: 'PATCH',
    body: {role: 'reseller'},
    cookie: adminLogin.cookie,
  });
  const updatedSession = await request('/auth/me', {cookie: customer.cookie});
  const selfEdit = await request(`/admin/users/${adminLogin.data.user.id}`, {
    method: 'PATCH',
    body: {status: 'suspended'},
    cookie: adminLogin.cookie,
  });

  assert.equal(grantAdmin.response.status, 400);
  assert.equal(promote.data.user.role, 'reseller');
  assert.equal(updatedSession.data.user.role, 'reseller');
  assert.equal(selfEdit.response.status, 400);
});

test('suspending an account invalidates its existing session', async () => {
  const customer = await createAccount({name: 'Customer Test', email: 'customer@example.test', password: 'a-long-test-customer-password'});
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: {email: 'admin@example.test', password: 'a-long-test-admin-password'},
  });

  const suspended = await request(`/admin/users/${customer.data.user.id}`, {
    method: 'PATCH',
    body: {status: 'suspended'},
    cookie: adminLogin.cookie,
  });
  const current = await request('/auth/me', {cookie: customer.cookie});
  assert.equal(suspended.data.user.status, 'suspended');
  assert.equal(current.response.status, 401);
});

test('cross-origin state changes are rejected', async () => {
  const result = await request('/auth/register', {
    method: 'POST',
    origin: 'https://attacker.example',
    body: {name: 'Customer Test', email: 'customer@example.test', password: 'a-long-test-customer-password'},
  });
  assert.equal(result.response.status, 403);
  assert.equal(database.get('SELECT id FROM users WHERE email = ?', ['customer@example.test']), null);
});

test('production mode requires a sufficiently strong session secret and marks the session cookie secure', async () => {
  assert.throws(
    () => createApp({database, production: true, sessionSecret: 'short'}),
    /SESSION_SECRET/,
  );

  const productionApp = createApp({
    database,
    production: true,
    sessionSecret: 'a-production-session-secret-longer-than-32-characters',
    trustProxy: 1,
  });
  const productionServer = productionApp.listen(0, '127.0.0.1');
  await new Promise((resolve) => productionServer.once('listening', resolve));
  const response = await fetch(`http://127.0.0.1:${productionServer.address().port}/api/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Forwarded-Proto': 'https'},
    body: JSON.stringify({email: 'admin@example.test', password: 'a-long-test-admin-password'}),
  });
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /Secure/i);
  await new Promise((resolve) => productionServer.close(resolve));
});

test('accounts persist in the configured database across restarts', async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'mahligai-auth-'));
  const filename = path.join(temporaryDirectory, 'accounts.sqlite');
  const firstDatabase = await createDatabase(filename);
  firstDatabase.run(
    `INSERT INTO users (id, name, email, password_hash, role, status, created_at)
     VALUES (?, ?, ?, ?, 'customer', 'active', ?)`,
    ['persistent-user', 'Persistent User', 'persist@example.test', 'a-password-hash', new Date().toISOString()],
  );
  firstDatabase.close();

  const reopenedDatabase = await createDatabase(filename);
  assert.equal(reopenedDatabase.get('SELECT id FROM users WHERE email = ?', ['persist@example.test']).id, 'persistent-user');
  reopenedDatabase.close();
});
