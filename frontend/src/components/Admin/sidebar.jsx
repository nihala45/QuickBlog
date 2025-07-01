import React from 'react';
import { NavLink } from 'react-router-dom';

// Heroicons (Outline style)
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Manage Users', path: '/admin/manage-users', icon: UsersIcon },
    { name: 'Manage Categories', path: '/admin/manage-categories', icon: FolderIcon },
    { name: 'Manage Blog', path: '/admin/manage-blog', icon: DocumentTextIcon },
    { name: 'Manage Draft', path: '/admin/draft-blog', icon: DocumentTextIcon },

  ];

  return (
    <aside className="bg-gradient-to-b from-gray-800 to-gray-700 text-gray-200 h-screen w-64 hidden md:flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold text-white">
        Admin Panel
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-600/60 hover:text-white transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
