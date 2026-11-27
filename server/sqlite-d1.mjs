// A D1 for tests: an SQLite database in memory (node:sqlite) with the migrations given, behind D1's interface
// (prepare/bind/run/first/all, batch), so that the SQL itself is tested.
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

export function sqliteD1(migrations) {
  const db = new DatabaseSync(':memory:');
  for (const name of migrations) db.exec(readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8'));
  const statement = (sql, values = []) => ({
    sql,
    bind: (...next) => statement(sql, next),
    run: async () => {
      const result = db.prepare(sql).run(...values);
      return { meta: { last_row_id: Number(result.lastInsertRowid), changes: Number(result.changes) } };
    },
    first: async () => {
      const row = db.prepare(sql).get(...values);
      return row ? { ...row } : null;
    },
    all: async () => ({ results: db.prepare(sql).all(...values).map((row) => ({ ...row })) }),
  });
  return {
    prepare: (sql) => statement(sql),
    // Like D1: each statement's rows (a SELECT) or its meta (a write).
    batch: async (statements) => {
      const results = [];
      for (const item of statements) results.push(/^\s*SELECT/i.test(item.sql) ? await item.all() : await item.run());
      return results;
    },
    sqlite: db,
  };
}
