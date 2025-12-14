import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Environment, Float, Text, useScroll, ScrollControls, Scroll } from "@react-three/drei";
import { MapPin, MessageCircle, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import * as THREE from "three";

interface Villa {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  location: string;
}

// 3D Villa Card Component
function VillaCard3D({ 
  villa, 
  index, 
  total,
  activeIndex,
  setActiveIndex 
}: { 
  villa: Villa; 
  index: number; 
  total: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { viewport } = useThree();
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const scrollOffset = scroll.offset;
    const cardPosition = index / total;
    const distance = scrollOffset - cardPosition;
    
    // Calculate which card is active based on scroll
    const newActiveIndex = Math.round(scrollOffset * total);
    if (newActiveIndex !== activeIndex && newActiveIndex >= 0 && newActiveIndex < total) {
      setActiveIndex(newActiveIndex);
    }
    
    // Z position - active card comes forward
    const targetZ = Math.abs(distance) < 0.15 ? 0.5 : -Math.abs(distance) * 2;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
    
    // Y position - cards stack vertically
    const baseY = (index - scrollOffset * total) * 4;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, baseY, 0.1);
    
    // Rotation for 3D effect
    const targetRotationX = distance * 0.3;
    const targetRotationY = distance * 0.1;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1);
    
    // Scale - active card is larger
    const targetScale = Math.abs(distance) < 0.15 ? 1.1 : 0.85 - Math.abs(distance) * 0.3;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, Math.max(0.5, targetScale), 0.1));
    
    // Opacity via material
    const children = meshRef.current.children;
    children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, Math.abs(distance) < 0.3 ? 1 : 0.3, 0.1);
        }
      }
    });
  });

  const aspectRatio = 16 / 9;
  const width = Math.min(viewport.width * 0.7, 8);
  const height = width / aspectRatio;

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
    >
      <group ref={meshRef} position={[0, (index - total / 2) * 4, 0]}>
        {/* Villa Image */}
        <Image
          url={villa.image_url}
          scale={[width, height]}
          transparent
          opacity={1}
          position={[0, 0, 0]}
        />
        
        {/* Glass overlay frame */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width + 0.1, height + 0.1]} />
          <meshBasicMaterial 
            color="#A1BC98" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Bottom gradient overlay */}
        <mesh position={[0, -height / 4, 0.02]}>
          <planeGeometry args={[width, height / 2]} />
          <meshBasicMaterial 
            color="#1a1a1a" 
            transparent 
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Scene Component
function Scene({ villas, activeIndex, setActiveIndex }: { 
  villas: Villa[]; 
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#A1BC98" />
      
      <ScrollControls pages={villas.length} damping={0.25}>
        <Scroll>
          {villas.map((villa, index) => (
            <VillaCard3D
              key={villa.id}
              villa={villa}
              index={index}
              total={villas.length}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </Scroll>
      </ScrollControls>
      
      <Environment preset="city" />
    </>
  );
}

// Main Component
const Vertical3DVillaSlider = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  if (loading) {
    return (
      <section className="relative h-screen w-full bg-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-background/70 font-body">Loading 3D experience...</p>
        </div>
      </section>
    );
  }

  if (error || !villas.length) {
    return (
      <section className="relative h-screen w-full bg-foreground flex items-center justify-center">
        <p className="text-background/70 font-body">{error || "No villas available"}</p>
      </section>
    );
  }

  const activeVilla = villas[activeIndex];

  return (
    <section className="relative h-[200vh] w-full bg-gradient-to-b from-foreground via-foreground/95 to-foreground">
      {/* 3D Canvas - Fixed while scrolling */}
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="!absolute inset-0"
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene 
              villas={villas} 
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </Suspense>
        </Canvas>

        {/* Overlay Content */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Header */}
          <div className="absolute top-8 left-8 lg:left-16">
            <p className="text-primary font-body text-sm tracking-widest uppercase mb-2">
              Scroll to Explore
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-background font-bold">
              Featured Villas
            </h2>
          </div>

          {/* Villa Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 pointer-events-auto">
            <div className="max-w-2xl">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-background/90 text-sm font-body">
                  {activeVilla.location}
                </span>
              </div>

              {/* Villa Name */}
              <h3 className="font-display text-4xl lg:text-6xl text-background font-bold mb-3 transition-all duration-500">
                {activeVilla.name}
              </h3>

              {/* Description */}
              <p className="text-background/70 text-lg lg:text-xl font-body mb-3">
                {activeVilla.description}
              </p>

              {/* Price */}
              <p className="text-primary text-2xl lg:text-3xl font-display font-semibold mb-6">
                {activeVilla.price}
                <span className="text-sm text-background/50 ml-1">/night</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/villas/${activeVilla.id}`}
                  className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-body font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  Book Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-background/10 hover:bg-background/20 backdrop-blur-sm border border-background/30 text-background px-6 py-3 rounded-lg font-body font-medium transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {villas.map((_, index) => (
              <div
                key={index}
                className={`w-2 transition-all duration-500 rounded-full ${
                  activeIndex === index 
                    ? "h-8 bg-primary" 
                    : "h-2 bg-background/30"
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 right-8 lg:right-16 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-background/50 text-xs font-body uppercase tracking-widest rotate-90 origin-center translate-x-4">
              Scroll
            </span>
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vertical3DVillaSlider;
