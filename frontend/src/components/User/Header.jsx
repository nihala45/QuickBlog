import React from 'react';
import { assets } from '../../assets/assets';

const Header = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Image */}
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40 -z-10"
      />

      <div className="mx-4 sm:mx-8 xl:mx-24 py-16 sm:py-24 text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-700">
          Your Own <span className="text-primary">blogging</span> <br className="hidden sm:block" />
          platform
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg">
          This is your space to think out loud, to share what matters, and to write 
          without filters. Whether it's one word or a thousand, your 
          story starts right here.
        </p>

        {/* Search Form */}
        <form className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center items-center max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for blogs"
            required
            className="w-full sm:w-auto flex-1 border border-gray-300 rounded px-4 py-3 outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded hover:scale-105 transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
