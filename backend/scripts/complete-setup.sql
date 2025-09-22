-- =====================================================
-- KMRL Metro Email Classification System - Complete Setup
-- =====================================================
-- This script sets up the complete database schema and storage
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE USERS TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  name character varying(255) NOT NULL,
  department character varying(100) NOT NULL,
  role character varying(20) NULL DEFAULT 'employee'::character varying,
  phone character varying(50) NULL,
  employee_id character varying(50) NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_role_check CHECK (
    (
      (role)::text = any (
        (
          array[
            'admin'::character varying,
            'manager'::character varying,
            'employee'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users USING btree (department) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users USING btree (role) TABLESPACE pg_default;

-- =====================================================
-- 2. CREATE EMAIL DATA TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.email_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sender_email character varying(255) NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  email_date date NOT NULL,
  filename character varying(255) NULL,
  attachment_link text NULL,
  attachment_type character varying(100) NULL,
  gmail_message_id character varying(255) NOT NULL,
  gmail_thread_id character varying(255) NULL,
  is_relevant boolean NULL DEFAULT false,
  summary text NULL,
  key_points text NULL,
  -- Classification fields
  document_category character varying(50) NULL,
  department character varying(50) NULL,
  priority_level character varying(20) NULL,
  classification_reason text NULL,
  -- Processing status
  is_processed boolean NULL DEFAULT false,
  processing_status character varying(50) NULL DEFAULT 'pending',
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT email_data_pkey PRIMARY KEY (id),
  CONSTRAINT email_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT email_data_document_category_check CHECK (
    document_category IN (
      'CRITICAL_SAFETY', 'BUDGET_FINANCE', 'HR_TRAINING', 'OPERATIONS',
      'COMPLIANCE_AUDIT', 'COMMUNICATION', 'OTHER'
    )
  ),
  CONSTRAINT email_data_priority_level_check CHECK (
    priority_level IN ('URGENT', 'HIGH', 'MEDIUM', 'LOW')
  ),
  CONSTRAINT email_data_processing_status_check CHECK (
    processing_status IN ('pending', 'processing', 'completed', 'failed')
  )
) TABLESPACE pg_default;

-- =====================================================
-- 3. CREATE EMAIL ATTACHMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.email_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email_data_id uuid NOT NULL,
  original_filename character varying(255) NOT NULL,
  unique_filename character varying(255) NOT NULL,
  file_path text NOT NULL,
  public_url text NULL,
  storage_id text NULL, -- Supabase storage file ID
  mime_type character varying(100) NOT NULL,
  file_size bigint NOT NULL,
  file_extension character varying(10) NULL,
  extracted_content text NULL,
  extracted_text text NULL,
  content_metadata jsonb NULL,
  is_processed boolean NULL DEFAULT false,
  processing_status character varying(50) NULL DEFAULT 'pending',
  error_message text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT email_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT email_attachments_email_data_id_fkey FOREIGN KEY (email_data_id) REFERENCES public.email_data(id) ON DELETE CASCADE,
  CONSTRAINT email_attachments_processing_status_check CHECK (
    processing_status IN ('pending', 'processing', 'completed', 'failed')
  )
) TABLESPACE pg_default;

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

-- Email data indexes
CREATE INDEX IF NOT EXISTS idx_email_data_user_id ON public.email_data USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_email_date ON public.email_data USING btree (email_date) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_sender_email ON public.email_data USING btree (sender_email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_is_relevant ON public.email_data USING btree (is_relevant) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_gmail_message_id ON public.email_data USING btree (gmail_message_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_document_category ON public.email_data USING btree (document_category) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_department ON public.email_data USING btree (department) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_priority_level ON public.email_data USING btree (priority_level) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_is_processed ON public.email_data USING btree (is_processed) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_data_processing_status ON public.email_data USING btree (processing_status) TABLESPACE pg_default;

-- Email attachments indexes
CREATE INDEX IF NOT EXISTS idx_email_attachments_email_data_id ON public.email_attachments USING btree (email_data_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_file_extension ON public.email_attachments USING btree (file_extension) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_is_processed ON public.email_attachments USING btree (is_processed) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_processing_status ON public.email_attachments USING btree (processing_status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_storage_id ON public.email_attachments USING btree (storage_id) TABLESPACE pg_default;

-- =====================================================
-- 5. CREATE TRIGGERS
-- =====================================================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_data_updated_at ON public.email_data;
CREATE TRIGGER update_email_data_updated_at
  BEFORE UPDATE ON public.email_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_attachments_updated_at ON public.email_attachments;
CREATE TRIGGER update_email_attachments_updated_at
  BEFORE UPDATE ON public.email_attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. CREATE STORAGE BUCKETS
-- =====================================================

-- Create email-attachments bucket
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

-- Create temp-attachments bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'temp-attachments',
    'temp-attachments',
    true,
    104857600, -- 100MB limit
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
-- 7. STORAGE CONFIGURATION
-- =====================================================

-- Disable RLS on storage.objects for development
-- Uncomment the following line for development setup
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. UTILITY FUNCTIONS
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

-- Function to cleanup old temp files
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
        COALESCE(SUM((o.metadata->>'size')::bigint), 0) as total_size,
        COALESCE(AVG((o.metadata->>'size')::bigint), 0) as avg_file_size
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON b.id = o.bucket_id
    WHERE b.name IN ('email-attachments', 'temp-attachments')
    GROUP BY b.name, b.id
    ORDER BY b.name;
$$;

-- Function to get email classification statistics
CREATE OR REPLACE FUNCTION get_email_classification_stats(user_id_param uuid DEFAULT NULL)
RETURNS TABLE(
    total_emails bigint,
    relevant_emails bigint,
    processed_emails bigint,
    by_category jsonb,
    by_department jsonb,
    by_priority jsonb,
    urgent_high_count bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    WITH email_stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE is_relevant = true) as relevant,
            COUNT(*) FILTER (WHERE is_processed = true) as processed,
            COUNT(*) FILTER (WHERE priority_level IN ('URGENT', 'HIGH')) as urgent_high
        FROM email_data 
        WHERE (user_id_param IS NULL OR user_id = user_id_param)
    ),
    category_stats AS (
        SELECT jsonb_object_agg(
            COALESCE(document_category, 'UNCLASSIFIED'), 
            count
        ) as categories
        FROM (
            SELECT document_category, COUNT(*) as count
            FROM email_data 
            WHERE (user_id_param IS NULL OR user_id = user_id_param)
            GROUP BY document_category
        ) t
    ),
    department_stats AS (
        SELECT jsonb_object_agg(
            COALESCE(department, 'UNCLASSIFIED'), 
            count
        ) as departments
        FROM (
            SELECT department, COUNT(*) as count
            FROM email_data 
            WHERE (user_id_param IS NULL OR user_id = user_id_param)
            GROUP BY department
        ) t
    ),
    priority_stats AS (
        SELECT jsonb_object_agg(
            COALESCE(priority_level, 'UNCLASSIFIED'), 
            count
        ) as priorities
        FROM (
            SELECT priority_level, COUNT(*) as count
            FROM email_data 
            WHERE (user_id_param IS NULL OR user_id = user_id_param)
            GROUP BY priority_level
        ) t
    )
    SELECT 
        es.total as total_emails,
        es.relevant as relevant_emails,
        es.processed as processed_emails,
        cs.categories as by_category,
        ds.departments as by_department,
        ps.priorities as by_priority,
        es.urgent_high as urgent_high_count
    FROM email_stats es, category_stats cs, department_stats ds, priority_stats ps;
$$;

-- =====================================================
-- 9. ADD COMMENTS
-- =====================================================

COMMENT ON TABLE public.users IS 'User accounts for KMRL Metro system';
COMMENT ON TABLE public.email_data IS 'Stores extracted email data from Gmail API for each user';
COMMENT ON TABLE public.email_attachments IS 'Stores attachment details and extracted content';

-- =====================================================
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Check table creation
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN tablename IN ('users', 'email_data', 'email_attachments') THEN '✅ Created'
        ELSE '❌ Missing'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'email_data', 'email_attachments')
ORDER BY tablename;

-- Check storage buckets
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN name IN ('email-attachments', 'temp-attachments') THEN '✅ Created'
        ELSE '❌ Missing'
    END as status
FROM storage.buckets 
WHERE name IN ('email-attachments', 'temp-attachments')
ORDER BY name;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '✅ RLS Disabled (Good for development)'
        ELSE '⚠️ RLS Enabled (May need policies)'
    END as status
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- =====================================================
-- 11. COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 KMRL Metro Email Classification System Setup Complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Database Tables Created:';
    RAISE NOTICE '   ✅ users - User accounts';
    RAISE NOTICE '   ✅ email_data - Email data with classification';
    RAISE NOTICE '   ✅ email_attachments - Attachment storage';
    RAISE NOTICE '';
    RAISE NOTICE '📁 Storage Buckets Created:';
    RAISE NOTICE '   ✅ email-attachments - Permanent attachment storage';
    RAISE NOTICE '   ✅ temp-attachments - Temporary file processing';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Utility Functions Created:';
    RAISE NOTICE '   ✅ get_storage_url() - Get file URLs';
    RAISE NOTICE '   ✅ storage_file_exists() - Check file existence';
    RAISE NOTICE '   ✅ cleanup_temp_files() - Cleanup old files';
    RAISE NOTICE '   ✅ get_storage_stats() - Storage statistics';
    RAISE NOTICE '   ✅ get_email_classification_stats() - Email statistics';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '   1. Install dependencies: npm install';
    RAISE NOTICE '   2. Configure .env file with API keys';
    RAISE NOTICE '   3. Set up Gmail API credentials';
    RAISE NOTICE '   4. Start the server: node server.js';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test Queries:';
    RAISE NOTICE '   SELECT * FROM get_storage_stats();';
    RAISE NOTICE '   SELECT * FROM get_email_classification_stats();';
    RAISE NOTICE '   SELECT cleanup_temp_files(24);';
END $$;
