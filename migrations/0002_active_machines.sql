-- How many CaramOS computers are switched on each day (functions/api/active.js): one row per computer per day.
-- id is the hex SHA-256 the computer makes from its /etc/machine-id and the day, so it changes every day: days cannot
-- be linked, and no computer can be identified. Nothing else about the computer, its user or its network is kept.
-- day is the server's UTC date when the report arrived, "YYYY-MM-DD"; edition is "cinnamon" or "xfce".
CREATE TABLE IF NOT EXISTS active_machines (
  day TEXT NOT NULL,
  id TEXT NOT NULL,
  version TEXT NOT NULL,
  edition TEXT NOT NULL CHECK (edition IN ('cinnamon', 'xfce')),
  PRIMARY KEY (day, id)
) WITHOUT ROWID;
