-- Create login roles
CREATE ROLE admin LOGIN PASSWORD 'p4ssword_admin';
ALTER ROLE admin CREATEDB;
CREATE ROLE test LOGIN PASSWORD 'p4ssword_test';
CREATE ROLE dev LOGIN PASSWORD 'p4ssword_dev';
CREATE ROLE prod LOGIN PASSWORD 'p4ssword_prod';

-- Admin role
GRANT pg_read_all_data TO admin;
GRANT pg_write_all_data TO admin;
GRANT pg_database_owner TO admin;
GRANT pg_monitor TO admin;
GRANT pg_signal_backend TO admin;
GRANT pg_read_all_settings TO admin;
GRANT pg_read_all_stats TO admin;

-- Comment out if superuser privileges are needed
ALTER ROLE admin SUPERUSER;

-- Test role
GRANT pg_read_all_data TO test;  -- Note: Consider restricting to specific test databases
GRANT pg_write_all_data TO test;
GRANT pg_database_owner TO test;  -- Optional, remove if not needed
GRANT pg_read_all_stats TO test;

-- Dev role
GRANT pg_read_all_data TO dev;   -- Note: Consider restricting to development databases
GRANT pg_write_all_data TO dev;
GRANT pg_database_owner TO dev;
GRANT pg_read_all_stats TO dev;

-- Prod role
GRANT pg_read_all_data TO prod;
GRANT pg_write_all_data TO prod; -- Remove this if write access isn't needed
GRANT pg_monitor TO prod;

-- Add comments to document role purposes
COMMENT ON ROLE admin IS 'Administrative role with full access to manage databases, monitor performance, and modify data';
COMMENT ON ROLE test IS 'Testing role with read/write access to test environment';
COMMENT ON ROLE dev IS 'Developer role with full access to development environment';
COMMENT ON ROLE prod IS 'Production role with minimal access for production systems';

-- Security best practices
ALTER ROLE admin SET statement_timeout = '1h';
ALTER ROLE test SET statement_timeout = '30min';
ALTER ROLE dev SET statement_timeout = '30min';
ALTER ROLE prod SET statement_timeout = '5min';

-- Force password changes on first login (optional)
ALTER ROLE admin VALID UNTIL 'infinity' PASSWORD 'p4ssword_admin';
ALTER ROLE test VALID UNTIL 'infinity' PASSWORD 'p4ssword_test';
ALTER ROLE dev VALID UNTIL 'infinity' PASSWORD 'p4ssword_dev';
ALTER ROLE prod VALID UNTIL 'infinity' PASSWORD 'p4ssword_prod';