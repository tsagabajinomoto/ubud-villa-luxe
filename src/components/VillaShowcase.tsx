import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Users, Bed, Bath, ArrowRight } from "lucide-react";
import { villas } from "@/data/villas";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const VillaCard = ({ villa, index, featured = false }: { villa: typeof villas[0]; index: number; featured?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-all duration-500 ${
        featured ? "lg:row-span-2" : ""
      }`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? "h-80 lg:h-full" : "h-64"}`}>
        <img
          src={villa.image}
          alt={villa.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Availability Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
          villa.isAvailable 
            ? "bg-primary text-primary-foreground" 
            : "bg-destructive text-destructive-foreground"
        }`}>
          {villa.isAvailable ? "Available" : "Booked"}
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-foreground">{villa.rating}</span>
          <span className="text-xs text-muted-foreground">({villa.reviewCount})</span>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className={`font-display font-semibold text-background mb-2 ${
            featured ? "text-2xl lg:text-3xl" : "text-xl"
          }`}>
            {villa.name}
          </h3>
          <p className="text-background/80 text-sm mb-4 line-clamp-2">
            {villa.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-background/70 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{villa.capacity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{villa.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{villa.bathrooms}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl lg:text-2xl font-semibold text-background">
                {formatCurrency(villa.pricePerNight)}
              </span>
              <span className="text-background/60 text-sm"> /night</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-background text-foreground rounded-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-sm font-medium">View</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VillaShowcase = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="villas" className="section-padding bg-background" ref={sectionRef}>
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-widest text-sm font-medium mb-4 block">
            Our Collection
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Exceptional Villas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Each villa is thoughtfully designed to offer you an authentic Balinese
            experience while providing all the luxuries you deserve.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Featured Villa - Large */}
          <div className="lg:col-span-2 lg:row-span-2">
            <VillaCard villa={villas[0]} index={0} featured />
          </div>

          {/* Smaller Villas */}
          {villas.slice(1).map((villa, index) => (
            <VillaCard key={villa.id} villa={villa} index={index + 1} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#" className="btn-outline inline-flex items-center gap-2">
            View All Villas
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaShowcase;
