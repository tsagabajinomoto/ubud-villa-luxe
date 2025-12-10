import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingData {
  villaId: string;
  villaName: string;
  villaImage: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  nightlyRate: number;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}

export interface GuestDetails {
  fullName: string;
  email: string;
  whatsapp: string;
  specialRequests: string;
}

export interface CompletedBooking {
  id: string;
  referenceNumber: string;
  villaId: string;
  villaName: string;
  villaImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  guestDetails: GuestDetails;
  paymentMethod: string;
  createdAt: string;
}

interface BookingState {
  booking: BookingData | null;
  guestDetails: GuestDetails | null;
  completedBookings: CompletedBooking[];
  globalBookedDates: Record<string, string[]>; // villaId -> booked dates
  setBooking: (booking: BookingData | null) => void;
  setGuestDetails: (details: GuestDetails) => void;
  clearBooking: () => void;
  addCompletedBooking: (booking: CompletedBooking) => void;
  cancelBooking: (bookingId: string) => void;
  addBookedDates: (villaId: string, dates: string[]) => void;
  isDateGloballyBooked: (villaId: string, date: string) => boolean;
}

const generateReferenceNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SU-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      booking: null,
      guestDetails: null,
      completedBookings: [],
      globalBookedDates: {},
      setBooking: (booking) => set({ booking }),
      setGuestDetails: (details) => set({ guestDetails: details }),
      clearBooking: () => set({ booking: null, guestDetails: null }),
      addCompletedBooking: (booking) =>
        set((state) => ({
          completedBookings: [...state.completedBookings, booking],
        })),
      cancelBooking: (bookingId) =>
        set((state) => ({
          completedBookings: state.completedBookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        })),
      addBookedDates: (villaId, dates) =>
        set((state) => ({
          globalBookedDates: {
            ...state.globalBookedDates,
            [villaId]: [...(state.globalBookedDates[villaId] || []), ...dates],
          },
        })),
      isDateGloballyBooked: (villaId, date) => {
        const state = get();
        return state.globalBookedDates[villaId]?.includes(date) || false;
      },
    }),
    {
      name: 'stayinubud-booking',
      partialize: (state) => ({
        booking: state.booking,
        guestDetails: state.guestDetails,
        completedBookings: state.completedBookings,
        globalBookedDates: state.globalBookedDates,
      }),
    }
  )
);

export { generateReferenceNumber };

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
