const path = require("path");
const fs = require("fs");
const initSqlJs = require("sql.js");

let db = null;
let initPromise = null;

function getDbPath() {
  const p = process.env.DB_PATH || path.join("database", "beautybook.db");
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}

function persist() {
  if (!db) return;
  const dbPath = getDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

async function ensureDb() {
  if (db) return;
  if (!initPromise) {
    initPromise = (async () => {
      const SQL = await initSqlJs();
      const dbPath = getDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      let filebuffer = null;
      if (fs.existsSync(dbPath)) {
        filebuffer = new Uint8Array(fs.readFileSync(dbPath));
      }
      db = new SQL.Database(filebuffer);
      db.run("PRAGMA foreign_keys = ON;");
    })();
  }
  await initPromise;
}

function run(sql, params = []) {
  return ensureDb().then(() => {
    db.run(sql, params);
    persist();
    const isInsert = /^\s*INSERT/i.test(sql);
    const chRow = db.exec("SELECT changes() AS c")[0];
    const changes = chRow.values[0][0];
    if (isInsert) {
      const idRow = db.exec("SELECT last_insert_rowid() AS id")[0];
      const id = idRow.values[0][0];
      return { id, changes };
    }
    return { id: 0, changes };
  });
}

function get(sql, params = []) {
  return ensureDb().then(() => {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (!stmt.step()) {
      stmt.free();
      return undefined;
    }
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  });
}

function all(sql, params = []) {
  return ensureDb().then(() => {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  });
}

async function initDb() {
  await ensureDb();
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      serviceName TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      appointmentDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'planned',
      note TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
}

module.exports = { run, get, all, initDb, ensureDb };
