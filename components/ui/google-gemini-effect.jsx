/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sora } from "next/font/google"; // Import Sora font
import Orb from "../Orb";

// Configure Sora font
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "700"], // Include weights as needed
});

const transition = {
  duration: 0,
  ease: "linear",
};

export const GoogleGeminiEffect = ({ pathLengths, className }) => {
  const pathRefs = useRef([]);
  const [points, setPoints] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [trigPositions, setTrigPositions] = useState([]);
  const [initialTrigPositions, setInitialTrigPositions] = useState([]);
  const [logoPositions, setLogoPositions] = useState([]);

  const logos = [
    "/logo1.webp",
    "/logo2.webp",
    "/logo3.png",
    "/logo4.png",
    "/logo5.png",
  ];

  // Offsets for logos at their starting position (spread out, will converge)
  const logoStartOffsets = [
    { x: 0, y: 0 }, // logo 1 (line 5, index 0)
    { x: 0, y: 0 }, // logo 2 (line 4, index 1)
    { x: 0, y: 0 }, // logo 3 (line 3, index 2)
    { x: 0, y: 0 }, // logo 4 (line 2, index 3)
    { x: 0, y: 0 }, // logo 5 (line 1, index 4)
  ];

  // Target offsets at 50% (minimal offset, converged)
  const logoEndOffsets = [
    { x: 0, y: 0 }, // logo 1 (line 5, index 0)
    { x: 0, y: 0 }, // logo 2 (line 4, index 1)
    { x: 0, y: 0 }, // logo 3 (line 3, index 2)
    { x: 0, y: 0 }, // logo 4 (line 2, index 3)
    { x: 0, y: 0 }, // logo 5 (line 1, index 4)
  ];

  // Map scroll progress (50% to 80%) to path progress (50% to 100%) for TRIG with stagger
  const getPathProgress = useCallback(
    (scrollProgress, index) => {
      const totalItems = logos.length; // 5 TRIG divs
      const delayPerItem = 1; // Each TRIG div starts 5% scroll progress after the previous
      const startScroll = 50 + index * delayPerItem; // Start at 50%, 55%, 60%, 65%, 70%
      const endScroll = startScroll + 25; // Each TRIG div animates over 25% scroll range

      if (scrollProgress < startScroll) return 0; // Before TRIG's start
      if (scrollProgress >= endScroll) return 1; // After TRIG reaches end
      // Map scroll progress to path progress (0.5 to 1) within the TRIG's scroll range
      return 0.5 + ((scrollProgress - startScroll) / (endScroll - startScroll)) * 0.5;
    },
    [logos.length]
  );

  // Map scroll progress (0% to 50%) to logo path progress (0% to 50%) with stagger
  const getLogoPathProgress = (scrollProgress, index) => {
    const totalLogos = logos.length; // 5 logos
    const delayPerLogo = 10; // Each logo starts 10% scroll progress after the previous
    const startScroll = index * delayPerLogo; // Delay based on index (0, 10, 20, 30, 40)
    const endScroll = startScroll + 40; // Each logo animates over 40% scroll range

    if (scrollProgress < startScroll) return 0; // Before logo's start
    if (scrollProgress >= endScroll) return 0.5; // After logo reaches midpoint
    // Map scroll progress to path progress (0 to 0.5) within the logo's scroll range
    return ((scrollProgress - startScroll) / (endScroll - startScroll)) * 0.5;
  };

  // Calculate start and midpoint points along each path
  useEffect(() => {
    if (!pathRefs.current.length) return;

    const newPoints = pathRefs.current.map((path) => {
      if (!path) return [];
      const length = path.getTotalLength();
      return [0, length * 0.5].map((pos) => path.getPointAtLength(pos));
    });

    setPoints(newPoints);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate initial TRIG positions (midpoint) on mount
  useEffect(() => {
    if (!pathRefs.current.length) return;

    const initialPositions = pathRefs.current.map((path) => {
      if (!path) return { x: 0, y: 0 };
      try {
        const totalLength = path.getTotalLength();
        return path.getPointAtLength(totalLength * 0.5);
      } catch (e) {
        return { x: 0, y: 0 };
      }
    });

    setInitialTrigPositions(initialPositions);
  }, [points]);

  // Calculate TRIG positions in animation frame
  useEffect(() => {
    const updateTrigPositions = () => {
      if (!pathRefs.current.length) {
        setTrigPositions([]);
        return;
      }

      const newTrigPositions = pathRefs.current.map((path, index) => {
        if (!path) return null;
        try {
          const totalLength = path.getTotalLength();
          const pathProgress = getPathProgress(scrollProgress, index);
          const pathPosition = totalLength * (0.5 + pathProgress * 0.5);
          return path.getPointAtLength(pathPosition);
        } catch (e) {
          return null;
        }
      });

      setTrigPositions(newTrigPositions);
    };

    requestAnimationFrame(updateTrigPositions);
  }, [getPathProgress, scrollProgress]);

  // Calculate logo positions in animation frame
  useEffect(() => {
    const updateLogoPositions = () => {
      if (!pathRefs.current.length) {
        setLogoPositions([]);
        return;
      }

      const newLogoPositions = pathRefs.current.map((path, index) => {
        if (!path) return null;
        try {
          const totalLength = path.getTotalLength();
          const logoProgress = getLogoPathProgress(scrollProgress, index);
          const pathPosition = totalLength * logoProgress;
          return path.getPointAtLength(pathPosition);
        } catch (e) {
          return null;
        }
      });

      setLogoPositions(newLogoPositions);
    };

    requestAnimationFrame(updateLogoPositions);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress]);

  const paths = [
    {
      d: "M0 663C145.5 663 191 666.265 269 647C326.5 630 339.5 621 397.5 566C439 531.5 455 529.5 490 523C509.664 519.348 521 503.736 538 504.236C553.591 504.236 562.429 514.739 584.66 522.749C592.042 525.408 600.2 526.237 607.356 523.019C624.755 515.195 641.446 496.324 657 496.735C673.408 496.735 693.545 519.572 712.903 526.769C718.727 528.934 725.184 528.395 730.902 525.965C751.726 517.115 764.085 497.106 782 496.735C794.831 496.47 804.103 508.859 822.469 518.515C835.13 525.171 850.214 526.815 862.827 520.069C875.952 513.049 889.748 502.706 903.5 503.736C922.677 505.171 935.293 510.562 945.817 515.673C954.234 519.76 963.095 522.792 972.199 524.954C996.012 530.611 1007.42 534.118 1034 549C1077.5 573.359 1082.5 594.5 1140 629C1206 670 1328.5 662.5 1440 662.5",
      color: "#A8FFB7",
    },
    {
      d: "M0 587.5C147 587.5 277 587.5 310 573.5C348 563 392.5 543.5 408 535C434 523.5 426 526.235 479 515.235C494 512.729 523 510.435 534.5 512.735C554.5 516.735 555.5 523.235 576 523.735C592 523.735 616 496.735 633 497.235C648.671 497.235 661.31 515.052 684.774 524.942C692.004 527.989 700.2 528.738 707.349 525.505C724.886 517.575 741.932 498.33 757.5 498.742C773.864 498.742 791.711 520.623 810.403 527.654C816.218 529.841 822.661 529.246 828.451 526.991C849.246 518.893 861.599 502.112 879.5 501.742C886.47 501.597 896.865 506.047 907.429 510.911C930.879 521.707 957.139 519.639 982.951 520.063C1020.91 520.686 1037.5 530.797 1056.5 537C1102.24 556.627 1116.5 570.704 1180.5 579.235C1257.5 589.5 1279 587 1440 588",
      color: "#C3FF93",
    },
    {
      d: "M0 514C147.5 514.333 294.5 513.735 380.5 513.735C405.976 514.94 422.849 515.228 436.37 515.123C477.503 514.803 518.631 506.605 559.508 511.197C564.04 511.706 569.162 512.524 575 513.735C588 516.433 616 521.702 627.5 519.402C647.5 515.402 659 499.235 680.5 499.235C700.5 499.235 725 529.235 742 528.735C757.654 528.735 768.77 510.583 791.793 500.59C798.991 497.465 807.16 496.777 814.423 499.745C832.335 507.064 850.418 524.648 866 524.235C882.791 524.235 902.316 509.786 921.814 505.392C926.856 504.255 932.097 504.674 937.176 505.631C966.993 511.248 970.679 514.346 989.5 514.735C1006.3 515.083 1036.5 513.235 1055.5 513.235C1114.5 513.235 1090.5 513.235 1124 513.235C1177.5 513.235 1178.99 514.402 1241 514.402C1317.5 514.402 1274.5 512.568 1440 513.235",
      color: "#6EFF89",
    },
    {
      d: "M0 438.5C150.5 438.5 261 438.318 323.5 456.5C351 464.5 387.517 484.001 423.5 494.5C447.371 501.465 472 503.735 487 507.735C503.786 512.212 504.5 516.808 523 518.735C547 521.235 564.814 501.235 584.5 501.235C604.5 501.235 626 529.069 643 528.569C658.676 528.569 672.076 511.63 695.751 501.972C703.017 499.008 711.231 498.208 718.298 501.617C735.448 509.889 751.454 529.98 767 529.569C783.364 529.569 801.211 507.687 819.903 500.657C825.718 498.469 832.141 499.104 837.992 501.194C859.178 508.764 873.089 523.365 891 523.735C907.8 524.083 923 504.235 963 506.735C1034.5 506.735 1047.5 492.68 1071 481.5C1122.5 457 1142.23 452.871 1185 446.5C1255.5 436 1294 439 1439.5 439",
      color: "#30E07A",
    },
    {
      d: "M0.5 364C145.288 362.349 195 361.5 265.5 378C322 391.223 399.182 457.5 411 467.5C424.176 478.649 456.916 491.677 496.259 502.699C498.746 503.396 501.16 504.304 503.511 505.374C517.104 511.558 541.149 520.911 551.5 521.236C571.5 521.236 590 498.736 611.5 498.736C631.5 498.736 652.5 529.236 669.5 528.736C685.171 528.736 697.81 510.924 721.274 501.036C728.505 497.988 736.716 497.231 743.812 500.579C761.362 508.857 778.421 529.148 794 528.736C810.375 528.736 829.35 508.68 848.364 502.179C854.243 500.169 860.624 500.802 866.535 502.718C886.961 509.338 898.141 519.866 916 520.236C932.8 520.583 934.5 510.236 967.5 501.736C1011.5 491 1007.5 493.5 1029.5 480C1069.5 453.5 1072 440.442 1128.5 403.5C1180.5 369.5 1275 360.374 1439 364",
      color: "#00C957",
    },
  ];

  return (
    <div className={cn("sticky top-0", className)}>
      {/* Main Logo with TRIG text in top left corner */}
      <div className="absolute top-4 left-6 z-50 ">
        <div className="relative w-18 h-18">
          <Image
            src="/logomain.jpg"
            alt="Main Logo"
            fill
            className="object-cover rounded-lg"
          />
          <span
            className={cn(
              sora.className,
              "absolute top-5 left-18 text-white font-bold text-3xl"
            )}
          >
            TRIG
          </span>
        </div>
      </div>

      <div className="w-full flex items-center justify-center absolute pt-20">
        <div
          style={{ position: "relative", width: "500px", height: "500px" }}
          className="pt-6 z-50 flex items-center justify-center"
        >
          {/* Black background circle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: "black",
              zIndex: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem", // Space between TRIG text and button
            }}
          >
            {/* TRIG text in center with Sora font */}
            <span
              className={cn(
                sora.className,
                "text-white font-bold text-8xl mt-26 mb-4"
              )}
            >
              TRIG
            </span>
            {/* Green button below TRIG text */}
            <button
              className={cn(
                sora.className,
                "bg-green-500 text-black font-bold py-2 px-10 rounded-lg hover:bg-green-600 transition-colors"
              )}
            >
              Launch App
            </button>
          </div>

          {/* Orb on top */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
              transform: "scale(1.35)",
              transformOrigin: "center",
            }}
          >
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={120}
              forceHoverState={false}
            />
          </div>
        </div>
      </div>

      <svg
        width="1440"
        height="890"
        viewBox="0 0 1440 890"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -top-60 md:-top-40 w-full"
      >
        {paths.map((p, i) => (
          <g key={i}>
            {/* Grey background path */}
            <path d={p.d} stroke="#555" strokeWidth="2" fill="none" />

            {/* Animated colored path */}
            <motion.path
              ref={(el) => (pathRefs.current[i] = el)}
              d={p.d}
              stroke={p.color}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              style={{ pathLength: pathLengths[i] }}
              transition={transition}
            />
          </g>
        ))}

        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
      </svg>

      {/* Logos with black rounded squares and offsets */}
      {logoPositions.map((logoPos, i) => {
        if (!logoPos) return null;

        // Interpolate offsets based on scroll progress
        const progress = Math.min(getLogoPathProgress(scrollProgress, i) / 0.5, 1); // Normalize to 0-1
        const startOffset = logoStartOffsets[i] || { x: 0, y: 0 };
        const endOffset = logoEndOffsets[i] || { x: 0, y: 0 };
        const currentOffsetX = startOffset.x + (endOffset.x - startOffset.x) * progress;
        const currentOffsetY = startOffset.y + (endOffset.y - startOffset.y) * progress;

        return (
          <motion.div
            key={`logo-${i}`}
            className="absolute z-45 flex items-center justify-center bg-black rounded-full w-12 h-12"
            initial={{
              x: (points[i]?.[0]?.x || 0) + startOffset.x,
              y: (points[i]?.[0]?.y || 0) + startOffset.y - 180,
              opacity: 1,
            }}
            animate={{
              x: logoPos.x + currentOffsetX,
              y: logoPos.y + currentOffsetY - 180,
              opacity: 1,
            }}
            transition={{ duration: 0.2, ease: "linear" }}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={logos[i % logos.length]}
              alt={`logo-${i}`}
              width={32}
              height={32}
              className="rounded-full"
            />
          </motion.div>
        );
      })}

      {/* TRIG texts with black rounded squares */}
      {trigPositions.map((trigPos, i) => {
        if (!trigPos) return null;

        const initialPoint = initialTrigPositions[i] || { x: 0, y: 0 };
        const pathProgress = getPathProgress(scrollProgress, i);

        return (
          <motion.div
            key={`trig-${i}`}
            className={cn(
              "absolute z-45 flex items-center justify-center bg-black rounded-lg w-12 h-12",
              sora.className // Apply Sora font to TRIG text
            )}
            initial={{
              x: initialPoint.x,
              y: initialPoint.y - 180,
              opacity: 0,
            }}
            animate={{
              x: trigPos.x,
              y: trigPos.y - 180,
              opacity: pathProgress > 0 ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="text-white font-bold text-sm">TRIG</span>
          </motion.div>
        );
      })}
    </div>
  );
};