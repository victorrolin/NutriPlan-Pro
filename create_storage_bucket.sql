-- Create Storage Bucket for Diet Plans
-- Execute this in Supabase SQL Editor

-- Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('diet-plans', 'diet-plans', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to diet-plans bucket
DROP POLICY IF EXISTS "Public read access to diet plans" ON storage.objects;
CREATE POLICY "Public read access to diet plans"
ON storage.objects FOR SELECT
USING (bucket_id = 'diet-plans');

-- Policy: Allow authenticated users to upload to diet-plans bucket
DROP POLICY IF EXISTS "Authenticated users can upload diet plans" ON storage.objects;
CREATE POLICY "Authenticated users can upload diet plans"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'diet-plans' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to update their own files
DROP POLICY IF EXISTS "Users can update own diet plans" ON storage.objects;
CREATE POLICY "Users can update own diet plans"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'diet-plans'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own diet plans" ON storage.objects;
CREATE POLICY "Users can delete own diet plans"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'diet-plans'
  AND auth.role() = 'authenticated'
);
