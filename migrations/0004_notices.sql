-- Notices to CaramOS computers (server/notices.js): written at /quan-tri (server/admin.js), read by the computers from
-- /api/thong-bao. Each computer keeps the notices meant for its version, edition and state and shows each one once to
-- each user. Times are UTC, "YYYY-MM-DDTHH:MM:SSZ"; ends_at '' means no end. min_version and max_version are CaramOS
-- versions ("1.5.2"), '' meaning no bound. link_url is empty or an https address on vietnamlinuxfamily.net.
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'critical')),
  title_vi TEXT NOT NULL,
  body_vi TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  editions TEXT NOT NULL DEFAULT 'all' CHECK (editions IN ('all', 'cinnamon', 'xfce')),
  min_version TEXT NOT NULL DEFAULT '',
  max_version TEXT NOT NULL DEFAULT '',
  condition TEXT NOT NULL DEFAULT 'all' CHECK (condition IN ('all', 'update-waiting', 'update-failing')),
  link_url TEXT NOT NULL DEFAULT '',
  link_label_vi TEXT NOT NULL DEFAULT '',
  link_label_en TEXT NOT NULL DEFAULT '',
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Failed sign-ins at /quan-tri, to slow down password guessing: who (a hash of the address and a secret, not the
-- address) and when. Rows older than a day are deleted at every sign-in.
CREATE TABLE IF NOT EXISTS admin_attempts (
  who TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_attempts_who_at ON admin_attempts (who, at);
