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
    <aside className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 h-screen w-64 flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold text-gray-800">
        Admin Panel
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-200 hover:text-gray-900 transition ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
