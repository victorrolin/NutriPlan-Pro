-- Simplified Storage Policies for diet-plans bucket
-- Execute this AFTER creating the bucket via Supabase UI
-- Go to: Storage > diet-plans > Policies

-- Policy 1: Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'diet-plans');

-- Policy 2: Allow authenticated users to upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'diet-plans' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update
CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'diet-plans'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'diet-plans'
  AND auth.role() = 'authenticated'
);
