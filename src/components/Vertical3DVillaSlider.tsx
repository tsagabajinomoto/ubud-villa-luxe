import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, ArrowRight, Star, Bed, Bath, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Villa {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  capacity?: number;
  rating?: number;
}

const Vertical3DVillaSlider = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("villas")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setVillas(data || []);
      } catch (err) {
        console.error("Error fetching villas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVillas();
  }, []);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (value) => {
      const newIndex = Math.min(
        Math.floor(value * villas.length),
        villas.length - 1
      );
      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, villas.length, activeIndex]);

  if (loading) {
    return (
      <section className="h-screen w-full bg-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-background/60 font-body text-sm tracking-wide">Loading experiences...</p>
        </div>
      </section>
    );
  }

  if (!villas.length) {
    return (
      <section className="h-screen w-full bg-foreground flex items-center justify-center">
        <p className="text-background/60 font-body">No villas available</p>
      </section>
    );
  }

  const activeVilla = villas[activeIndex] || villas[0];

  return (
    <section 
      ref={containerRef}
      className="relative bg-foreground"
      style={{ height: `${(villas.length + 1) * 100}vh` }}
    >
      {/* Fixed Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVilla.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeVilla.image_url})` }}
            />
            {/* Sophisticated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-foreground/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Grid */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full">
              
              {/* Left - Villa Information */}
              <div className="flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVilla.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Section Label */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-px bg-primary" />
                      <span className="text-primary font-body text-xs tracking-[0.3em] uppercase">
                        Featured Collection
                      </span>
                    </div>

                    {/* Villa Counter */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="font-display text-7xl lg:text-8xl font-light text-primary">
                        {String(activeIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-background/30 font-body text-lg">
                        / {String(villas.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Villa Name */}
                    <h2 className="font-display text-4xl lg:text-6xl xl:text-7xl text-background font-medium leading-[1.1] mb-6">
                      {activeVilla.name}
                    </h2>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-background/70 mb-6">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-body text-sm tracking-wide">{activeVilla.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-background/60 font-body text-base lg:text-lg leading-relaxed mb-8 max-w-md">
                      {activeVilla.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 mb-10">
                      {activeVilla.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="text-background font-body text-sm">{activeVilla.rating}</span>
                        </div>
                      )}
                      {activeVilla.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-background/50" />
                          <span className="text-background/70 font-body text-sm">{activeVilla.bedrooms} Beds</span>
                        </div>
                      )}
                      {activeVilla.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-background/50" />
                          <span className="text-background/70 font-body text-sm">{activeVilla.bathrooms} Baths</span>
                        </div>
                      )}
                      {activeVilla.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-background/50" />
                          <span className="text-background/70 font-body text-sm">{activeVilla.capacity} Guests</span>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                      <div>
                        <p className="text-background/50 font-body text-xs uppercase tracking-wider mb-1">Starting from</p>
                        <p className="font-display text-3xl lg:text-4xl text-background">
                          {activeVilla.price}
                          <span className="text-background/40 text-base font-body ml-1">/night</span>
                        </p>
                      </div>
                      
                      <Link
                        to={`/villas/${activeVilla.id}`}
                        className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-body text-sm font-medium tracking-wide transition-all duration-300 hover:gap-4"
                      >
                        Explore Villa
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right - Visual Cards Stack */}
              <div className="hidden lg:flex items-center justify-center relative">
                <div className="relative w-full max-w-md aspect-[3/4]">
                  {villas.map((villa, index) => {
                    const offset = index - activeIndex;
                    const isActive = index === activeIndex;
                    const isVisible = Math.abs(offset) <= 2;
                    
                    if (!isVisible) return null;

                    return (
                      <motion.div
                        key={villa.id}
                        className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer"
                        initial={false}
                        animate={{
                          y: offset * 40,
                          scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05,
                          opacity: isActive ? 1 : 0.4 - Math.abs(offset) * 0.15,
                          zIndex: villas.length - Math.abs(offset),
                          rotateX: offset * -5,
                        }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.22, 1, 0.36, 1] 
                        }}
                        style={{ 
                          transformStyle: "preserve-3d",
                          perspective: 1000 
                        }}
                        onClick={() => setActiveIndex(index)}
                      >
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${villa.image_url})` }}
                        />
                        {/* Card Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                        
                        {/* Card Label */}
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-6 left-6 right-6"
                          >
                            <div className="backdrop-blur-md bg-background/10 border border-background/20 rounded-xl p-4">
                              <p className="text-background font-display text-lg">{villa.name}</p>
                              <p className="text-primary font-body text-sm">{villa.price}/night</p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Navigation */}
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-1">
            {villas.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="group p-2 focus:outline-none"
                aria-label={`Go to villa ${index + 1}`}
              >
                <div 
                  className={`w-0.5 rounded-full transition-all duration-500 ${
                    index === activeIndex 
                      ? "h-10 bg-primary" 
                      : "h-4 bg-background/20 group-hover:bg-background/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-background/40 font-body text-xs tracking-[0.2em] uppercase">
            Scroll to explore
          </span>
          <motion.div 
            className="w-5 h-8 border border-background/30 rounded-full flex justify-center pt-2"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <motion.div 
              className="w-1 h-2 bg-primary rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-background/10 backdrop-blur-sm bg-foreground/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <a 
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors font-body text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat with us
                </a>
                <Link 
                  to="/villas"
                  className="text-background/60 hover:text-primary transition-colors font-body text-sm"
                >
                  View all villas →
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-2 text-background/40 font-body text-xs">
                <span>Use scroll or</span>
                <kbd className="px-2 py-1 bg-background/10 rounded text-background/60">↑</kbd>
                <kbd className="px-2 py-1 bg-background/10 rounded text-background/60">↓</kbd>
                <span>to navigate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vertical3DVillaSlider;
