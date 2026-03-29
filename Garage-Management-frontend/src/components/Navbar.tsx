import React from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

interface NavbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { theme, setTheme } = useSettings();

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          {title && (
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-48"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
