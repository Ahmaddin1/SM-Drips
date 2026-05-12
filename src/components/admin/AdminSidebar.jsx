'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, ShoppingBag, Package, Settings, LogOut, Home } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Dashboard', route: '/admin', icon: BarChart3 },
    { label: 'Orders', route: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', route: '/admin/products', icon: Package },
    { label: 'Settings', route: '/admin/settings', icon: Settings },
    { label: 'Home', route: '/', icon: Home }
  ];

  const isActive = (route) => {
    if (route === '/') return pathname === '/';
    if (route === '/admin') return pathname === '/admin';
    return pathname.startsWith(route);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="fixed left-0 w-64 h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#defc3e]">SM-Drips Admin</h1>
      </div>

      <nav className="flex-1 px-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`flex items-center gap-3 px-4 py-3 rounded mb-1 transition-colors ${
                isActive(link.route)
                  ? 'bg-[#282828] text-[#defc3e]'
                  : 'text-[#6b6b6b] hover:bg-[#1a1a1a]'
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded bg-[#1a1a1a] text-[#999] hover:bg-[#282828] transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
