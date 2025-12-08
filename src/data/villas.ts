import villa1 from "@/assets/villa-1.jpg";
import villa2 from "@/assets/villa-2.jpg";
import villa3 from "@/assets/villa-3.jpg";
import villa4 from "@/assets/villa-4.jpg";

export interface Villa {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  amenities: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
}

export const villas: Villa[] = [
  {
    id: "1",
    name: "Sawah Terrace Villa",
    description: "Experience the magic of Ubud from our stunning Sawah Terrace Villa, featuring breathtaking views of the iconic rice terraces. This luxurious 3-bedroom retreat combines traditional Balinese architecture with modern amenities.",
    shortDescription: "Stunning rice terrace views with traditional Balinese charm",
    pricePerNight: 4500000,
    capacity: 6,
    bedrooms: 3,
    bathrooms: 3,
    image: villa1,
    amenities: ["Private Pool", "Rice Terrace View", "Kitchen", "WiFi", "AC", "Daily Breakfast"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: "2",
    name: "Jungle Hideaway Villa",
    description: "Nestled deep within the tropical jungle, our Jungle Hideaway Villa offers complete privacy and tranquility. Wake up to the sounds of nature and enjoy your private infinity pool overlooking the lush canopy.",
    shortDescription: "Private jungle sanctuary with infinity pool",
    pricePerNight: 3800000,
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    image: villa2,
    amenities: ["Infinity Pool", "Jungle View", "Open Living", "WiFi", "AC", "Yoga Deck"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Canopy Treehouse Villa",
    description: "Our most unique property, the Canopy Treehouse Villa is perched among ancient trees offering an unforgettable experience. Perfect for romantic getaways with outdoor bathtub and panoramic forest views.",
    shortDescription: "Romantic treehouse with outdoor bathtub",
    pricePerNight: 5200000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: villa3,
    amenities: ["Outdoor Bathtub", "Forest View", "Bamboo Design", "WiFi", "Romantic Setup", "Breakfast"],
    isAvailable: false,
    rating: 5.0,
    reviewCount: 64,
  },
  {
    id: "4",
    name: "Heritage Garden Villa",
    description: "A meticulously restored traditional Joglo villa surrounded by tropical gardens and a serene koi pond. Experience authentic Balinese living with all the comforts of a luxury resort.",
    shortDescription: "Traditional Joglo with tropical gardens",
    pricePerNight: 6500000,
    capacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    image: villa4,
    amenities: ["Koi Pond", "Traditional Joglo", "Chef Service", "WiFi", "AC", "Private Garden"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 156,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  villaName: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    country: "Australia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    review: "Absolutely magical experience! The Sawah Terrace Villa exceeded all our expectations. Waking up to the rice terrace views every morning was like a dream. The staff was incredibly attentive and made our honeymoon unforgettable.",
    date: "November 2024",
    villaName: "Sawah Terrace Villa",
  },
  {
    id: "2",
    name: "James Chen",
    country: "Singapore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    review: "The Jungle Hideaway Villa is a true sanctuary. Perfect for disconnecting from the busy city life. The infinity pool overlooking the jungle is absolutely stunning. Will definitely be coming back!",
    date: "October 2024",
    villaName: "Jungle Hideaway Villa",
  },
  {
    id: "3",
    name: "Emma Thompson",
    country: "United Kingdom",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    review: "The Canopy Treehouse was the most romantic experience we've ever had. Soaking in the outdoor bathtub while surrounded by misty forest - simply incredible. A must for couples!",
    date: "September 2024",
    villaName: "Canopy Treehouse Villa",
  },
  {
    id: "4",
    name: "Michael Bauer",
    country: "Germany",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    review: "Heritage Garden Villa is where authentic Bali meets luxury. The traditional architecture, the beautiful gardens, and the exceptional service made our family vacation perfect.",
    date: "August 2024",
    villaName: "Heritage Garden Villa",
  },
  {
    id: "5",
    name: "Yuki Tanaka",
    country: "Japan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    review: "Every detail was thoughtfully curated. From the welcome flowers to the daily breakfast, everything was perfect. StayinUBUD truly understands hospitality.",
    date: "July 2024",
    villaName: "Sawah Terrace Villa",
  },
];

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
