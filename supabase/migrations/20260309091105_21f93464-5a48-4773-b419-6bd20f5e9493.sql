
-- Job listings table
CREATE TABLE public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'full-time',
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  cv_url TEXT,
  experience_years INTEGER,
  education TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can view active job listings
CREATE POLICY "Anyone can view active jobs" ON public.job_listings
  FOR SELECT USING (is_active = true);

-- Admins can manage job listings
CREATE POLICY "Admins can manage jobs" ON public.job_listings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit job applications (public form)
CREATE POLICY "Anyone can submit applications" ON public.job_applications
  FOR INSERT WITH CHECK (true);

-- Admins can manage applications
CREATE POLICY "Admins can manage applications" ON public.job_applications
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-uploads', 'cv-uploads', false);

-- Allow anyone to upload CVs
CREATE POLICY "Anyone can upload CVs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cv-uploads');

-- Admins can read CVs
CREATE POLICY "Admins can read CVs" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-uploads' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert the Restaurant Interior Designer job
INSERT INTO public.job_listings (title, department, location, type, description, requirements, responsibilities, salary_range)
VALUES (
  'Restaurant Interior Designer',
  'Design',
  'On-site / Hybrid',
  'contract',
  'We are seeking a talented and experienced Restaurant Interior Designer to lead the interior design of a premium restaurant project for one of our clients. You will be responsible for creating an inviting, functional, and aesthetically stunning dining environment that reflects the brand identity and enhances the guest experience.',
  ARRAY[
    'Diploma or Degree in Interior Design, Architecture, or related field',
    '3+ years of experience in restaurant or hospitality interior design',
    'Strong portfolio showcasing restaurant or commercial design projects',
    'Proficiency in AutoCAD, SketchUp, 3ds Max, or similar tools',
    'Knowledge of building codes, health regulations, and accessibility standards',
    'Excellent communication and project management skills',
    'Ability to work within budget and timeline constraints'
  ],
  ARRAY[
    'Develop full interior design concepts for a new restaurant space',
    'Create mood boards, floor plans, 3D renderings, and material selections',
    'Collaborate with architects, contractors, and the client team',
    'Select furniture, fixtures, lighting, and finishes that align with the brand',
    'Ensure compliance with local building codes and safety regulations',
    'Oversee installation and fit-out to ensure design intent is realized',
    'Manage design timelines and coordinate with project stakeholders'
  ],
  'Competitive – based on experience'
);

-- Updated_at trigger
CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
