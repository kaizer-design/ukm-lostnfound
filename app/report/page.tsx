'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'Lost' | 'Found'>('Lost');
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [handedTo, setHandedTo] = useState('');
  const [image, setImage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      category: category || 'General',
      status,
      location,
      currentLocation: currentLocation || 'Not specified',
      dateTime,
      handedTo: handedTo || '-',
      image
    };

    const existing = JSON.parse(localStorage.getItem('ukm_items') || '[]');
    localStorage.setItem('ukm_items', JSON.stringify([newItem, ...existing]));
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Report Incident</h1>
            <p className="text-slate-400 text-xs mt-0.5">Log a new lost or found item into the campus database</p>
          </div>
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition">
            ← Back to Hub
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Item Title / Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Student ID Card, Casio Calculator, Tumbler"
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Status Type</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as 'Lost' | 'Found')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Category (Free Type)</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Electronics, Cards, Accessories"
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Upload Image of Item</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 transition cursor-pointer"
            />
            {image && (
              <div className="mt-3">
                <p className="text-xs text-emerald-400 mb-1">Image preview selected:</p>
                <img src={image} alt="Preview" className="h-24 rounded-lg border border-slate-800 object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Description & Details</label>
            <textarea 
              required
              rows={3}
              placeholder="Provide color, brand, serial number, or identifying marks..."
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Original Location</label>
              <input 
                type="text" 
                required
                placeholder="e.g., FTSM Cafeteria / DK1"
                value={location} 
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Current Collection Point</label>
              <input 
                type="text" 
                placeholder="e.g., Kolej Keris Counter / Security Office"
                value={currentLocation} 
                onChange={e => setCurrentLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Date & Time</label>
              <input 
                type="datetime-local" 
                required
                value={dateTime} 
                onChange={e => setDateTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/80 transition"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Handed To (Person / Office)</label>
              <input 
                type="text" 
                placeholder="e.g., Guard Ali / Pn. Siti"
                value={handedTo} 
                onChange={e => setHandedTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-2"
          >
            Submit Incident Report
          </button>
        </form>
      </div>
    </main>
  );
}