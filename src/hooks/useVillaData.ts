import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Villa {
  id: string;
  name: string;
  tagline: string | null;
  description: string;
  shortDescription: string | null;
  pricePerNight: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  location: string;
  coordinates: { lat: number; lng: number };
  cleaningFee: number;
  serviceFee: number;
  minimumStay: number;
  bookedDates: string[];
  // Static data for house rules, host, amenities detailed
  houseRules: HouseRule[];
  host: Host;
  amenitiesDetailed: AmenityCategory[];
}

export interface AmenityCategory {
  category: string;
  items: { name: string; icon: string }[];
}

export interface HouseRule {
  title: string;
  description: string;
}

export interface Host {
  name: string;
  photo: string;
  verified: boolean;
  responseRate: number;
  responseTime: string;
  joinedDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  villaId: string;
  villaName: string;
  ratings: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
  hostResponse?: string;
}

// Static data that doesn't need to be in the database
const defaultHost: Host = {
  name: "Made Wijaya",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  verified: true,
  responseRate: 98,
  responseTime: "within an hour",
  joinedDate: "2019",
};

const defaultAmenities: AmenityCategory[] = [
  {
    category: "General",
    items: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Ceiling Fans", icon: "Fan" },
      { name: "Safe Box", icon: "Lock" },
      { name: "Daily Housekeeping", icon: "Sparkles" },
    ],
  },
  {
    category: "Kitchen",
    items: [
      { name: "Full Kitchen", icon: "ChefHat" },
      { name: "Refrigerator", icon: "Refrigerator" },
      { name: "Coffee Machine", icon: "Coffee" },
      { name: "Dishwasher", icon: "Droplets" },
      { name: "Cooking Basics", icon: "Utensils" },
    ],
  },
  {
    category: "Bedroom",
    items: [
      { name: "King Size Bed", icon: "Bed" },
      { name: "Premium Linens", icon: "BedDouble" },
      { name: "Blackout Curtains", icon: "Sun" },
      { name: "Wardrobe", icon: "ShirtIcon" },
    ],
  },
  {
    category: "Bathroom",
    items: [
      { name: "Outdoor Shower", icon: "Droplet" },
      { name: "Bathtub", icon: "Bath" },
      { name: "Premium Toiletries", icon: "Sparkle" },
      { name: "Hair Dryer", icon: "Wind" },
    ],
  },
  {
    category: "Outdoor",
    items: [
      { name: "Private Pool", icon: "Waves" },
      { name: "Garden", icon: "Trees" },
      { name: "BBQ Grill", icon: "Flame" },
      { name: "Sun Loungers", icon: "Armchair" },
      { name: "Outdoor Dining", icon: "UtensilsCrossed" },
    ],
  },
];

const defaultHouseRules: HouseRule[] = [
  { title: "Check-in", description: "From 3:00 PM" },
  { title: "Check-out", description: "Before 11:00 AM" },
  { title: "Smoking", description: "No smoking inside the villa" },
  { title: "Parties", description: "No parties or events allowed" },
  { title: "Pets", description: "Pets are not allowed" },
  { title: "Quiet Hours", description: "10:00 PM - 8:00 AM" },
];

// Transform database row to Villa interface
const transformVilla = (row: any): Villa => ({
  id: row.id,
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  shortDescription: row.short_description,
  pricePerNight: row.price_per_night,
  capacity: row.capacity,
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  images: row.images || [],
  amenities: row.amenities || [],
  isAvailable: row.is_available,
  rating: parseFloat(row.rating) || 4.8,
  reviewCount: row.review_count || 0,
  location: row.location,
  coordinates: {
    lat: parseFloat(row.coordinates_lat) || 0,
    lng: parseFloat(row.coordinates_lng) || 0,
  },
  cleaningFee: row.cleaning_fee || 0,
  serviceFee: row.service_fee || 0,
  minimumStay: row.minimum_stay || 1,
  bookedDates: row.booked_dates || [],
  houseRules: defaultHouseRules,
  host: defaultHost,
  amenitiesDetailed: defaultAmenities,
});

// Transform database row to Testimonial interface
const transformTestimonial = (row: any): Testimonial => ({
  id: row.id,
  name: row.name,
  country: row.country,
  avatar: row.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  rating: row.rating,
  review: row.review,
  date: row.review_date,
  villaId: row.villa_id,
  villaName: row.villa_name || "",
  ratings: {
    cleanliness: row.rating_cleanliness || 5,
    communication: row.rating_communication || 5,
    checkIn: row.rating_checkin || 5,
    accuracy: row.rating_accuracy || 5,
    location: row.rating_location || 5,
    value: row.rating_value || 5,
  },
  hostResponse: row.host_response,
});

// Hook to fetch all villas
export const useVillas = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("villas")
          .select("*")
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;
        setVillas((data || []).map(transformVilla));
      } catch (err) {
        console.error("Error fetching villas:", err);
        setError("Failed to load villas");
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, []);

  return { villas, loading, error };
};

// Hook to fetch single villa by ID
export const useVilla = (id: string | undefined) => {
  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchVilla = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("villas")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        setVilla(data ? transformVilla(data) : null);
      } catch (err) {
        console.error("Error fetching villa:", err);
        setError("Failed to load villa");
      } finally {
        setLoading(false);
      }
    };

    fetchVilla();
  }, [id]);

  return { villa, loading, error };
};

// Hook to fetch all testimonials
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setTestimonials((data || []).map(transformTestimonial));
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

// Hook to fetch testimonials for a specific villa
export const useVillaTestimonials = (villaId: string | undefined) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!villaId) {
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("testimonials")
          .select("*")
          .eq("villa_id", villaId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setTestimonials((data || []).map(transformTestimonial));
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [villaId]);

  return { testimonials, loading, error };
};

// Static data exports
export const stats = [
  { value: 500, suffix: "+", label: "Happy Guests" },
  { value: 4, suffix: "", label: "Premium Villas" },
  { value: 100, suffix: "%", label: "Satisfaction" },
  { value: 5, suffix: "", label: "Years Experience" },
];

export const experiences = [
  {
    title: "Rice Terrace Walks",
    description: "Explore the iconic Tegallalang rice terraces, just minutes from our villas.",
  },
  {
    title: "Temple Visits",
    description: "Discover ancient temples and immerse yourself in Balinese spirituality.",
  },
  {
    title: "Cultural Experiences",
    description: "Traditional dance performances, cooking classes, and artisan workshops.",
  },
];

export const allAmenities = [
  "Private Pool",
  "Kitchen",
  "WiFi",
  "AC",
  "Garden",
  "Parking",
  "Rice Terrace View",
  "Jungle View",
  "Forest View",
  "Daily Breakfast",
  "Chef Service",
  "Yoga Deck",
  "Outdoor Bathtub",
  "Romantic Setup",
];

export const locations = [
  "All Locations",
  "Tegallalang, Ubud",
  "Petulu, Ubud",
  "Payangan, Ubud",
  "Central Ubud",
];
