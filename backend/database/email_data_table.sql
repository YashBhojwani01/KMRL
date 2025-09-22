-- Create email_data table to store extracted email information
CREATE TABLE public.email_data (
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

-- Create email_attachments table to store attachment details
CREATE TABLE public.email_attachments (
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

-- Create indexes for better query performance
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

-- Create indexes for email_attachments table
CREATE INDEX IF NOT EXISTS idx_email_attachments_email_data_id ON public.email_attachments USING btree (email_data_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_file_extension ON public.email_attachments USING btree (file_extension) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_is_processed ON public.email_attachments USING btree (is_processed) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_processing_status ON public.email_attachments USING btree (processing_status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_email_attachments_storage_id ON public.email_attachments USING btree (storage_id) TABLESPACE pg_default;

-- Create trigger to update updated_at column
CREATE TRIGGER update_email_data_updated_at
  BEFORE UPDATE ON email_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_attachments_updated_at
  BEFORE UPDATE ON email_attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.email_data IS 'Stores extracted email data from Gmail API for each user';
COMMENT ON COLUMN public.email_data.user_id IS 'Foreign key reference to users table';
COMMENT ON COLUMN public.email_data.sender_email IS 'Email address of the sender';
COMMENT ON COLUMN public.email_data.subject IS 'Subject line of the email';
COMMENT ON COLUMN public.email_data.body IS 'Body content of the email';
COMMENT ON COLUMN public.email_data.email_date IS 'Date when the email was received';
COMMENT ON COLUMN public.email_data.filename IS 'Name of attachment file if any';
COMMENT ON COLUMN public.email_data.attachment_link IS 'Path or link to the attachment file';
COMMENT ON COLUMN public.email_data.attachment_type IS 'MIME type of the attachment';
COMMENT ON COLUMN public.email_data.gmail_message_id IS 'Unique Gmail message ID for deduplication';
COMMENT ON COLUMN public.email_data.gmail_thread_id IS 'Gmail thread ID for grouping related emails';
COMMENT ON COLUMN public.email_data.is_relevant IS 'Flag to mark if email is relevant to KMRL operations';
COMMENT ON COLUMN public.email_data.summary IS 'AI-generated summary of the email';
COMMENT ON COLUMN public.email_data.key_points IS 'AI-extracted key points from the email';
COMMENT ON COLUMN public.email_data.document_category IS 'AI-classified document category';
COMMENT ON COLUMN public.email_data.department IS 'AI-classified department';
COMMENT ON COLUMN public.email_data.priority_level IS 'AI-classified priority level';
COMMENT ON COLUMN public.email_data.classification_reason IS 'AI explanation for classification';
COMMENT ON COLUMN public.email_data.is_processed IS 'Flag to mark if email has been processed';
COMMENT ON COLUMN public.email_data.processing_status IS 'Current processing status of the email';

COMMENT ON TABLE public.email_attachments IS 'Stores attachment details and extracted content';
COMMENT ON COLUMN public.email_attachments.email_data_id IS 'Foreign key reference to email_data table';
COMMENT ON COLUMN public.email_attachments.original_filename IS 'Original filename of the attachment';
COMMENT ON COLUMN public.email_attachments.unique_filename IS 'Unique filename for storage';
COMMENT ON COLUMN public.email_attachments.file_path IS 'Path to the attachment file';
COMMENT ON COLUMN public.email_attachments.public_url IS 'Public URL for accessing the attachment';
COMMENT ON COLUMN public.email_attachments.storage_id IS 'Supabase storage file ID';
COMMENT ON COLUMN public.email_attachments.mime_type IS 'MIME type of the attachment';
COMMENT ON COLUMN public.email_attachments.file_size IS 'Size of the attachment in bytes';
COMMENT ON COLUMN public.email_attachments.file_extension IS 'File extension of the attachment';
COMMENT ON COLUMN public.email_attachments.extracted_content IS 'Raw extracted content from the attachment';
COMMENT ON COLUMN public.email_attachments.extracted_text IS 'Processed text content from the attachment';
COMMENT ON COLUMN public.email_attachments.content_metadata IS 'Metadata about the extraction process';
COMMENT ON COLUMN public.email_attachments.is_processed IS 'Flag to mark if attachment has been processed';
COMMENT ON COLUMN public.email_attachments.processing_status IS 'Current processing status of the attachment';
COMMENT ON COLUMN public.email_attachments.error_message IS 'Error message if processing failed';
