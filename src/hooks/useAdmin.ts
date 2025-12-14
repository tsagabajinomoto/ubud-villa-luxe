import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export const useAdmin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer admin check
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      setAdminProfile(data);
      setIsAdmin(!!data);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
      setAdminProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAdminProfile(null);
    setIsAdmin(false);
  };

  return {
    user,
    session,
    adminProfile,
    isAdmin,
    loading,
    signIn,
    signOut,
  };
};

// Analytics tracking hook
export const useAnalytics = () => {
  const trackPageView = async (pagePath: string, pageTitle?: string) => {
    const sessionId = getOrCreateSessionId();
    
    try {
      await supabase.from("visitor_analytics").insert({
        page_path: pagePath,
        page_title: pageTitle || document.title,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        session_id: sessionId,
      });
    } catch (err) {
      console.error("Error tracking page view:", err);
    }
  };

  return { trackPageView };
};

const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

// Admin data hooks
export const useAdminVillas = () => {
  const [villas, setVillas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVillas = async () => {
    setLoading(true);
    const { data } = await supabase.from("villas").select("*").order("created_at");
    setVillas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVillas();
  }, []);

  const createVilla = async (villa: any) => {
    const { data, error } = await supabase.from("villas").insert(villa).select().single();
    if (!error) fetchVillas();
    return { data, error };
  };

  const updateVilla = async (id: string, updates: any) => {
    const { data, error } = await supabase.from("villas").update(updates).eq("id", id).select().single();
    if (!error) fetchVillas();
    return { data, error };
  };

  const deleteVilla = async (id: string) => {
    const { error } = await supabase.from("villas").delete().eq("id", id);
    if (!error) fetchVillas();
    return { error };
  };

  return { villas, loading, fetchVillas, createVilla, updateVilla, deleteVilla };
};

export const useAdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const createTestimonial = async (testimonial: any) => {
    const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single();
    if (!error) fetchTestimonials();
    return { data, error };
  };

  const updateTestimonial = async (id: string, updates: any) => {
    const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single();
    if (!error) fetchTestimonials();
    return { data, error };
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) fetchTestimonials();
    return { error };
  };

  return { testimonials, loading, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
};

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    const { data, error } = await supabase.from("bookings").update({ status }).eq("id", id).select().single();
    if (!error) fetchBookings();
    return { data, error };
  };

  return { bookings, loading, fetchBookings, updateBookingStatus };
};

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (days = 30) => {
    setLoading(true);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data } = await supabase
      .from("visitor_analytics")
      .select("*")
      .gte("visited_at", fromDate.toISOString())
      .order("visited_at", { ascending: false });
    
    setAnalytics(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, fetchAnalytics };
};
