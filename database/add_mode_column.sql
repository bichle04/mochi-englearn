-- Add mode column to speaking_history table
-- 0: Practice (default)
-- 1: Real Exam

ALTER TABLE public.speaking_history 
ADD COLUMN mode INTEGER DEFAULT 0;

COMMENT ON COLUMN public.speaking_history.mode IS '0: Practice, 1: Real Exam';
