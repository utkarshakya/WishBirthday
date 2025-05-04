import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import Confetti from "react-confetti";

// Motion variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.7 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

// Helper to compute time left
const calculateTimeLeft = (targetDate) => {
  const diff = +new Date(targetDate) - +new Date();
  if (diff <= 0) return {};
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

// Countdown component
const CountdownTimer = ({ targetDate, onComplete }) => {
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
      {Object.entries(time).map(([u, v]) => (
        <div key={u} className="text-center p-2">
          <div className="font-mono text-3xl sm:text-4xl">{v}</div>
          <div className="capitalize text-sm sm:text-base">{u}</div>
        </div>
      ))}
    </div>
  );
};

// Gallery component with slow load
const AnimatedGallery = ({ images }) => (
  <div className="grid grid-cols-2 gap-4">
    {images.map((src, i) => (
      <motion.img
        // variants={itemVariants}
        key={i}
        src={src}
        alt={`mem ${i}`}
        className="h-56 w-full md:h-80 rounded-xl shadow-md object-cover object-top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 10, duration: 10 }}
      />
    ))}
  </div>
);

// Main App component
export default function App() {
  const birthday = "2025-05-04T13:25:00";
  const memories = [
    "/images/photo1.png",
    "/images/photo2.png",
    "/images/photo3.png",
    "/images/photo4.png",
  ];
  const birthdaySong = "/audio/happy-birthday.mp3";
  const partySong = "/audio/party-time.mp3";

  const [showContent, setShowContent] = useState(false);
  const [startedCelebration, setStartedCelebration] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showPartyButton, setShowPartyButton] = useState(false);

  const birthdayAudioRef = useRef(null);
  const partyAudioRef = useRef(null);
  const confettiTimeoutRef = useRef(null);
  const partyButtonTimeoutRef = useRef(null);

  // Triggered when countdown hits zero
  const handleIntroComplete = () => setShowContent(true);

  // Start birthday celebration on click/tap
  const handleStartCelebration = () => {
    setStartedCelebration(true);
    const audio = birthdayAudioRef.current;
    if (audio) {
      audio.play().catch(() => {});
      setConfettiActive(true);
      // Stop confetti after fixed timeout
      const confettiTimeout = setTimeout(() => setConfettiActive(false), 42000);
      confettiTimeoutRef.current = confettiTimeout;
      const partyBtnTimeout = setTimeout(() => setShowPartyButton(true), 40000);
      partyButtonTimeoutRef.current = partyBtnTimeout;
    }
  };

  // Cleanup timeouts on unmount
  useEffect(
    () => () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
      if (partyButtonTimeoutRef.current)
        clearTimeout(partyButtonTimeoutRef.current);
    },
    []
  );

  // Play party song on button click
  const handlePartyTime = () => {
    const audio = partyAudioRef.current;
    if (audio) audio.play().catch(() => {});
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8 flex flex-col justify-center items-center">
      {/* Hidden audio elements */}
      <audio ref={birthdayAudioRef} src={birthdaySong} className="hidden" />
      <audio ref={partyAudioRef} src={partySong} className="hidden" />

      {!showContent ? (
        // Countdown stage
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <CountdownTimer
            targetDate={birthday}
            onComplete={handleIntroComplete}
          />
        </motion.div>
      ) : !startedCelebration ? (
        // Intro prompt stage
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          onClick={handleStartCelebration}
          className="cursor-pointer text-center p-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-xl md:text-3xl font-bold"
          >
            🎂 Happy Birthday, Nirbhay! 🎂
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 text-sm sm:text-lg">
            <span>Click here to celebrate</span>
          </motion.p>
        </motion.div>
      ) : (
        // Celebration stage: gallery, confetti, party button after images
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="h-full space-y-6 text-center w-full max-w-3xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-xl md:text-3xl font-bold mb-20"
          >
            ❤️ I have some Memories ! ❤️
          </motion.h1>

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

          <motion.div variants={itemVariants}>
            <AnimatedGallery images={memories} />
          </motion.div>

          <div className="h-20">
            {showPartyButton && (
              <>
                <motion.button
                  onClick={handlePartyTime}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2 }}
                  className="px-5 py-3 w-full bg-pink-500 text-white rounded-full shadow hover:bg-pink-700 mt-5"
                >
                  🎉 Let's Party! 🎉
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
