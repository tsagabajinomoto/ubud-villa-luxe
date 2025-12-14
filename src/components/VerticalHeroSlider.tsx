import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Controller, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { MapPin, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Import Swiper styles
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

interface Villa {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  location: string;
}

const VerticalHeroSlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch villas from database
  useEffect(() => {
    const fetchVillas = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("villas")
          .select("id, name, description, price, image_url, location")
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;
        
        setVillas(data || []);
      } catch (err) {
        console.error("Error fetching villas:", err);
        setError("Failed to load villas");
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="relative h-screen w-full bg-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-background/70 font-body">Loading villas...</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!villas.length) {
    return (
      <section className="relative h-screen w-full bg-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-background/70 font-body text-lg">No villas available at the moment.</p>
          <Link to="/villas" className="mt-4 inline-block text-primary hover:underline">
            Browse all villas
          </Link>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative h-screen w-full bg-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-body">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full bg-foreground overflow-hidden">
      <div className="flex h-full">
        {/* Main Slider - Left Side */}
        <div className="relative w-full lg:w-[75%] h-full">
          <Swiper
            modules={[Thumbs, Controller, Autoplay, EffectFade]}
            direction="vertical"
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            controller={{ control: mainSwiper }}
            onSwiper={setMainSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            className="h-full w-full"
          >
            {villas.map((villa, index) => (
              <SwiperSlide key={villa.id} className="relative">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                  style={{ backgroundImage: `url(${villa.image_url})` }}
                >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
                  <div className="max-w-2xl">
                    {/* Location Badge */}
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full mb-6 animate-fade-up"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-background/90 text-sm font-body tracking-wide">
                        {villa.location}
                      </span>
                    </div>

                    {/* Villa Name */}
                    <h2 
                      className="font-display text-5xl lg:text-7xl text-background font-bold mb-4 leading-tight animate-fade-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      {villa.name}
                    </h2>

                    {/* Description */}
                    <p 
                      className="text-background/80 text-xl lg:text-2xl font-body mb-4 animate-fade-up"
                      style={{ animationDelay: "0.3s" }}
                    >
                      {villa.description}
                    </p>

                    {/* Price */}
                    <p 
                      className="text-primary text-3xl lg:text-4xl font-display font-semibold mb-8 animate-fade-up"
                      style={{ animationDelay: "0.4s" }}
                    >
                      {villa.price}<span className="text-lg text-background/60">/night</span>
                    </p>

                    {/* CTA Buttons */}
                    <div 
                      className="flex flex-wrap gap-4 animate-fade-up"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Link
                        to={`/villas/${villa.id}`}
                        className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-body font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                      >
                        Book Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-background/10 hover:bg-background/20 backdrop-blur-sm border border-background/30 text-background px-8 py-4 rounded-lg font-body font-medium transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Slide Number */}
                <div className="absolute bottom-8 left-8 lg:left-16 z-10">
                  <span className="font-display text-8xl lg:text-9xl font-bold text-background/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Thumbnail Slider - Right Side */}
        <div className="hidden lg:block w-[25%] h-full bg-foreground/95 border-l border-primary/20">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="mb-6 px-4">
              <h3 className="font-display text-background text-lg font-semibold mb-1">
                Featured Villas
              </h3>
              <p className="text-background/50 text-sm font-body">
                {activeIndex + 1} of {villas.length}
              </p>
            </div>
            
            <Swiper
              modules={[Thumbs, Controller]}
              direction="vertical"
              slidesPerView={3}
              spaceBetween={16}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              controller={{ control: thumbsSwiper }}
              className="h-[500px] w-full"
            >
              {villas.map((villa, index) => (
                <SwiperSlide
                  key={villa.id}
                  className={`cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    activeIndex === index 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-foreground" 
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${villa.image_url})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-display text-background text-sm font-semibold truncate">
                      {villa.name}
                    </h4>
                    <p className="text-primary text-xs font-body mt-1">
                      {villa.price}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {villas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => mainSwiper?.slideTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? "bg-primary w-6" 
                      : "bg-background/30 hover:bg-background/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Mobile */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </section>
  );
};

export default VerticalHeroSlider;
