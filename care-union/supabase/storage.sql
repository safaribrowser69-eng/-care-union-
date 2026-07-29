-- Run after schema.sql
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('care-union-media','care-union-media',true,5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id='care-union-media');
CREATE POLICY "Service upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id='care-union-media');
CREATE POLICY "Service delete" ON storage.objects FOR DELETE USING (bucket_id='care-union-media');
