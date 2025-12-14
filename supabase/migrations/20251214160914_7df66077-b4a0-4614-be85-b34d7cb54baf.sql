-- Create admin profiles table
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin profiles
CREATE POLICY "Admins can view own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can update own profile" ON public.admin_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create visitor analytics table
CREATE TABLE public.visitor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  country TEXT,
  city TEXT,
  session_id TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Public can insert analytics (tracking)
CREATE POLICY "Anyone can insert analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()
  )
$$;

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics" ON public.visitor_analytics FOR SELECT USING (public.is_admin());

-- Update villa policies for admin CRUD
CREATE POLICY "Admins can insert villas" ON public.villas FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update villas" ON public.villas FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete villas" ON public.villas FOR DELETE USING (public.is_admin());

-- Update testimonial policies for admin CRUD
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());

-- Update booking policies for admin
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE USING (public.is_admin());

-- Create site settings table for managing images and content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());

-- Insert default hero images
INSERT INTO public.site_settings (key, value) VALUES
('hero_images', '["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"]'),
('experience_images', '{"rice_terrace": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800", "temple": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800", "culture": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800"}'),
('site_logo', '{"url": "/logo.png", "alt": "StayinUBUD"}');