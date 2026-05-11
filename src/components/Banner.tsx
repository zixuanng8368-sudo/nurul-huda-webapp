// src/components/Banner.tsx
import React from 'react';
import hero from '../assets/hero.jpeg';

const Banner = () => {
  return (
    <section className="relative h-[400px] flex items-center justify-center bg-gray-900">
      {/* Replace 'your-image-url.jpg' with your path */}
      <img 
        src={hero} 
        alt="Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold">Selamat Datang</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">Menyemai Taqwa, Memperkasa Ummah</p>
      </div>
    </section>
  );
};

export default Banner;