-- Which download clicks are people (server/downloads.js). Every counted click keeps its row, and kind says whether
-- the statistics page counts it:
--   nguoi  a person's click (counted)
--   bot    a computer: a data-centre network, a script that sends no browser language, or a third link in a minute
--   lap    the same person clicking the same edition again on the same Vietnam day
-- reason says why a row is not counted. client is a keyed hash of the address and the browser, salted with the
-- Vietnam day: one person's clicks group within a day and never across days, and the address cannot be read back.
-- asn and network name the provider the click came through (a network, not a person).
ALTER TABLE downloads ADD COLUMN kind TEXT NOT NULL DEFAULT 'nguoi' CHECK (kind IN ('nguoi', 'bot', 'lap'));
ALTER TABLE downloads ADD COLUMN reason TEXT;
ALTER TABLE downloads ADD COLUMN client TEXT;
ALTER TABLE downloads ADD COLUMN asn INTEGER;
ALTER TABLE downloads ADD COLUMN network TEXT;
CREATE INDEX IF NOT EXISTS downloads_client ON downloads (client);
