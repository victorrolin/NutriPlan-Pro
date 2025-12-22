-- Script para adicionar suporte a hierarquia Personal -> Alunos
-- Execute este script se as colunas não existirem

-- Adicionar colunas para suportar hierarquia Personal -> Alunos
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0;

-- Criar índice para buscar alunos de um personal
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);

-- Função para incrementar contador de alunos
CREATE OR REPLACE FUNCTION increment_student_count(personal_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET student_count = student_count + 1 
  WHERE id = personal_id;
END;
$$ LANGUAGE plpgsql;

-- Função para decrementar contador de alunos
CREATE OR REPLACE FUNCTION decrement_student_count(personal_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET student_count = GREATEST(student_count - 1, 0)
  WHERE id = personal_id;
END;
$$ LANGUAGE plpgsql;
