"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});

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
  const stagger = 0.3;

  const randomOffset = () => Math.random() * 40 - 20; // -20px to +20px vertical shift
  const randomScale = () => 0.8 + Math.random() * 0.2; 

    logos.forEach((_, index) => {
  const logo = logoRefs.current[index];
  const trig = trigRefs.current[index];
  if (!logo || !trig) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

  // 🎲 Random tilt and Y offset for natural float
  const randomY = gsap.utils.random(-25, 25); // pixels up/down
  const randomRotation = gsap.utils.random(-10, 10); // degrees tilt

  // Logo animation
  tl.fromTo(
  logo,
  {
    left: "-100px",
    top: `calc(50% + ${randomOffset()}px)`,
    yPercent: -50,
    opacity: 1,
    scale: randomScale(),
    zIndex: 5,
  },
  {
    left: "50%",
    xPercent: -50,
    opacity: 1,
    duration: trainSpeed,
    ease: "linear",
  }
)

    .to(logo, { opacity: 0, duration: 1, ease: "power1.out" }, "-=0.3")
    .to(logo, { left: "-120px", duration: 0 });

  // TRIG text animation (same randomness for consistency)
  tl.fromTo(
    trig,
    {
      left: "50%",
      top: `calc(50% + ${randomY}px)`,
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.9,
      rotate: randomRotation,
      zIndex: 5,
    },
    {
      left: "100%",
      opacity: 1,
      scale: 1,
      duration: trainSpeed,
      ease: "linear",
    },
    trainSpeed - textDelay
  )
    .to(trig, { opacity: 0, duration: 0.5, ease: "power1.out" }, "-=0.3")
    .to(trig, { left: "50%", duration: 0 });

  tl.delay(index * stagger);
});

  }, []);

  return (
    <div
      className={`${sora.className} relative w-full h-screen bg-black overflow-hidden`}
    >
      {/* Top-left logo */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-3 animate-fadeIn">
        <Image
          src="/logomain.jpg"
          alt="TRIG Logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <span className="text-white text-3xl font-bold tracking-wider">
          TRIG
        </span>
      </div>

      {/* Main scene */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Glowing white “watch band” behind train */}
        <div className="absolute w-full h-26 top-1/2 -translate-y-1/2 watch-band"></div>

        {/* Logo train */}
        {logos.map((logo, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) logoRefs.current[i] = el;
            }}
            className="absolute will-change-transform will-change-opacity"
            style={{ zIndex: 5 }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full opacity-90"
            />
          </div>
        ))}

        {/* TRIG text train */}
        {logos.map((_, i) => (
          <div
            key={`trig-${i}`}
            ref={(el) => {
              if (el) trigRefs.current[i] = el;
            }}
            className="absolute will-change-transform will-change-opacity"
            style={{ zIndex: 5 }}
          >
            <span className="text-transparent bg-clip-text bg-black font-bold text-3xl tracking-wider">
              TRIG
            </span>
          </div>
        ))}

        {/* Central sphere */}
        <div className="relative z-10">
          <div className="sphere-container relative w-80 h-80">
            <div className="sphere absolute w-60 h-60 top-10 left-10 rounded-full bg-black z-10 flex items-center justify-center">
                <span className="text-white text-3xl font-bold tracking-wider">
          TRIG
        </span>
            </div>

            {/* Arc container */}
            <svg
              viewBox="0 0 340 340"
              className="arc-container absolute top-0 left-0 w-full h-full z-20"
            >
              <path
                className="left-arc"
                d="M50,120 A130,130 0 0,1 290,120"
              ></path>
              <path
                className="right-arc"
                d="M50,220 A130,130 0 0,0 290,220"
              ></path>
            </svg>
            {/* Horizontal LED beams */}
            <div className="left-beam absolute top-1/2 h-3 w-full"></div>
            <div className="right-beam absolute top-1/2 h-1 w-full"></div>
            <div className="left-beam absolute top-1/2 h-1 w-full"></div>
            <div className="right-beam absolute top-1/2 h-1 w-full"></div>
          </div>

          {/* Launch App button */}
          <div className="absolute top-[calc(50%+280px)] left-1/2 -translate-x-1/2 z-20">
            <button className="px-8 py-2 rounded-full whitespace-nowrap bg-[rgb(0,255,0)] font-bold text-black tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
              Launch App
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        /* Watch band */
        .watch-band {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.95) 20%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.95) 80%,
            rgba(255, 255, 255, 0.9)
          );
          box-shadow: 0 0 80px rgba(255, 255, 255, 1),
            0 0 30px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1);
        }

        /* Sphere */
        .sphere {
          background: radial-gradient(circle at 30% 30%, #222, #000);
        }

        body {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        .sphere-container {
          position: relative;
          width: 340px;
          height: 340px;
        }

        .sphere {
          position: absolute;
          top: 50px;
          left: 50px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #222, #000);
          filter: drop-shadow(0 0 100px #00ff00) drop-shadow(0 0 00px #00ff00);
          z-index: 2;
        }

        .arc-container {
          overflow: visible;
        }

        svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 340px;
          height: 340px;
          z-index: 1;
        }

        .left-arc,
        .right-arc {
          fill: none;
          stroke: #00ff00;
          stroke-width: 10;
          stroke-linecap: round;
          stroke-dasharray: 377;
          stroke-dashoffset: 377;
          opacity: 0;
          filter: drop-shadow(0 0 20px #00ff00) drop-shadow(0 0 30px #00ff00); /* added extra glow */
          animation: arcLoop 6s linear infinite;
        }

        /* Arcs with infinite repetition and gap */
        .left-arc,
        .right-arc {
          animation: arcLoop 6s linear infinite; /* total cycle 6s */
          animation-delay: 2s;
        }

        @keyframes arcLoop {
          0% {
            stroke-dashoffset: 377;
            opacity: 1;
          }
          30% {
            stroke-dashoffset: 0;
            opacity: 1;
          } /* arc fully visible */
          40% {
            stroke-dashoffset: 0;
            opacity: 0;
          } /* fade out */
          100% {
            stroke-dashoffset: 377;
            opacity: 0;
          } /* remain hidden until next loop */
        }

        /* Horizontal LED beams */
        .left-beam,
        .right-beam {
          position: absolute;
          top: 50%;
          height: 15px;
          width: 180px;
          opacity: 0;
          transform: translateY(-50%);
          pointer-events: none;
          border-radius: 2px;
          filter: drop-shadow(0 0 10px #00ff00);
          z-index: 0;
          radius: full;
          border-radius: 30px 30px 30px 30px;
        }

        .left-beam {
          background: linear-gradient(
            to bottom,
            rgba(0, 255, 0, 1) 0%,

            rgba(0, 255, 0, 1) 100%
          );
          animation: leftBeam 5.7s ease-in-out infinite;
        }

        .right-beam {
          background: linear-gradient(
            to bottom,
            rgba(0, 255, 0, 1) 0%,
            rgba(0, 255, 0, 1) 100%
          );
          animation: rightBeam 6s ease-in-out infinite;
          animation-delay: 3.2s; /* starts after arcs disappear */
        }

        /* ✅ Equal gap for both top & bottom beams using transform */
        .sphere-container .left-beam:nth-child(3),
        .sphere-container .right-beam:nth-child(4) {
          transform: translateY(calc(-50% - 45px)); /* upper beams go UP */
        }

        .sphere-container .left-beam:nth-child(5),
        .sphere-container .right-beam:nth-child(6) {
          transform: translateY(calc(-50% + 45px)); /* lower beams go DOWN */
        }

        @keyframes rightBeam {
          0% {
            left: calc(50% - 170px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            left: 1000px;
            opacity: 0.8;
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes leftBeam {
          0% {
            left: -1000px;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            left: calc(50% - 170px);
            opacity: 0.8;
          }
          70% {
            opacity: 0;
          }
          100% {
            left: -400px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TrigHero;
