import React from 'react';

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 lg:px-24 my-16 md:my-32">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
        Never Miss a Blog
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-500/70 mb-6 max-w-xl">
        Subscribe to get the latest blog posts, new tech, and exclusive news.
      </p>
      <form
        className="
          w-full max-w-2xl
          flex flex-col sm:flex-row
          gap-3 sm:gap-0
          items-center
        "
      >
        <input
          className="
            border border-gray-300
            rounded-md sm:rounded-none
            sm:rounded-l-md
            h-12
            w-full
            px-4
            text-gray-700
            focus:outline-none
            focus:ring-2 focus:ring-primary
          "
          type="email"
          placeholder="Enter your email address"
          required
        />
        <button
          type="submit"
          className="
            bg-primary/80 hover:bg-primary
            text-white
            h-12
            w-full sm:w-auto
            px-6 sm:px-10
            rounded-md sm:rounded-none sm:rounded-r-md
            transition-all
            whitespace-nowrap
          "
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
