-- ========================================
-- SCHEMA DE LA PLATAFORMA EDUCATIVA
-- Base de datos: PostgreSQL (Neon)
-- ========================================

-- Eliminar tablas existentes (en orden inverso de dependencias)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_simulator_interactions CASCADE;
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS steps CASCADE;
DROP TABLE IF EXISTS simulators CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS audit_action CASCADE;
DROP TYPE IF EXISTS audit_entity_type CASCADE;

-- ========================================
-- TIPOS ENUM
-- ========================================

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'DISABLE_ACCOUNT');
CREATE TYPE audit_entity_type AS ENUM ('LESSON', 'SIMULATOR', 'FAQ', 'USER', 'CATEGORY', 'STEP');

-- ========================================
-- TABLA: users
-- ========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ========================================
-- TABLA: categories
-- ========================================
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: lessons
-- ========================================
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    lesson_order INT NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    related_simulator_id BIGINT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, lesson_order)
);

-- Índices
CREATE INDEX idx_lessons_category ON lessons(category_id);
CREATE INDEX idx_lessons_created_by ON lessons(created_by);
CREATE INDEX idx_lessons_published ON lessons(is_published);

-- ========================================
-- TABLA: steps
-- ========================================
CREATE TABLE steps (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE ON UPDATE CASCADE,
    step_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, step_order)
);

-- Índices
CREATE INDEX idx_steps_lesson ON steps(lesson_id);

-- ========================================
-- TABLA: simulators
-- ========================================
CREATE TABLE simulators (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    feedback TEXT,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_simulators_created_by ON simulators(created_by);
CREATE INDEX idx_simulators_lesson ON simulators(lesson_id);
CREATE INDEX idx_simulators_active ON simulators(is_active);

-- Añadir FK de lesson a simulator después de crear ambas tablas
ALTER TABLE lessons ADD CONSTRAINT fk_lessons_simulator
    FOREIGN KEY (related_simulator_id) REFERENCES simulators(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ========================================
-- TABLA: user_lesson_progress
-- ========================================
CREATE TABLE user_lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE ON UPDATE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    access_count INT NOT NULL DEFAULT 0,
    UNIQUE(user_id, lesson_id)
);

-- Índices
CREATE INDEX idx_ulp_user ON user_lesson_progress(user_id);
CREATE INDEX idx_ulp_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_ulp_completed ON user_lesson_progress(is_completed);
CREATE INDEX idx_ulp_favorite ON user_lesson_progress(is_favorite);

-- ========================================
-- TABLA: user_simulator_interactions
-- ========================================
CREATE TABLE user_simulator_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    simulator_id BIGINT NOT NULL REFERENCES simulators(id) ON DELETE CASCADE ON UPDATE CASCADE,
    accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    access_count INT NOT NULL DEFAULT 0
);

-- Índices
CREATE INDEX idx_usi_user ON user_simulator_interactions(user_id);
CREATE INDEX idx_usi_simulator ON user_simulator_interactions(simulator_id);

-- ========================================
-- TABLA: faqs
-- ========================================
CREATE TABLE faqs (
    id BIGSERIAL PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_faqs_topic ON faqs(topic);
CREATE INDEX idx_faqs_active ON faqs(is_active);

-- ========================================
-- TABLA: audit_logs
-- ========================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

-- Índices
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

-- ========================================
-- DATOS INICIALES
-- ========================================

-- Usuario administrador inicial (contraseña: admin123 hasheada con BCrypt)
-- Hash generado con BCrypt strength 10
INSERT INTO users (username, email, password, role, is_active)
VALUES ('admin', 'admin@plataforma.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', TRUE);

-- Categorías iniciales
INSERT INTO categories (name, description) VALUES
('Redes Sociales', 'Aprende a usar redes sociales de forma segura'),
('Mensajería', 'Cómo usar aplicaciones de mensajería instantánea'),
('Búsqueda en Internet', 'Técnicas para buscar información en la web'),
('Compras Online', 'Guía para comprar de forma segura por internet'),
('Videollamadas', 'Cómo hacer videollamadas con familiares y amigos'),
('Seguridad Digital', 'Protege tu información y dispositivos');

-- ========================================
-- FIN DEL SCHEMA
-- ========================================
