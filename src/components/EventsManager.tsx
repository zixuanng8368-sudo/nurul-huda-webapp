import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  organizer: string;
  image_url: string | null;
  host_letter_url: string | null;
  is_active: boolean;
  created_at: string;
}

type EventFormData = Omit<Event, 'id' | 'created_at'>;

const EMPTY_FORM: EventFormData = {
  title: '',
  date: '',
  description: '',
  organizer: '',
  image_url: null,
  host_letter_url: null,
  is_active: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS: Record<number, string> = {
  1:'Jan',2:'Feb',3:'Mac',4:'Apr',5:'Mei',6:'Jun',
  7:'Jul',8:'Ogos',9:'Sep',10:'Okt',11:'Nov',12:'Dis',
};
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m]} ${y}`;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field = ({
  label, required = false, children,
}: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

// ─── Upload Zone ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  accept: string;
  file: File | null;
  existingUrl: string | null;
  onFileChange: (file: File | null) => void;
  icon: React.ReactNode;
  placeholder: string;
  hint: string;
  existingLabel: string;
  previewImage?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  accept, file, existingUrl, onFileChange,
  icon, placeholder, hint, existingLabel, previewImage = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition touch-action-manipulation min-h-[44px]"
        >
        {previewImage && previewUrl ? (
        <div className="space-y-2">
          <img src={previewUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg mx-auto" />
          <p className="text-xs text-gray-400">Klik untuk ganti gambar</p>
        </div>
      ) : file ? (
        <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-medium">
          <CheckCircleIcon className="w-5 h-5" />{file.name}
        </div>
      ) : existingUrl ? (
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
            {icon}{existingLabel}
          </div>
          <a href={existingUrl} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()} className="text-xs text-blue-500 underline">
            Lihat fail semasa
          </a>
          <p className="text-xs text-gray-400">Klik untuk ganti</p>
        </div>
      ) : (
        <div className="text-gray-400 text-sm space-y-1">
          {icon}<p>{placeholder}</p><p className="text-xs">{hint}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => onFileChange(e.target.files?.[0] ?? null)} />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modal, setModal] = useState<{ open: boolean; editing: Event | null }>({ open: false, editing: null });
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });

  // ── Search filter ───────────────────────────────────────────────────────────
  // Searches across title, organizer, and date — all client-side, no extra fetches

  const filteredEvents = events.filter(ev => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.organizer.toLowerCase().includes(q) ||
      formatDate(ev.date).toLowerCase().includes(q)
    );
  });

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    if (error) console.error('Error fetching events:', error);
    else setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  // ── Modal helpers ───────────────────────────────────────────────────────────

  const openAdd = () => {
    setForm(EMPTY_FORM); setImageFile(null); setLetterFile(null);
    setFormError(null); setModal({ open: true, editing: null });
  };

  const openEdit = (event: Event) => {
    setForm({
      title: event.title, date: event.date, description: event.description,
      organizer: event.organizer, image_url: event.image_url,
      host_letter_url: event.host_letter_url, is_active: event.is_active,
    });
    setImageFile(null); setLetterFile(null);
    setFormError(null); setModal({ open: true, editing: event });
  };

  const closeModal = () => setModal({ open: false, editing: null });

  // ── File upload ─────────────────────────────────────────────────────────────

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { console.error(`Upload error (${bucket}):`, error); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.title || !form.date || !form.organizer) {
      setFormError('Sila isi semua ruangan yang bertanda *'); return;
    }
    setSaving(true); setFormError(null);

    let imageUrl = form.image_url;
    let letterUrl = form.host_letter_url;

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, 'event-images', 'images');
      if (!imageUrl) { setFormError('Gagal memuat naik gambar. Sila cuba lagi.'); setSaving(false); return; }
    }
    if (letterFile) {
      letterUrl = await uploadFile(letterFile, 'event-letters', 'letters');
      if (!letterUrl) { setFormError('Gagal memuat naik surat. Sila cuba lagi.'); setSaving(false); return; }
    }

    const payload = { ...form, image_url: imageUrl, host_letter_url: letterUrl };

    if (modal.editing) {
      const { error } = await supabase.from('events').update(payload).eq('id', modal.editing.id);
      if (error) { setFormError('Gagal mengemaskini acara.'); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('events').insert(payload);
      if (error) { setFormError('Gagal menambah acara.'); setSaving(false); return; }
    }

    setSaving(false); closeModal(); fetchEvents();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { console.error('Delete error:', error); return; }
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleteModal({ show: false, id: null });
  };

  // ── Export — exports filtered results if searching, all otherwise ────────────

  const exportToExcel = () => {
    const source = searchQuery.trim() ? filteredEvents : events;
    const rows = source.map(ev => ({
      Tajuk: ev.title,
      Tarikh: ev.date,
      Penganjur: ev.organizer,
      Status: ev.is_active ? 'Aktif' : 'Tidak Aktif',
      Surat_Kebenaran: ev.host_letter_url ?? 'Tiada',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Senarai Acara');
    XLSX.writeFile(wb, 'Laporan_Acara.xlsx');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 max-w-6xl mx-auto pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengurusan Acara</h1>
          <p className="text-gray-500 text-sm">Uruskan aktiviti masjid</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={exportToExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-semibold text-sm">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export
          </button>
          <button onClick={openAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
            <PlusIcon className="w-4 h-4" /> Tambah Acara
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari mengikut tajuk, penganjur, atau tarikh..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {searchQuery.trim() && (
        <p className="text-xs text-gray-500 mb-3">
          {filteredEvents.length === 0
            ? 'Tiada acara dijumpai'
            : `${filteredEvents.length} acara dijumpai untuk "${searchQuery}"`}
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuatkan...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {searchQuery.trim() ? (
              <>
                <p className="text-4xl mb-2">🔍</p>
                <p>Tiada acara sepadan dengan carian anda.</p>
                <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-500 text-sm underline">
                  Padam carian
                </button>
              </>
            ) : (
              <>
                <p className="text-4xl mb-2">📅</p>
                <p>Tiada acara. Tambah acara pertama anda!</p>
              </>
            )}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acara</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Tarikh</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Penganjur</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Surat</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 hidden sm:flex">
                          <PhotoIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{event.title}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-0.5 space-y-0.5">
                          <div>{formatDate(event.date)} · {event.organizer}</div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {event.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                            {event.host_letter_url && (
                              <a href={event.host_letter_url} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 text-[10px] font-semibold">
                                <DocumentIcon className="w-3 h-3" /> Surat
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{formatDate(event.date)}</td>
                  <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{event.organizer}</td>
                  <td className="p-4 hidden md:table-cell">
                    {event.host_letter_url ? (
                      <a href={event.host_letter_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                        <DocumentIcon className="w-4 h-4" /> Lihat
                      </a>
                    ) : <span className="text-gray-400 text-sm">—</span>}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {event.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => setDeleteModal({ show: true, id: event.id })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Padam">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">
                {modal.editing ? 'Kemaskini Acara' : 'Tambah Acara Baru'}
              </h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4 flex-1">
              <Field label="Tajuk Acara" required>
                <input className={inputCls} placeholder="cth. Kuliah Subuh"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tarikh" required>
                  <input type="date" className={inputCls}
                    value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </Field>
                <Field label="Penganjur" required>
                  <input className={inputCls} placeholder="cth. Divisi Dakwah"
                    value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))} />
                </Field>
              </div>

              <Field label="Penerangan">
                <textarea className={`${inputCls} resize-none`} rows={3}
                  placeholder="Huraian ringkas acara..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </Field>

              <Field label="Gambar Acara">
                <UploadZone
                  accept=".jpg,.jpeg,.png,.webp" file={imageFile}
                  existingUrl={form.image_url} onFileChange={setImageFile}
                  icon={<PhotoIcon className="w-6 h-6 mx-auto" />}
                  placeholder="Klik untuk muat naik gambar" hint="JPG, PNG, WEBP — maks 5MB"
                  existingLabel="Gambar sedia ada" previewImage />
              </Field>

              <Field label="Surat Kebenaran / Notis">
                <UploadZone
                  accept=".pdf,.jpg,.jpeg,.png" file={letterFile}
                  existingUrl={form.host_letter_url} onFileChange={setLetterFile}
                  icon={<ArrowUpTrayIcon className="w-6 h-6 mx-auto" />}
                  placeholder="Klik untuk muat naik surat" hint="PDF, JPG, PNG — maks 5MB"
                  existingLabel="Surat sedia ada" />
              </Field>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Tunjuk di laman utama</p>
                  <p className="text-xs text-gray-400">Aktifkan untuk papar kepada orang ramai</p>
                </div>
                <button type="button"
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {formError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={closeModal}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition text-sm">
                {saving ? 'Menyimpan...' : modal.editing ? 'Kemaskini' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <ExclamationTriangleIcon className="w-7 h-7 shrink-0" />
              <h3 className="text-lg font-bold">Padam Acara?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Tindakan ini tidak boleh dibatalkan. Maklumat acara akan hilang selamanya.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null })}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
                Batal
              </button>
              <button onClick={() => deleteModal.id && handleDelete(deleteModal.id)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition text-sm">
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;