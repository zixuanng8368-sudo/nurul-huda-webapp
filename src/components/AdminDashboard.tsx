import { 
  Calendar, 
  Users, 
  DollarSign, 
  Bell, 
  Image as ImageIcon,
  LogOut 
} from 'lucide-react'; // Assuming you use lucide-react for icons

const AdminDashboard = () => {
  const modules = [
    { name: 'Waktu Solat', icon: <Calendar />, color: 'bg-blue-500', link: '/admin/solat' },
    { name: 'Pengurusan Ahli', icon: <Users />, color: 'bg-emerald-500', link: '/admin/users' },
    { name: 'Kewangan/Tabung', icon: <DollarSign />, color: 'bg-amber-500', link: '/admin/finance' },
    { name: 'Pengumuman', icon: <Bell />, color: 'bg-purple-500', link: '/admin/announcements' },
    { name: 'Galeri & Media', icon: <ImageIcon />, color: 'bg-rose-500', link: '/admin/gallery' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-sm text-gray-500">Nurul Huda Web App</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-red-500 transition">
          <LogOut size={24} />
        </button>
      </header>

      {/* Stats Quick View (Optional) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Kutipan Jumaat</p>
          <p className="text-xl font-bold text-gray-900">RM 1,240</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Ahli Baru</p>
          <p className="text-xl font-bold text-gray-900">+12</p>
        </div>
      </div>

      {/* Module Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={() => window.location.href = module.link}
            className="flex items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group active:scale-95"
          >
            <div className={`${module.color} p-4 rounded-2xl text-white mr-4 group-hover:scale-110 transition-transform`}>
              {module.icon}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 text-lg">{module.name}</h3>
              <p className="text-xs text-gray-400">Kemaskini modul ini</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;