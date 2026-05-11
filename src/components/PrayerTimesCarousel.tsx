import React, { useState, useEffect, useRef } from 'react';

interface Prayer {
  name: string;
  time: string;
}

interface PrayerTimesCarouselProps {
  prayerTimes: {
    today: Prayer[];
  };
}

const PrayerTimesCarousel: React.FC<PrayerTimesCarouselProps> = ({ prayerTimes }) => {
  // nextPrayerIndex: locked to the actual next prayer — never changes on drag
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  // scrollIndex: tracks which card the carousel is scrolled to
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 320; // card min-width (300) + gap (20)

  // Find the next upcoming prayer on mount and scroll carousel to it
  useEffect(() => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const upcomingIndex = prayerTimes.today.findIndex((prayer) => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return hours * 60 + minutes > currentTimeInMinutes;
    });

    const idx = upcomingIndex === -1 ? 0 : upcomingIndex;
    setNextPrayerIndex(idx);
    setScrollIndex(idx);
  }, [prayerTimes]);

  const translateX = -(scrollIndex * CARD_WIDTH) + dragOffset;

  // --- Mouse handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    commitDrag();
  };

  // --- Touch handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    commitDrag();
  };

  const commitDrag = () => {
    const threshold = CARD_WIDTH / 3;
    if (dragOffset < -threshold) {
      setScrollIndex((i) => Math.min(i + 1, prayerTimes.today.length - 1));
    } else if (dragOffset > threshold) {
      setScrollIndex((i) => Math.max(i - 1, 0));
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <section className="py-12 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Waktu Solat Hari Ini
        </h2>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {prayerTimes.today.map((prayer, index) => (
              <div
                key={index}
                className={`min-w-[300px] rounded-2xl p-8 text-center border transition-all duration-300 ${
                  index === nextPrayerIndex
                    ? 'bg-blue-600 text-white shadow-xl scale-105 border-blue-400'
                    : 'bg-gray-50 text-gray-800 border-gray-200 opacity-60'
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    index === nextPrayerIndex ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {prayer.name}
                  {index === nextPrayerIndex && (
                    <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                      Seterusnya
                    </span>
                  )}
                </h3>
                <p className="text-5xl font-black mt-4">{prayer.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {prayerTimes.today.map((_, i) => (
            <button
              key={i}
              onClick={() => setScrollIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === scrollIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm italic">
            ⏰ Waktu solat di atas adalah untuk Wilayah Kuala Lumpur.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrayerTimesCarousel;