'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, Book, PenTool } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BookOpen },
  { href: '/vocabulary', label: 'Vocabulary', icon: Book },
  { href: '/sentences', label: 'Sentences', icon: FileText },
  { href: '/reading', label: 'Reading', icon: BookOpen },
  { href: '/writing', label: 'Writing', icon: PenTool },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-blue-200 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-100 scale-105'
                  : 'text-black hover:text-blue-600 active:scale-95'
              }`}
            >
              <Icon className="w-6 h-6 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
