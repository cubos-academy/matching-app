CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    phone VARCHAR(12) NOT NULL,
    document_id VARCHAR(11),
    google_id VARCHAR(120),
    facebook_id VARCHAR(120),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN confirmed_at TIMESTAMP, ADD COLUMN confirm_code VARCHAR(6);
