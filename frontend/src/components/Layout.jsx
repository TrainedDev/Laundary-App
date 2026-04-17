import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Logo = () => (
  <div className="flex items-center gap-3 px-2">
    <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-lg">
      🧺
    </div>
    <span className="font-display text-lg font-700 text-white tracking-tight">LaundryOS</span>
  </div>
);

const NavItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`
        flex flex-col h-full bg-gray-900/60 border-r border-white/[0.06] backdrop-blur-xl
        ${mobile ? 'w-64 p-4' : 'w-64 p-4'}
      `}
    >
      <div className="mb-8 mt-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
          Main
        </p>
        <NavItem to="/" end icon="📊" label="Dashboard" />
        <NavItem to="/orders" icon="📋" label="Orders" />
        <NavItem to="/orders/new" icon="➕" label="New Order" />
      </nav>

      <div className="border-t border-white/[0.06] pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 bottom-0 z-50" onClick={(e) => e.stopPropagation()}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gray-900/60 backdrop-blur-xl">
          <Logo />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            ☰
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
