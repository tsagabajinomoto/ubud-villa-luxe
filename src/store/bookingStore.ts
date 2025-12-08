import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingData {
  villaId: string;
  villaName: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  nightlyRate: number;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}

interface BookingState {
  booking: BookingData | null;
  setBooking: (booking: BookingData | null) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      booking: null,
      setBooking: (booking) => set({ booking }),
      clearBooking: () => set({ booking: null }),
    }),
    {
      name: 'stayinubud-booking',
    }
  )
);

export interface FilterState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  priceRange: [number, number];
  amenities: string[];
  location: string;
  sortBy: 'price-asc' | 'price-desc' | 'capacity' | 'rating';
}

interface FilterStore extends FilterState {
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setGuests: (guests: number) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleAmenity: (amenity: string) => void;
  setLocation: (location: string) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  checkIn: null,
  checkOut: null,
  guests: 2,
  priceRange: [0, 10000000],
  amenities: [],
  location: 'All Locations',
  sortBy: 'rating',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialFilters,
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setGuests: (guests) => set({ guests }),
  setPriceRange: (range) => set({ priceRange: range }),
  toggleAmenity: (amenity) =>
    set((state) => ({
      amenities: state.amenities.includes(amenity)
        ? state.amenities.filter((a) => a !== amenity)
        : [...state.amenities, amenity],
    })),
  setLocation: (location) => set({ location }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialFilters),
}));
