"use client";
import  { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

  const logos = [
    "/logo1.webp",
    "/logo2.webp",
    "/logo3.png",
    "/logo4.png",
    "/logo5.png",
  ];


const TrigHero = () => {
  const logoRefs = useRef([]);
  const trigRefs = useRef([]);


  useEffect(() => {
    const trainSpeed = 2.0;
    const textDelay = 0.8;
    const stagger = 0.5;

    logos.forEach((_, index) => {
      const logo = logoRefs.current[index];
      const trig = trigRefs.current[index];
      if (!logo || !trig) return;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

      // Logo animation
      tl.fromTo(
        logo,
        { left: "-100px", top: "50%", yPercent: -50, opacity: 0.8, scale: 1, zIndex: 5 },
        { left: "50%", xPercent: -50, opacity: 0.8, duration: trainSpeed, ease: "linear" }
      )
        .to(logo, { opacity: 0, duration: 0.3, ease: "power2.in" })
        .to(logo, { left: "-100px", duration: 0 });

      // TRIG text animation
      tl.fromTo(
        trig,
        { left: "50%", top: "50%", xPercent: -50, yPercent: -50, opacity: 0, scale: 0.9, zIndex: 5 },
        { left: "100%", opacity: 1, scale: 1, duration: trainSpeed, ease: "linear" },
        trainSpeed - textDelay
      ).to(trig, { left: "50%", opacity: 0, duration: 0 });

      tl.delay(index * stagger);
    });
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top-left logo */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-3 animate-fadeIn">
        <Image src="/logomain.jpg" alt="TRIG Logo" width={48} height={48} className="rounded-full" />
        <span className="text-white text-3xl font-bold tracking-wider">TRIG</span>
      </div>

      {/* Main scene */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Logo train */}
        {logos.map((logo, i) => (
          <div
            key={i}
            ref={(el) => { if (el) logoRefs.current[i] = el; }}
            className="absolute"
            style={{ zIndex: 5 }}
          >
            <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full opacity-90" />
          </div>
        ))}

        {/* TRIG text train */}
        {logos.map((_, i) => (
          <div
            key={`trig-${i}`}
            ref={(el) => { if (el) trigRefs.current[i] = el; }}
            className="absolute"
            style={{ zIndex: 5 }}
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-300 font-bold text-5xl tracking-wider">
              TRIG
            </span>
          </div>
        ))}

        {/* Central sphere */}
        <div className="relative z-10">
          <div
            className="w-80 h-80 rounded-full bg-black shadow-2xl"
            style={{
              boxShadow:
                "0 0 100px rgba(16,185,129,0.7), 0 0 150px rgba(16,185,129,0.5), 0 0 50px rgba(255,255,255,0.3), inset 0 0 80px rgba(0,0,0,1)",
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
              <Image src="/logomain.jpg" alt="TRIG" width={64} height={64} className="rounded-full" />
              <span className="text-white text-2xl font-bold">TRIG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TrigHero;
