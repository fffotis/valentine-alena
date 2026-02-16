import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// ==============================
// ❤️ INSTRUCTIONS
// 1. Replace media files inside the `media` array with your own.
// 2. Start date is set to October 20 (change year if needed).
// 3. Fully optimized for smartphones.
// ==============================

const START_DATE = new Date("2025-10-20T00:00:00");

type MediaItem = {
  type: "image" | "video";
  src: string;
};

const media: MediaItem[] = [
  { type: "image", src: "/media/photo1.jpg" },
  { type: "image", src: "/media/photo2.jpg" },
  { type: "image", src: "/media/photo3.jpg" },
  { type: "image", src: "/media/photo4.jpg" },
  { type: "image", src: "/media/photo5.jpg" },
  { type: "image", src: "/media/photo6.jpg" },
  { type: "image", src: "/media/photo7.jpg" },
  { type: "image", src: "/media/photo8.jpg" },
  { type: "image", src: "/media/photo9.jpg" },
  { type: "image", src: "/media/photo10.jpg" },
  { type: "video", src: "/media/video1.mp4" },
  { type: "video", src: "/media/video2.mp4" },
];

type HeartItem = {
  id: number;
  left: number;
  duration: number;
};

export default function App() {
  const [index, setIndex] = useState<number>(0);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [opened, setOpened] = useState<boolean>(false);
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 📱 Swipe support for mobile
  let touchStartX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) prev();
    if (diff < -50) next();
  };

  // ⏳ TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 💖 HEARTS
  const spawnHearts = () => {
    const newHearts: HeartItem[] = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      duration: 2 + Math.random() * 2,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHearts((prev) => prev.slice(-20));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % media.length);
    spawnHearts();
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + media.length) % media.length);
    spawnHearts();
  };

  // 💌 COVER SCREEN
  if (!opened) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-300 p-4"
        onClick={() => setOpened(true)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 text-center w-full max-w-sm cursor-pointer"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl mb-4"
          >
            💌
          </motion.div>
          <h2 className="text-2xl font-bold text-rose-600 mb-3">
            Алёне от Руслана
          </h2>
          <p className="text-rose-500 text-sm">
            Нажми, чтобы открыть валентинку ❤️
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-red-200 flex flex-col items-center justify-start overflow-hidden text-center px-4 pt-8 pb-20"
      onClick={spawnHearts}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -250 }}
            exit={{ opacity: 0 }}
            transition={{ duration: heart.duration }}
            className="absolute text-pink-500"
            style={{ left: `${heart.left}%`, bottom: 0 }}
          >
            <Heart fill="currentColor" size={18} />
          </motion.div>
        ))}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-rose-700 mb-3">
        Алёна ❤️
      </h1>

      <p className="text-rose-700 text-sm mb-1">Ты — моё самое тёплое воспоминание.</p>
      <p className="text-rose-700 text-sm mb-1">Моё спокойствие. Мой смех.</p>
      <p className="text-rose-700 text-sm mb-4">Моё счастье.</p>

      {/* TIMER */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl mb-6 w-full max-w-md">
        <p className="text-rose-600 mb-3 font-semibold text-sm">Мы вместе уже:</p>
        <div className="grid grid-cols-2 gap-3 text-rose-700 font-bold">
          <div>
            <div className="text-xl">{timeTogether.days}</div>
            <div className="text-xs">дней</div>
          </div>
          <div>
            <div className="text-xl">{timeTogether.hours}</div>
            <div className="text-xs">часов</div>
          </div>
          <div>
            <div className="text-xl">{timeTogether.minutes}</div>
            <div className="text-xs">минут</div>
          </div>
          <div>
            <div className="text-xl">{timeTogether.seconds}</div>
            <div className="text-xs">секунд</div>
          </div>
        </div>
      </div>

      {/* MEDIA */}
      <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {media[index].type === "image" ? (
              <img
                src={media[index].src}
                alt="memory"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={media[index].src}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-rose-700 mt-4 text-xs">Свайпай влево или вправо 💞</p>

      {/* Floating buttons fixed bottom for mobile */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prev}
          className="rounded-full px-5 py-3 bg-rose-500 text-white shadow-lg active:scale-95"
        >
          ⬅
        </button>
        <button
          onClick={next}
          className="rounded-full px-5 py-3 bg-rose-500 text-white shadow-lg active:scale-95"
        >
          ➡
        </button>
      </div>
    </div>
  );
}