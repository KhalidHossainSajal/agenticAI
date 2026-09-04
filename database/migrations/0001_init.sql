-- 0001_init.sql
-- Phase 0 foundation: only the schema_migrations ledger.
-- Future phases add their own append-only *.sql files (0002_*.sql, 0003_*.sql, ...).
-- Never edit this file after it has been applied.

CREATE TABLE IF NOT EXISTS schema_migrations (
  version    VARCHAR(255) NOT NULL PRIMARY KEY,
  applied_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
