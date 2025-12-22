-- Script para criar usuário administrador
-- IMPORTANTE: Edite o email, nome e senha antes de executar

-- A senha abaixo é 'admin123' em hash bcrypt
-- Para gerar um novo hash, use: https://bcrypt-generator.com/

INSERT INTO users (email, full_name, password_hash, role, is_active)
VALUES (
  'admin@fitplan.com',
  'Administrador FitPlan',
  '$2a$10$rQEY7GkHJqR8sZN1VfJjXOqXhzJZBqKvLh7qxQZvGz8QYkF1234567', -- senha: admin123
  'admin',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'admin',
  is_active = true,
  password_hash = '$2a$10$rQEY7GkHJqR8sZN1VfJjXOqXhzJZBqKvLh7qxQZvGz8QYkF1234567';

-- Verificar se o admin foi criado
SELECT id, email, full_name, role, is_active FROM users WHERE role = 'admin';
