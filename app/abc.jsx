"use client";
import React from "react";
import Image from "next/image";

const TrigHero = () => {
  const logos = [
    "/logo1.webp",
    "/logo2.webp",
    "/logo3.png",
    "/logo4.png",
    "/logo5.png",
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-3 animate-fadeIn">
        <Image
          src="/logomain.jpg"
          alt="TRIG Logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <span className="text-white text-3xl font-bold tracking-wider">TRIG</span>
      </div>

      {/* Scene */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Logos moving left → center with TRIG text */}
        {logos.map((logo, i) => (
          <React.Fragment key={i}>
            {/* Logo */}
            <div
              className="absolute top-1/2 animate-logoPath"
              style={{
                animationDelay: `${i * 3}s`,
              }}
            >
              <Image
                src={logo}
                alt="Logo"
                width={60}
                height={60}
                className="rounded-full opacity-90"
              />
            </div>

            {/* TRIG text - appears exactly when logo disappears */}
            <div
              className="absolute top-1/2 left-1/2 animate-trigText"
              style={{
                animationDelay: `${i * 3}s`,
              }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 font-bold text-5xl tracking-wider">
                TRIG
              </span>
            </div>
          </React.Fragment>
        ))}

        {/* Central Sphere with glowing rectangles */}
        <div className="relative z-10">
          {/* Left glowing rectangle */}
          <div
            className="absolute top-1/2 right-[160px] h-[224px] -translate-y-1/2"
            style={{
              width: "calc(50vw - 160px)",
              background: "linear-gradient(to left, rgba(100,255,218,0.6), rgba(100,255,218,0))",
              boxShadow: "0 0 40px rgba(100,255,218,0.5), 0 0 60px rgba(100,255,218,0.3)",
              filter: "blur(8px)",
            }}
          />
          
          {/* Right glowing rectangle */}
          <div
            className="absolute top-1/2 left-[160px] h-[224px] -translate-y-1/2"
            style={{
              width: "calc(50vw - 160px)",
              background: "linear-gradient(to right, rgba(100,255,218,0.6), rgba(100,255,218,0))",
              boxShadow: "0 0 40px rgba(100,255,218,0.5), 0 0 60px rgba(100,255,218,0.3)",
              filter: "blur(8px)",
            }}
          />

          <div
            className="w-80 h-80 rounded-full bg-black shadow-2xl"
            style={{
              boxShadow:
                "0 0 150px rgba(100,255,218,0.6), 0 0 200px rgba(100,255,218,0.4), 0 0 80px rgba(100,255,218,0.3), inset 0 0 80px rgba(0,0,0,1)",
            }}
          >
            {/* Center TRIG core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
              <Image
                src="/logomain.jpg"
                alt="TRIG"
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-white text-2xl font-bold">TRIG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        /* Logo travels from left edge → center → fades at center (total cycle: 15s for 5 logos) */
        @keyframes logoPath {
          0% {
            left: -100px;
            transform: translateY(-50%) scale(1);
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          18% {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          20% {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
            z-index: 0;
          }
          100% {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        .animate-logoPath {
          position: absolute;
          animation: logoPath 15s ease-in-out infinite;
        }

        /* TRIG appears exactly when logo reaches 20% (disappears) and moves right */
        @keyframes trigText {
          0%,
          19% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          35% {
            opacity: 1;
            transform: translate(300px, -50%) scale(1);
          }
          45% {
            opacity: 0;
            transform: translate(600px, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(600px, -50%) scale(1);
          }
        }

        .animate-trigText {
          animation: trigText 15s ease-in-out infinite;
        }

        /* Fade In header once */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TrigHero;