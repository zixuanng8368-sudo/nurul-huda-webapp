// src/pages/EventsPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import EventCard from '../components/EventCard';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  organizer: string;
  image_url: string | null;
  is_active: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_MY: Record<number, string> = {
  1:'Jan', 2:'Feb', 3:'Mac', 4:'Apr', 5:'Mei', 6:'Jun',
  7:'Jul', 8:'Ogos', 9:'Sep', 10:'Okt', 11:'Nov', 12:'Dis',
};

function formatDateMY(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS_MY[month]} ${year}`;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1591088398332-8c716b89973f?w=500&h=300&fit=crop';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col md:flex-row gap-4 bg-white rounded-lg p-4 mb-6 border border-gray-100">
    <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-lg shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-8 bg-gray-200 rounded-xl w-full mt-4" />
    </div>
  </div>
);

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type Filter = 'upcoming' | 'past' | 'all';

// ─── Main Page ────────────────────────────────────────────────────────────────

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });
      if (error) setError('Gagal memuatkan acara. Sila cuba lagi.');
      else setEvents(data ?? []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = events.filter(ev => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'upcoming' ? ev.date >= today :
      ev.date < today;

    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      ev.title.toLowerCase().includes(q) ||
      ev.organizer.toLowerCase().includes(q) ||
      formatDateMY(ev.date).toLowerCase().includes(q)
    );

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Acara Masjid</h1>
        <p className="text-gray-500 text-base sm:text-lg">
          Semua aktiviti dan program yang akan datang
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari acara, penganjur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {([
            { key: 'upcoming', label: 'Akan Datang' },
            { key: 'past',     label: 'Lepas' },
            { key: 'all',      label: 'Semua' },
          ] as { key: Filter; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                filter === key
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Result count */}
        {search.trim() && !loading && (
          <p className="text-xs text-gray-500 mb-3">
            {filtered.length === 0
              ? 'Tiada acara dijumpai'
              : `${filtered.length} acara dijumpai untuk "${search}"`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={() => window.location.reload()}
              className="text-blue-600 underline text-sm">
              Cuba semula
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-lg font-medium text-gray-500">
              {search ? 'Tiada acara sepadan.' : filter === 'upcoming' ? 'Tiada acara akan datang buat masa ini.' : 'Tiada acara.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-blue-500 text-sm underline">
                Padam carian
              </button>
            )}
          </div>
        )}

        {/* Events */}
        {!loading && !error && filtered.length > 0 && (
          <div>
            {filtered.map(event => (
              <EventCard
                key={event.id}
                image={event.image_url ?? FALLBACK_IMAGE}
                title={event.title}
                date={formatDateMY(event.date)}
                description={event.description}
                organizer={event.organizer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;