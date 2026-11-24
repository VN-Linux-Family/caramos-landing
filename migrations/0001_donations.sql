-- Đồng hành (functions/_lib/dong-hanh.js): the transfers with the code DONGHANH that SePay reported.
-- sepay_id is SePay's transaction id: the same transfer reported twice is kept once.
-- month is "YYYY-MM" of the bank's date (Vietnam time); at is that date, "YYYY-MM-DD HH:MM:SS".
-- name is the masked name the person wrote after the code ("N*** V** A*"), or NULL; the transfer's content is not kept.
CREATE TABLE IF NOT EXISTS donations (
  sepay_id INTEGER PRIMARY KEY,
  month TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  name TEXT,
  at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS donations_month_at ON donations (month, at);
