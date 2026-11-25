-- ISO downloads (functions/tai/[edition].js): one row per click on a download button. Kept: the moment (UTC), the
-- Vietnam date, the edition and version, where the file was served from (r2 or sourceforge), the country, region and
-- city Cloudflare gives for the request, where the click came from (a placement name, an outside site's host, or
-- direct), and the operating system family. No IP address, no full user agent, nothing that identifies a person.
CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY,
  at TEXT NOT NULL,
  day TEXT NOT NULL,
  edition TEXT NOT NULL CHECK (edition IN ('cinnamon', 'xfce')),
  version TEXT NOT NULL,
  mirror TEXT NOT NULL CHECK (mirror IN ('r2', 'sourceforge')),
  country TEXT,
  region TEXT,
  city TEXT,
  source TEXT NOT NULL,
  os TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS downloads_day ON downloads (day);
