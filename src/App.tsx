import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const START_DATE = new Date("2025-11-20T00:00:00");

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
];

type HeartItem = {
  id: number;
  left: number;
  size: number;
  duration: number;
};

export default function App() {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Preload media
  useEffect(() => {
    const preload = async () => {
      const promises = media.map((item) => {
        return new Promise<void>((resolve) => {
          if (item.type === "image") {
            const img = new Image();
            img.src = item.src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          } else {
            const video = document.createElement("video");
            video.src = item.src;
            video.onloadeddata = () => resolve();
            video.onerror = () => resolve();
          }
        });
      });

      await Promise.all(promises);
      setLoaded(true);
    };

    preload();
  }, []);

  // Timer restored
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

  // Soft floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: HeartItem = {
        id: Math.random(),
        left: Math.random() * 100,
        size: 12 + Math.random() * 18,
        duration: 6 + Math.random() * 4,
      };

      setHearts((prev) => [...prev.slice(-40), newHeart]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  let touchStartX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (delta > 50) prev();
    if (delta < -50) next();
  };

  const next = () => setIndex((prev) => (prev + 1) % media.length);
  const prev = () => setIndex((prev) => (prev - 1 + media.length) % media.length);

  if (!loaded) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-300">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl text-rose-600"
        >
          ❤️
        </motion.div>
      </div>
    );
  }

  if (!opened) {
    return (
      <div
        className="min-h-[100svh] flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-300 p-6"
        onClick={() => setOpened(true)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm cursor-pointer"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl mb-4"
          >
            💌
          </motion.div>
          <h2 className="text-2xl font-bold text-rose-600 mb-2">
            Алёне от Руслана
          </h2>
          <p className="text-rose-500">
            Нажми, чтобы открыть валентинку ❤️
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] bg-gradient-to-br from-pink-100 via-rose-200 to-red-200 flex flex-col items-center justify-center overflow-hidden text-center px-4 py-6">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.4, y: -600 }}
            transition={{ duration: heart.duration, ease: "linear" }}
            className="absolute text-pink-400 pointer-events-none"
            style={{ left: `${heart.left}%`, bottom: -20 }}
          >
            <Heart fill="currentColor" size={heart.size} />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-6xl font-bold text-rose-700 mb-4"
      >
        Алёна ❤️
      </motion.h1>

      {/* TIMER */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-xl mb-6 w-full max-w-md">
        <p className="text-rose-600 mb-2 font-semibold">Мы вместе уже:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-rose-700 font-bold">
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

      <div
        className="relative w-full max-w-xl aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
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

      {!isMobile && (
        <div className="flex gap-6 mt-6">
          <button
            onClick={prev}
            className="rounded-2xl text-lg px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white shadow-xl"
          >
            ⬅ Назад
          </button>
          <button
            onClick={next}
            className="rounded-2xl text-lg px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white shadow-xl"
          >
            Вперёд ➡
          </button>
        </div>
      )}

      <div className="bottom-4 text-rose-700 text-sm">
        Люблю тебя сильнее с каждым днём ❤️
      </div>
    </div>
  );
}
