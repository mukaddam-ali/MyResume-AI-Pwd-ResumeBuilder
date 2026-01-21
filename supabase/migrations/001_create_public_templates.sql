-- Create public_templates table
CREATE TABLE IF NOT EXISTS public_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL,
  resume_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_public_templates_user ON public_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_public_templates_template ON public_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_public_templates_created ON public_templates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON public_templates;
DROP POLICY IF EXISTS "Users can insert their own templates" ON public_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public_templates;

-- Policy: Anyone can read public templates (even unauthenticated users)
CREATE POLICY "Public templates are viewable by everyone"
  ON public_templates FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own templates
CREATE POLICY "Users can insert their own templates"
  ON public_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own templates
CREATE POLICY "Users can update their own templates"
  ON public_templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON public_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE public_templates IS 'Stores user-shared resume templates that are publicly visible';
