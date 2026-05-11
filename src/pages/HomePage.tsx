import React, { useState, useEffect, useRef } from 'react';
import PrayerTimesCarousel from '../components/PrayerTimesCarousel';
import Banner from '../components/Banner';
import EventCard from '../components/EventCard';
import MasjidLocation from '../components/MasjidLocation';
import EventsSection from '../components/EventsSection';

// Prayer times data
  const prayerTimes = {
    today: [
      { name: 'Subuh', time: '05:30' },
      { name: 'Dhuha', time: '07:00' },
      { name: 'Zohor', time: '12:45' },
      { name: 'Asar', time: '15:30' },
      { name: 'Maghrib', time: '18:15' },
      { name: 'Isyak', time: '19:45' },
    ]
  };

const HomePage: React.FC = () => {
  const [selectedPrayerDay] = useState<'today' | 'tomorrow'>('today');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <Banner />

      {/* Prayer Times Section */}
    <PrayerTimesCarousel prayerTimes={prayerTimes} />

      {/* About Mosque Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Tentang Masjid Kita</h2>
              <p className="text-gray-700 text-lg mb-4">
                Masjid Kita adalah pusat ibadah dan pembelajaran Islam yang berdedikasi untuk melayani komunitas Muslim lokal. Kami berkomitmen untuk menyediakan fasilitas berkualitas tinggi dan program pendidikan Islam yang berkomprehensif.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Dengan moto "Menyemai Taqwa, Memperkasa Ummah", kami berfokus pada pembangunan spiritual, intelektual, dan sosial masyarakat Muslim.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <p className="text-gray-700"><strong>Lapang Solat:</strong> Kapasiti 500 orang</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <p className="text-gray-700"><strong>Perpustakaan Islam:</strong> Koleksi 2000+ buku</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <p className="text-gray-700"><strong>Bilik Pembelajaran:</strong> 5 bilik untuk program</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <p className="text-gray-700"><strong>Kafeteria:</strong> Makanan halal berkualiti</p>
                </div>
              </div>
            </div>

            <div>
              <img 
                src="https://images.unsplash.com/photo-1591088398332-8c716b89973f?w=600&h=400&fit=crop" 
                alt="Masjid Kita" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Perkhidmatan Kami</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kelas Quran</h3>
              <p className="text-gray-700 text-sm">Program Tahsin dan hafalan untuk semua umur</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kuliah Islam</h3>
              <p className="text-gray-700 text-sm">Tazkirah harian oleh ulama dan ustaz berpengalaman</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tadika Islam</h3>
              <p className="text-gray-700 text-sm">Pendidikan awal kanak-kanak dengan nilai Islam</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">💍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Khidmat Perkahwinan</h3>
              <p className="text-gray-700 text-sm">Kemudahan solat nikah dan majlis perkahwinan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <EventsSection />

      {/* Quick Info Section */}
      <MasjidLocation />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Masjid Kita</h4>
              <p className="text-gray-400 text-sm">Menyemai Taqwa, Memperkasa Ummah</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white">Utama</a></li>
                <li><a href="/sejarah" className="hover:text-white">Sejarah</a></li>
                <li><a href="/carta" className="hover:text-white">Organisasi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Program</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Kelas Quran</a></li>
                <li><a href="#" className="hover:text-white">Kuliah Islam</a></li>
                <li><a href="#" className="hover:text-white">Tadika Islam</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Ikuti Kami</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Masjid Kita. Semua hak terpelihara. | Privasi | Syarat Penggunaan</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;