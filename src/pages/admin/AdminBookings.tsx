import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Check, X, Clock, Loader2 } from "lucide-react";
import { useAdminBookings } from "@/hooks/useAdmin";
import { formatCurrency } from "@/utils/booking";
import { toast } from "@/hooks/use-toast";

const AdminBookings = () => {
  const { bookings, loading, updateBookingStatus } = useAdminBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.guest_email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await updateBookingStatus(id, status);
    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Booking ${status}` });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">Manage guest reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by guest name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
          <p className="text-sm text-green-600">Confirmed</p>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {bookings.filter((b) => b.status === "cancelled").length}
          </p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Guest</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Dates</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Guests</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-foreground">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-foreground">{booking.guests}</td>
                  <td className="py-4 px-4 font-medium text-foreground">
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            className="p-2 text-green-600 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-semibold">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-medium text-foreground">{selectedBooking.guest_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedBooking.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium text-foreground">{selectedBooking.guest_whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium text-foreground">{selectedBooking.guests} guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedBooking.check_in).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedBooking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(selectedBooking.total_price)}
                  </p>
                </div>
                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="text-foreground bg-secondary/50 p-3 rounded-xl mt-1">
                      {selectedBooking.special_requests}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-4">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              {selectedBooking.status === "pending" && (
                <div className="flex gap-3 p-6 border-t border-border">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "confirmed");
                      setSelectedBooking(null);
                    }}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "cancelled");
                      setSelectedBooking(null);
                    }}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
