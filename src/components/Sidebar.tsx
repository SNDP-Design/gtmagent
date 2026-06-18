'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Mail,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Progress Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'AI Strategy Builder', href: '/ai-strategy-builder', icon: Sparkles, badge: 1 },
  { label: 'ICP & Channel Finder', href: '/icp-channel-finder', icon: Users },
  { label: 'Outreach Copy Generator', href: '/outreach-copy-generator', icon: Mail },
  { label: 'Experiment Tracker', href: '/experiment-tracker', icon: FlaskConical, badge: 3 },
  { label: 'GTM Momentum', href: '/gtm-momentum', icon: TrendingUp },
];

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-card border-r border-border sidebar-transition ${
        collapsed ? 'w-16' : 'w-60'
      } flex-shrink-0 z-30`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border px-3 ${collapsed ? 'justify-center' : 'gap-3 px-4'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-[15px] text-foreground tracking-tight">GTM Fox</span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[4.5rem] z-40 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-150 shadow-card"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Workspace badge */}
      {!collapsed && (
        <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-lg bg-secondary flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center flex-shrink-0">
            <Zap size={12} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-600 text-foreground truncate font-semibold">Alex's Workspace</p>
            <p className="text-[10px] text-muted-foreground">Solo Plan</p>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-2">
            Workspace
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              key={`nav-${item.href}`}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                isActive ? 'nav-item-active' : 'nav-item-inactive'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-border pt-2 mt-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
            currentPath === '/settings' ? 'nav-item-active' : 'nav-item-inactive'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Settings</span>}
        </Link>
        <Link
          href="/sign-up-login"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg nav-item-inactive transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Sign Out</span>}
        </Link>

        {!collapsed && (
          <div className="mt-3 px-3 py-3 rounded-lg bg-muted flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AK
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground truncate">Alex Kim</p>
              <p className="text-[11px] text-muted-foreground truncate">alex@buildwithgtm.co</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}