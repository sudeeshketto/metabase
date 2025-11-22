-- create db and user, let MySQL pick the default auth plugin (caching_sha2_password on MySQL 8)
CREATE DATABASE IF NOT EXISTS metabase;
CREATE USER IF NOT EXISTS 'mbuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON metabase.* TO 'mbuser'@'%';
FLUSH PRIVILEGES;
