import React from 'react';
import { assets, footer_data } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      {/* Top section */}
      <div
        className="
          flex flex-col md:flex-row
          items-start justify-between
          gap-10
          py-10
          border-b border-gray-500/30
          text-gray-500
        "
      >
        {/* Left column */}
        <div className="flex-1">
          <img src={assets.logo} alt="QuickBlog Logo" className="w-32 sm:w-44 mb-4" />
          <p className="max-w-md text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum unde
            quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>

        {/* Right column: links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-8 md:gap-5">
          {footer_data.map((section, index) => (
            <div key={index} className="min-w-[120px]">
              <h3 className="font-semibold text-base text-gray-900 mb-3 md:mb-5">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:underline transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom copyright */}
      <p className="py-4 text-center text-xs sm:text-sm md:text-base text-gray-500/80">
        Copyright © 2025 QuickBlog. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
