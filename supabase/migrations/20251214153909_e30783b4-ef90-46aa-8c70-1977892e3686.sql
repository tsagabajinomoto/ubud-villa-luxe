-- Create villas table for the hero slider
CREATE TABLE public.villas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 2,
  bathrooms INTEGER DEFAULT 2,
  capacity INTEGER DEFAULT 4,
  rating DECIMAL(2,1) DEFAULT 4.8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;

-- Allow public read access (villas are public listings)
CREATE POLICY "Villas are publicly viewable" 
ON public.villas 
FOR SELECT 
USING (true);

-- Insert sample villa data
INSERT INTO public.villas (name, description, price, image_url, location, bedrooms, bathrooms, capacity, rating) VALUES
('Villa Serenity', 'Jungle View Private Pool', 'IDR 2.500.000', '/placeholder.svg', 'Ubud, Bali', 3, 2, 6, 4.9),
('Villa Harmony', 'Rice Terrace Panorama', 'IDR 3.200.000', '/placeholder.svg', 'Tegallalang, Bali', 4, 3, 8, 4.8),
('Villa Tranquil', 'Traditional Balinese Design', 'IDR 1.800.000', '/placeholder.svg', 'Ubud Center, Bali', 2, 2, 4, 4.7),
('Villa Paradise', 'Modern Luxury Retreat', 'IDR 4.500.000', '/placeholder.svg', 'Kedewatan, Bali', 5, 4, 10, 5.0);