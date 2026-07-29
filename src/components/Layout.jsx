import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors, Home, Cpu, LayoutGrid, History,
  Menu, X, Zap, Plus, ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/',                icon: Home,        label: 'Submit',     badge: null },
  { to: '/processing/demo', icon: Cpu,          label: 'Processing', badge: null },
  { to: '/gallery/demo',    icon: LayoutGrid,   label: 'Gallery',    badge: '9'  },
  { to: '/history',         icon: History,      label: 'History',    badge: null },
];

function NavItem({ to, icon: Icon, label, badge, onClick }) {
  const location = useLocation();
  const segment = to.split('/')[1];
  const isActive =
    location.pathname === to ||
    (segment && segment !== '' && location.pathname.startsWith('/' + segment));

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
          : 'text-muted hover:text-primary hover:bg-white/5 border border-transparent'
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
          : 'bg-white/5 text-muted group-hover:bg-white/10 group-hover:text-primary'
        }
      `}>
        <Icon className="w-3.5 h-3.5" />
      </span>

      <span className="flex-1">{label}</span>

      {/* Badge */}
      {badge && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
          ${isActive ? 'bg-accent text-white' : 'bg-white/10 text-muted'}
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
      <aside className="hidden md:flex flex-col w-60 fixed h-full z-30"
        style={{ background: 'linear-gradient(180deg, #111113 0%, #0e0e10 100%)' }}
      >
        {/* Subtle inner border */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-border/0 via-border to-border/0" />
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ease-out md:hidden
        `}
        style={{
          background: 'linear-gradient(180deg, #111113 0%, #0e0e10 100%)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid rgba(39,39,42,0.8)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          id="close-sidebar"
          className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white/8 transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Content area */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-20 border-b border-border"
          style={{ background: 'rgba(17,17,19,0.85)', backdropFilter: 'blur(16px)' }}
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
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white/8 border border-transparent hover:border-border transition-all duration-150"
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
          onClick={() => { navigate('/'); onNavigate?.(); }}
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
        {/* Divider */}
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />

        {/* Status */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-success/8 border border-success/15">
          <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
            <span className="relative w-2 h-2 rounded-full bg-success" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary leading-none">All systems live</p>
            <p className="text-[10px] text-muted mt-0.5">API · Workers · Storage</p>
          </div>
          <ArrowUpRight className="w-3 h-3 text-muted flex-shrink-0" />
        </div>

        {/* Version */}
        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] text-muted/40">ClipRank v1.0</span>
          <span className="text-[10px] text-accent/60 font-medium">Beta</span>
        </div>
      </div>
    </div>
  );
}
