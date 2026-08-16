import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors, Home, History,
  Menu, X, Zap, Plus, LogOut, LogIn, UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { YouTubeIcon, FacebookIcon, InstagramIcon } from './PlatformIcon';

const NAV_LINKS = [
  { to: '/dashboard', icon: Home, label: 'Submit', badge: null },
  { to: '/connect/youtube', icon: YouTubeIcon, label: 'YouTube', badge: null },
  { to: '/connect/facebook', icon: FacebookIcon, label: 'Facebook', badge: null },
  { to: '/connect/instagram', icon: InstagramIcon, label: 'Instagram', badge: null },
  { to: '/history', icon: History, label: 'History', badge: null },
];

function NavItem({ to, icon: Icon, label, badge, onClick }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to + '/'));

  return (
    <Link
      to={to}
      onClick={onClick}
      id={`nav-${label.toLowerCase()}`}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 select-none
        ${isActive
          ? 'bg-accent/15 text-primary border border-accent/25 shadow-[0_0_12px_rgba(124,58,237,0.12)]'
          : 'text-muted hover:text-primary hover:bg-card/70 border border-transparent'
        }
      `}
    >
      {/* Active left indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
      )}

      {/* Icon container */}
      <span className={`
        flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-accent text-white shadow-[0_2px_8px_rgba(124,58,237,0.4)]'
          : 'bg-card/70 text-muted group-hover:bg-card/90 group-hover:text-primary'
        }
      `}>
        <Icon className="w-3.5 h-3.5" />
      </span>

      <span className="flex-1">{label}</span>

      {/* Badge */}
      {badge && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
          ${isActive ? 'bg-accent text-white' : 'bg-card/80 text-muted'}
        `}>
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed h-full z-30 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.16),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.16),_transparent_40%)]"
        style={{ backgroundColor: 'var(--surface)', backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)' }}
      >
        {/* Subtle inner border */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-border/0 via-border to-border/0" />
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-md z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ease-out md:hidden
        `}
        style={{
          backgroundColor: 'var(--surface)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid rgba(39,39,42,0.8)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          id="close-sidebar"
          className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-card/80 transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Content area */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-[0_2px_8px_rgba(124,58,237,0.4)]">
              <Scissors className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm tracking-tight text-primary">ClipRank</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent-light font-semibold border border-accent/20">AI</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            id="open-sidebar"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-card/80 border border-transparent hover:border-border transition-all duration-150"
          >
            <Menu className="w-4 h-4" />
          </button>
        </header>

        {/* Page */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 h-16">
        {/* Icon with gradient + glow */}
        <div
          className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}
        >
          <Scissors className="w-4 h-4 text-white" />
          {/* Inner shine */}
          <div className="absolute inset-0 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-primary leading-none">ClipRank</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap className="w-2.5 h-2.5 text-accent" />
            <span className="text-[10px] text-muted font-medium">AI-Powered Clips</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── New Clip CTA ── */}
      <div className="px-3 py-3">
        <button
          onClick={() => { navigate('/dashboard'); onNavigate?.(); }}
          id="new-clip-cta"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(124,58,237,0.4)] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9333ea 100%)', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }}
        >
          <Plus className="w-4 h-4" />
          New Clip
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 pb-2 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[9px] text-muted/40 uppercase tracking-[0.15em] font-bold px-3 py-2 mt-1">
          Menu
        </p>
        {NAV_LINKS.map((link) => (
          <NavItem key={link.to} {...link} onClick={onNavigate} />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 pb-4 space-y-2">
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent-light">
                  {(user?.username || user?.email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary truncate">{user?.username}</p>
                <p className="text-[10px] text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              id="logout-btn"
              className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Link
              to="/login"
              onClick={onNavigate}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-primary hover:bg-white/5 border border-transparent hover:border-border transition-all duration-150"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={onNavigate}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-accent-light hover:text-accent hover:bg-accent/10 border border-accent/20 transition-all duration-150"
            >
              <UserPlus className="w-4 h-4" />
              Create account
            </Link>
          </div>
        )}


        {/* Version */}
        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] text-muted/40">ClipRank v1.0</span>
          <span className="text-[10px] text-accent/60 font-medium">Beta</span>
        </div>
      </div>
    </div>
  );
}
