import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  UsersIcon,
  BanknotesIcon,
  MegaphoneIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '../supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Module {
  name: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  { name: 'Acara Majlis',     icon: CalendarIcon,              color: 'bg-blue-500',    link: '/admin/events'         },
  { name: 'Pengurusan Ahli', icon: UsersIcon,                 color: 'bg-emerald-500', link: '/admin/users'         },
  { name: 'Kewangan/Tabung', icon: BanknotesIcon,             color: 'bg-amber-500',   link: '/admin/finance'       },
  { name: 'Pengumuman',      icon: MegaphoneIcon,             color: 'bg-purple-500',  link: '/admin/announcements' },
  { name: 'Galeri & Media',  icon: PhotoIcon,                 color: 'bg-rose-500',    link: '/admin/gallery'       },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const Icon = module.icon;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95 h-36 md:h-44 text-center w-full"
    >
      <div className={`${module.color} w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl mb-3 shadow-sm`}>
        <Icon className="text-white w-6 h-6 md:w-8 md:h-8" />
      </div>
      <h3 className="font-bold text-gray-800 text-xs md:text-base leading-tight">
        {module.name}
      </h3>
      <p className="hidden md:block text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
        Open Module
      </p>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">

      {/*
        Mobile:  2 columns — 5 cards = 2 / 2 / 1 (last card centered via the wrapper below)
        Tablet:  3 columns
        Desktop: 5 columns
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MODULES.map((module) => (
          <ModuleCard
            key={module.link}
            module={module}
            onClick={() => navigate(module.link)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;