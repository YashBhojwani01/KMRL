-- =====================================================
-- KMRL Metro Email Classification System - Storage Setup
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- This script sets up storage for email attachments and document processing

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Create email-attachments bucket for storing email attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'email-attachments',
    'email-attachments',
    true,
    52428800, -- 50MB limit
    ARRAY[
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'text/csv',
        'application/json',
        'application/zip',
        'application/x-zip-compressed'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Create temp-attachments bucket for temporary file processing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'temp-attachments',
    'temp-attachments',
    true,
    104857600, -- 100MB limit for temp files
    ARRAY[
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'text/csv',
        'application/json',
        'application/zip',
        'application/x-zip-compressed'
    ]
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. STORAGE POLICIES SETUP
-- =====================================================

-- Option A: Disable RLS completely (Recommended for development)
-- Uncomment the following line to disable RLS on storage.objects
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Option B: Create specific policies (Recommended for production)
-- Uncomment the following policies if you want to keep RLS enabled

-- Policy for email-attachments bucket - allow all operations for authenticated users
-- CREATE POLICY "Allow authenticated users to manage email-attachments" ON storage.objects
-- FOR ALL USING (
--     bucket_id = 'email-attachments' 
--     AND auth.role() = 'authenticated'
-- );

-- Policy for temp-attachments bucket - allow all operations for authenticated users
-- CREATE POLICY "Allow authenticated users to manage temp-attachments" ON storage.objects
-- FOR ALL USING (
--     bucket_id = 'temp-attachments' 
--     AND auth.role() = 'authenticated'
-- );

-- Public read access for email-attachments (for public URLs)
-- CREATE POLICY "Public read access for email-attachments" ON storage.objects
-- FOR SELECT USING (bucket_id = 'email-attachments');

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled on storage.objects
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '✅ RLS Disabled - Good for development'
        ELSE '⚠️ RLS Enabled - May need policies'
    END as status
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Check created buckets
SELECT 
    id,
    name, 
    public, 
    file_size_limit,
    created_at,
    CASE 
        WHEN public THEN '✅ Public'
        ELSE '🔒 Private'
    END as access_status
FROM storage.buckets 
WHERE name IN ('email-attachments', 'temp-attachments')
ORDER BY created_at;

-- Check storage policies (if RLS is enabled)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- =====================================================
-- 4. STORAGE FUNCTIONS
-- =====================================================

-- Function to get storage URL for a file
CREATE OR REPLACE FUNCTION get_storage_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT CASE 
        WHEN b.public THEN 
            'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path
        ELSE 
            'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/authenticated/' || bucket_name || '/' || file_path
    END
    FROM storage.buckets b
    WHERE b.name = bucket_name;
$$;

-- Function to check if file exists in storage
CREATE OR REPLACE FUNCTION storage_file_exists(bucket_name text, file_path text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 
        FROM storage.objects 
        WHERE bucket_id = bucket_name AND name = file_path
    );
$$;

-- =====================================================
-- 5. CLEANUP FUNCTIONS
-- =====================================================

-- Function to cleanup old temp files (older than specified hours)
CREATE OR REPLACE FUNCTION cleanup_temp_files(hours_old integer DEFAULT 24)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'temp-attachments' 
    AND created_at < NOW() - INTERVAL '1 hour' * hours_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Function to get storage statistics
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS TABLE(
    bucket_name text,
    file_count bigint,
    total_size bigint,
    avg_file_size numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        b.name as bucket_name,
        COUNT(o.id) as file_count,
        COALESCE(SUM(o.metadata->>'size')::bigint, 0) as total_size,
        COALESCE(AVG((o.metadata->>'size')::bigint), 0) as avg_file_size
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON b.id = o.bucket_id
    WHERE b.name IN ('email-attachments', 'temp-attachments')
    GROUP BY b.name, b.id
    ORDER BY b.name;
$$;

-- =====================================================
-- 6. SAMPLE USAGE
-- =====================================================

-- Example: Get storage statistics
-- SELECT * FROM get_storage_stats();

-- Example: Get URL for a file
-- SELECT get_storage_url('email-attachments', 'user123/email456/document.pdf');

-- Example: Check if file exists
-- SELECT storage_file_exists('email-attachments', 'user123/email456/document.pdf');

-- Example: Cleanup temp files older than 24 hours
-- SELECT cleanup_temp_files(24);

-- =====================================================
-- 7. COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ KMRL Metro Storage Setup Complete!';
    RAISE NOTICE '📁 Created buckets: email-attachments, temp-attachments';
    RAISE NOTICE '🔧 Storage functions created for file management';
    RAISE NOTICE '📊 Run "SELECT * FROM get_storage_stats();" to check storage status';
    RAISE NOTICE '🧹 Run "SELECT cleanup_temp_files(24);" to cleanup old temp files';
END $$;
