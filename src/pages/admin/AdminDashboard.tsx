import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAdminVillas, useAdminBookings, useAdminTestimonials, useAdminAnalytics } from "@/hooks/useAdmin";
import { formatCurrency } from "@/utils/booking";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AdminDashboard = () => {
  const { villas } = useAdminVillas();
  const { bookings } = useAdminBookings();
  const { testimonials } = useAdminTestimonials();
  const { analytics } = useAdminAnalytics();

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = bookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
    
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
    const avgRating = villas.length > 0 
      ? villas.reduce((sum, v) => sum + (parseFloat(v.rating) || 0), 0) / villas.length 
      : 0;

    return {
      totalVillas: villas.length,
      totalBookings: bookings.length,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      avgRating: avgRating.toFixed(1),
      totalVisitors: analytics.length,
      uniqueSessions: new Set(analytics.map(a => a.session_id)).size,
    };
  }, [villas, bookings, analytics]);

  // Chart data
  const visitorChartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayVisitors = analytics.filter(
        a => a.visited_at.startsWith(dateStr)
      ).length;
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        visitors: dayVisitors,
      });
    }
    return last7Days;
  }, [analytics]);

  const statCards = [
    {
      title: "Total Villas",
      value: stats.totalVillas,
      icon: Home,
      color: "bg-blue-500/10 text-blue-500",
      trend: null,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-purple-500/10 text-purple-500",
      trend: { value: stats.pendingBookings, label: "pending" },
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
      trend: null,
    },
    {
      title: "Avg Rating",
      value: stats.avgRating,
      icon: Star,
      color: "bg-yellow-500/10 text-yellow-500",
      trend: null,
    },
    {
      title: "Page Views",
      value: stats.totalVisitors,
      icon: Eye,
      color: "bg-pink-500/10 text-pink-500",
      trend: null,
    },
    {
      title: "Unique Visitors",
      value: stats.uniqueSessions,
      icon: Users,
      color: "bg-indigo-500/10 text-indigo-500",
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your villas today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated:</span>
          <span className="font-medium text-foreground">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            {stat.trend && (
              <p className="text-xs text-primary mt-2">
                {stat.trend.value} {stat.trend.label}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Visitor Traffic (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorChartData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {booking.guest_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-500/10 text-green-600"
                      : booking.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No bookings yet
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Top Pages
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Page</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(
                analytics.reduce((acc: Record<string, number>, a) => {
                  acc[a.page_path] = (acc[a.page_path] || 0) + 1;
                  return acc;
                }, {})
              ) as [string, number][])
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([path, views]) => (
                  <tr key={path} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground">{path}</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">{views}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
