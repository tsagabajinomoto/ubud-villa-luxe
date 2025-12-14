-- Drop and recreate villas table with complete schema
DROP TABLE IF EXISTS public.villas CASCADE;

CREATE TABLE public.villas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  price_per_night INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  bedrooms INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER NOT NULL DEFAULT 2,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  coordinates_lat DECIMAL(10,6),
  coordinates_lng DECIMAL(10,6),
  cleaning_fee INTEGER DEFAULT 0,
  service_fee INTEGER DEFAULT 0,
  minimum_stay INTEGER DEFAULT 1,
  booked_dates TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Villas are publicly viewable" ON public.villas FOR SELECT USING (true);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  review TEXT NOT NULL,
  review_date TEXT NOT NULL,
  villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE,
  villa_name TEXT,
  rating_cleanliness INTEGER DEFAULT 5,
  rating_communication INTEGER DEFAULT 5,
  rating_checkin INTEGER DEFAULT 5,
  rating_accuracy INTEGER DEFAULT 5,
  rating_location INTEGER DEFAULT 5,
  rating_value INTEGER DEFAULT 5,
  host_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Testimonials are publicly viewable" ON public.testimonials FOR SELECT USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_whatsapp TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public can create bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings are viewable by email" ON public.bookings FOR SELECT USING (true);

-- Insert villa data
INSERT INTO public.villas (name, tagline, description, short_description, price_per_night, capacity, bedrooms, bathrooms, images, amenities, is_available, rating, review_count, location, coordinates_lat, coordinates_lng, cleaning_fee, service_fee, minimum_stay) VALUES
(
  'Sawah Terrace Villa',
  'Where tradition meets luxury',
  'Experience the magic of Ubud from our stunning Sawah Terrace Villa, featuring breathtaking views of the iconic rice terraces. This luxurious 3-bedroom retreat combines traditional Balinese architecture with modern amenities.

Wake up to the symphony of birds and the gentle rustle of palm trees. Your private infinity pool seems to merge with the emerald rice paddies below, creating a seamless connection with nature.

The villa features an open-plan living area with soaring traditional Alang-Alang roof, handcrafted furniture from local artisans, and a fully equipped kitchen where our private chef can prepare authentic Balinese cuisine.

Each bedroom offers complete privacy with its own ensuite bathroom featuring outdoor showers and garden views. The master suite includes a luxurious soaking tub perfect for romantic evenings.',
  'Stunning rice terrace views with traditional Balinese charm',
  4500000,
  6,
  3,
  3,
  ARRAY['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=80'],
  ARRAY['Private Pool', 'Rice Terrace View', 'Kitchen', 'WiFi', 'AC', 'Daily Breakfast'],
  true,
  4.9,
  127,
  'Tegallalang, Ubud',
  -8.4333,
  115.2833,
  500000,
  350000,
  2
),
(
  'Jungle Hideaway Villa',
  'Your private sanctuary in the wild',
  'Nestled deep within the tropical jungle, our Jungle Hideaway Villa offers complete privacy and tranquility. Wake up to the sounds of nature and enjoy your private infinity pool overlooking the lush canopy.

This is where modern minimalism meets raw natural beauty. Floor-to-ceiling glass walls blur the line between indoor and outdoor living, while the surrounding jungle provides a natural privacy screen.

The villas two bedrooms are designed as separate pavilions connected by covered walkways, ensuring complete privacy for each guest. The open-air living and dining areas float above the jungle canopy.

Practice yoga on your private deck at sunrise, take a dip in the infinity pool at sunset, or simply relax in the day bed listening to the calls of tropical birds.',
  'Private jungle sanctuary with infinity pool',
  3800000,
  4,
  2,
  2,
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=80'],
  ARRAY['Infinity Pool', 'Jungle View', 'Open Living', 'WiFi', 'AC', 'Yoga Deck'],
  true,
  4.8,
  89,
  'Petulu, Ubud',
  -8.4667,
  115.2667,
  400000,
  300000,
  2
),
(
  'Canopy Treehouse Villa',
  'Romance among the treetops',
  'Our most unique property, the Canopy Treehouse Villa is perched among ancient trees offering an unforgettable experience. Perfect for romantic getaways with outdoor bathtub and panoramic forest views.

Built using sustainable bamboo architecture, this one-of-a-kind treehouse seamlessly integrates with its natural surroundings. Wake up suspended among the clouds, with nothing but birdsong and rustling leaves for company.

The outdoor bathtub is positioned to capture the most spectacular sunset views. Watch as the mist rolls in over the forest while you soak under the stars.

Every detail has been crafted for romance – from the four-poster bed draped in white linen to the private dining pavilion where candlelit dinners can be arranged.',
  'Romantic treehouse with outdoor bathtub',
  5200000,
  2,
  1,
  1,
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=80', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80'],
  ARRAY['Outdoor Bathtub', 'Forest View', 'Bamboo Design', 'WiFi', 'Romantic Setup', 'Breakfast'],
  false,
  5.0,
  64,
  'Payangan, Ubud',
  -8.3833,
  115.2500,
  400000,
  400000,
  2
),
(
  'Heritage Garden Villa',
  'Authentic luxury in paradise',
  'A meticulously restored traditional Joglo villa surrounded by tropical gardens and a serene koi pond. Experience authentic Balinese living with all the comforts of a luxury resort.

The heart of this estate is an 80-year-old Javanese Joglo, painstakingly dismantled, transported, and reconstructed here in Ubud. The intricate wooden carvings tell stories of Balinese mythology and craftsmanship.

Four separate bedroom pavilions surround the central living area, each with its own character and garden views. The estate includes a traditional bale for yoga or massage, and extensive gardens with tropical fruit trees.

Our in-house chef specializes in both Balinese and international cuisine, and cooking classes can be arranged. The villa is ideal for families or groups seeking an immersive cultural experience.',
  'Traditional Joglo with tropical gardens',
  6500000,
  8,
  4,
  4,
  ARRAY['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=80', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80'],
  ARRAY['Koi Pond', 'Traditional Joglo', 'Chef Service', 'WiFi', 'AC', 'Private Garden'],
  true,
  4.9,
  156,
  'Central Ubud',
  -8.5069,
  115.2625,
  600000,
  500000,
  3
);