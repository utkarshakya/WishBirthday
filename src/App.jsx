import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

// Shared motion variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

// Helper for countdown
function calculateTimeLeft(targetDate) {
  const diff = +new Date(targetDate) - +new Date();
  if (diff <= 0) return {};
  return {
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// CountdownTimer component
function CountdownTimer({ targetDate, onComplete }) {
  const [time, setTime] = useState(calculateTimeLeft(targetDate));
  useEffect(() => {
    const id = setTimeout(() => {
      const newTime = calculateTimeLeft(targetDate);
      setTime(newTime);
      if (Object.keys(newTime).length === 0) onComplete();
    }, 1000);
    return () => clearTimeout(id);
  }, [time, targetDate, onComplete]);
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4 text-base sm:text-xl">
      {Object.entries(time).map(([unit, value]) => (
        <div key={unit} className="text-center p-2">
          <div className="font-mono text-3xl sm:text-4xl">{value}</div>
          <div className="capitalize text-sm sm:text-base">{unit}</div>
        </div>
      ))}
    </div>
  );
}

// AnimatedGallery component
function AnimatedGallery({ images, isImagesLoaded }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, idx) => (
        <div
          key={idx}
          className="relative"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.img
            src={image.src}
            alt={`Image ${idx + 1}`}
            className="h-56 w-full rounded-xl shadow-md object-cover object-top cursor-pointer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 10, duration: 10 }}
          />

          {isImagesLoaded && hoveredIndex === idx && (
            <motion.div
              className="absolute inset-0 bg-black/50 bg-opacity-50 rounded-xl flex items-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <p className="text-white text-sm md:text-base">
                {image.description}
              </p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// Home page: only countdown and intro
function HomePage() {
  const navigate = useNavigate();
  const birthday = "2025-05-04T21:36:00";
  const [ready, setReady] = useState(false);
  const onComplete = () => setReady(true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex flex-col items-center pt-40">
      <motion.div variants={itemVariants} initial="hidden" animate="show">
        <CountdownTimer targetDate={birthday} onComplete={onComplete} />
      </motion.div>
      {ready && (
        <>
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="text-xl md:text-3xl font-bold"
          >
            🎂 Happy Birthday, Nirbhay! 🎂
          </motion.h1>
          <motion.button
            variants={itemVariants}
            initial="hidden"
            animate="show"
            onClick={() => navigate("/gift")}
            className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700"
          >
            Take Your Gift Brother
          </motion.button>
        </>
      )}
    </div>
  );
}

// Celebration page: memories + confetti + nav to party
function GiftPage() {
  const navigate = useNavigate();
  const memories = [
    {
      src: "/images/photo4.png",
      description:
        "When Siddharth Live with us, he take this photo from my phone.",
    },
    {
      src: "/images/photo2.png",
      description: "This our Banaras Trip, We had so much fun.",
    },
    {
      src: "/images/photo3.png",
      description:
        "You are so deep searching something, and I take this photo.",
    },
    {
      src: "/images/photo1.png",
      description: "Remember that we went to collage and sit in the garden.",
    },
  ];
  const birthdaySong = "/audio/happy-birthday.mp3";
  const [confettiActive, setConfettiActive] = useState(false);
  const [showPartyBtn, setShowPartyBtn] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current.play().catch(() => {});
    setConfettiActive(true);
    const confettiTimer = setTimeout(() => setConfettiActive(false), 42000);
    const partyTimer = setTimeout(() => setShowPartyBtn(true), 40000);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(partyTimer);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex flex-col items-center pt-20">
      <motion.h1
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="text-xl md:text-3xl font-bold mb-8 md:mb-16"
      >
        ❤️ I Just Have Some Memories! ❤️
      </motion.h1>
      <audio ref={audioRef} src={birthdaySong} className="hidden" />
      <AnimatePresence>
        {confettiActive && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <Confetti recycle={true} numberOfPieces={300} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div variants={itemVariants} initial="hidden" animate="show">
        <AnimatedGallery images={memories} isImagesLoaded={showPartyBtn} />
      </motion.div>
      {showPartyBtn && (
        <motion.button
          variants={itemVariants}
          initial="hidden"
          animate="show"
          onClick={() => navigate("/party")}
          className="mt-6 md:mt-12 px-6 py-3 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700"
        >
          🎉 Let's Party! 🎉
        </motion.button>
      )}
    </div>
  );
}

function PartyPage() {
  const partySong = "/audio/party-time.mp3";
  const audioRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Initialize audio context and set up analyzer
  const initAudio = () => {
    if (!audioRef.current) return;

    try {
      // Create audio context only once
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const src = ctx.createMediaElementSource(audioRef.current);
      src.connect(analyser);
      analyser.connect(ctx.destination);

      return true;
    } catch (err) {
      console.error("Failed to initialize audio:", err);
      return false;
    }
  };

  // Start audio playback
  const startAudio = () => {
    if (!audioRef.current || !audioContextRef.current) return;

    audioContextRef.current.resume().then(() => {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          startVisualization();
        })
        .catch((err) => {
          console.warn("Audio playback failed:", err.message);
        });
    });
  };

  // Visualization loop
  const startVisualization = () => {
    if (!analyserRef.current) return;

    const data = new Uint8Array(analyserRef.current.frequencyBinCount);

    const tick = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(data);
      // Use more frequency bins for better response
      const avg = data.slice(0, 20).reduce((sum, v) => sum + v, 0) / 20;

      // Amplify the effect for better visual feedback
      setLevel(1 + avg / 128);

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  // Set up audio on mount
  useEffect(() => {
    const initialized = initAudio();
    if (initialized) {
      // Auto-start on desktop, require interaction on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        startAudio();
      }
    }

    // Clean up on unmount
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (err) {
          console.warn("Error closing audio context:", err);
        }
      }
    };
  }, []);

  // Floating balloon count
  const balloons = Array.from({ length: 7 });

  return (
    <motion.div
      className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 text-white p-8 flex flex-col items-center justify-center"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Play button (shows only if audio isn't playing yet) */}
      {!isPlaying && (
        <motion.button
          className="absolute z-20 top-4 right-4 bg-white text-purple-600 px-4 py-2 rounded-full shadow-lg font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startAudio}
        >
          Start Party! 🎵
        </motion.button>
      )}

      {/* Confetti */}
      <AnimatePresence>
        <Confetti recycle numberOfPieces={500} />
      </AnimatePresence>

      {/* Balloons */}
      {balloons.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{ left: `${10 + i * 12}%`, bottom: 0 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -800, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        >
          🎈
        </motion.div>
      ))}

      {/* Party header with beat-based scale and rotation */}
      <motion.h1
        initial={{ opacity: 0, scale: 1, rotate: 0 }}
        animate={{
          opacity: 1,
          scale: level,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          scale: { duration: 0.1 }, // Fast response to audio
        }}
        className="z-10 text-sm md:text-3xl font-bold mb-6"
      >
        🎉 Party Time! 🎉
      </motion.h1>

      {/* Visual beat indicator - helps debug if audio levels are working */}
      {/* <div className="absolute bottom-4 left-4 flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-2 bg-white rounded-full"
            style={{
              height: `${Math.min(40, (level - 1) * 100)}px`,
              opacity: isPlaying ? 0.7 : 0.2,
            }}
          />
        ))}
      </div> */}

      {/* Hidden audio */}
      <audio ref={audioRef} src={partySong} loop className="hidden" />
    </motion.div>
  );
}

// Root App with routing
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gift" element={<GiftPage />} />
        <Route path="/party" element={<PartyPage />} />
      </Routes>
    </Router>
  );
}
