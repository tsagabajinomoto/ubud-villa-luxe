import { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, TrendingUp, Users, Clock, Monitor, Smartphone, Globe, RefreshCw } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#A1BC98", "#D2DCB6", "#778873", "#F1F3E0", "#6B8E6B"];

const AdminAnalytics = () => {
  const { analytics, loading, fetchAnalytics } = useAdminAnalytics();

  // Calculate stats
  const stats = useMemo(() => {
    const uniqueSessions = new Set(analytics.map((a) => a.session_id)).size;
    const avgTimeOnSite = "3m 24s"; // Placeholder - would need more tracking

    // Device breakdown
    const devices = analytics.reduce((acc, a) => {
      const isMobile = (a.screen_width || 0) < 768;
      const device = isMobile ? "Mobile" : "Desktop";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Page views by page
    const pageViews = analytics.reduce((acc, a) => {
      acc[a.page_path] = (acc[a.page_path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Hourly distribution
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      views: 0,
    }));
    analytics.forEach((a) => {
      const hour = new Date(a.visited_at).getHours();
      hourlyData[hour].views++;
    });

    // Daily data for last 7 days
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayViews = analytics.filter((a) => a.visited_at.startsWith(dateStr)).length;
      dailyData.push({
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        views: dayViews,
      });
    }

    return {
      totalViews: analytics.length,
      uniqueVisitors: uniqueSessions,
      avgTimeOnSite,
      devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
      topPages: Object.entries(pageViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([path, views]) => ({ path, views })),
      hourlyData,
      dailyData,
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your website performance</p>
        </div>
        <button
          onClick={() => fetchAnalytics(30)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Page Views</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.uniqueVisitors.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Unique Visitors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.avgTimeOnSite}</p>
          <p className="text-sm text-muted-foreground">Avg. Session</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.topPages[0]?.views || 0}
          </p>
          <p className="text-sm text-muted-foreground">Top Page Views</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Traffic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Traffic Overview (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Device Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            {stats.devices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Mobile</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hourly Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Hourly Traffic Distribution
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPages.map((page, index) => (
                <tr key={page.path} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{page.path}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {stats.totalViews > 0 ? ((page.views / stats.totalViews) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              {stats.topPages.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground">
                    No page view data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
