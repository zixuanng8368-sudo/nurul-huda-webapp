import React, { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Prayer {
  name: string;
  time: string;
}

interface RawPrayerData {
  day: number;
  hijri: string;
  fajr: number;
  syuruk: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

// ─── Helper: Unix timestamp (seconds) → "h:mm am/pm" in Malaysia Time ────────

function unixToMYT(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',   // no leading zero e.g. "5:30" not "05:30"
    minute: '2-digit',
    hour12: true,      // am/pm
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrayerTimesCarousel: React.FC = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 320;

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const response = await fetch('https://api.waktusolat.app/v2/solat/SBH07');
        const json = await response.json();

        const today = new Date().getDate();
        const todayRaw: RawPrayerData | undefined = json.prayers.find(
          (p: RawPrayerData) => p.day === today
        );

        if (!todayRaw) throw new Error('No data for today');

        const mapped: Prayer[] = [
          { name: 'Subuh',   time: unixToMYT(todayRaw.fajr)    },
          { name: 'Syuruk',  time: unixToMYT(todayRaw.syuruk)  },
          { name: 'Zuhur',   time: unixToMYT(todayRaw.dhuhr)   },
          { name: 'Asar',    time: unixToMYT(todayRaw.asr)     },
          { name: 'Maghrib', time: unixToMYT(todayRaw.maghrib) },
          { name: 'Isyak',   time: unixToMYT(todayRaw.isha)    },
        ];

        setPrayers(mapped);

        // Compare raw Unix timestamps directly — no string parsing needed
        const prayerTimestamps = [
          todayRaw.fajr,
          todayRaw.syuruk,
          todayRaw.dhuhr,
          todayRaw.asr,
          todayRaw.maghrib,
          todayRaw.isha,
        ];

        const nowInSeconds = Date.now() / 1000;
        const upcomingIndex = prayerTimestamps.findIndex((ts) => ts > nowInSeconds);
        const idx = upcomingIndex === -1 ? 0 : upcomingIndex;
        setNextPrayerIndex(idx);
        setScrollIndex(idx);
      } catch (err) {
        console.error('Error fetching solat times:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  // ── Drag handlers ───────────────────────────────────────────────────────────
  const commitDrag = () => {
    const threshold = CARD_WIDTH / 3;
    if (dragOffset < -threshold)
      setScrollIndex((i) => Math.min(i + 1, prayers.length - 1));
    else if (dragOffset > threshold)
      setScrollIndex((i) => Math.max(i - 1, 0));
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStartX(e.clientX); };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) setDragOffset(e.clientX - dragStartX); };
  const handleMouseUp   = () => { if (isDragging) commitDrag(); };

  const handleTouchStart = (e: React.TouchEvent) => { setIsDragging(true); setDragStartX(e.touches[0].clientX); };
  const handleTouchMove  = (e: React.TouchEvent) => { if (isDragging) setDragOffset(e.touches[0].clientX - dragStartX); };
  const handleTouchEnd   = () => { if (isDragging) commitDrag(); };

  const translateX = -(scrollIndex * CARD_WIDTH) + dragOffset;

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Waktu Solat Hari Ini</h2>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[300px] rounded-2xl p-8 bg-gray-100 animate-pulse h-40" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="py-12 px-4 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Waktu Solat Hari Ini</h2>
        <p className="text-red-500">Gagal memuatkan waktu solat. Sila cuba lagi.</p>
      </section>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <section className="py-12 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Waktu Solat Hari Ini
        </h2>

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
            {prayers.map((prayer, index) => (
              <div
                key={index}
                className={`min-w-[300px] rounded-2xl p-8 text-center border transition-all duration-300 ${
                  index === nextPrayerIndex
                    ? 'bg-blue-600 text-white shadow-xl scale-105 border-blue-400'
                    : 'bg-gray-50 text-gray-800 border-gray-200 opacity-60'
                }`}
              >
                <h3 className={`text-lg font-semibold ${index === nextPrayerIndex ? 'text-blue-100' : 'text-gray-500'}`}>
                  {prayer.name}
                  {index === nextPrayerIndex && (
                    <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                      Seterusnya
                    </span>
                  )}
                </h3>
                <p className="text-5xl font-black text-black mt-4">{prayer.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {prayers.map((_, i) => (
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
            ⏰ Waktu solat di atas adalah untuk Zon SBH07 (Kota Kinabalu & Sekitarnya).
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrayerTimesCarousel;