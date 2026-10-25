'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  sender: string;
  text: string;
  time: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Lost' | 'Found' | 'Claimed / Resolved';
  location: string;
  currentLocation: string;
  dateTime: string;
  handedTo: string;
  image?: string;
  messages?: Message[];
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Track active chat drawer and chat inputs per item ID
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSender, setChatSender] = useState('');
  const [chatText, setChatText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ukm_items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const saveAndSetItems = (updated: Item[]) => {
    setItems(updated);
    localStorage.setItem('ukm_items', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveAndSetItems(updated);
  };

  const handleToggleResolved = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'Claimed / Resolved' ? 'Found' : 'Claimed / Resolved';
        return { ...item, status: newStatus as any };
      }
      return item;
    });
    saveAndSetItems(updated);
  };

  const handleSendMessage = (itemId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    const newMessage: Message = {
      sender: chatSender.trim() || 'Anonymous Student',
      text: chatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = items.map(item => {
      if (item.id === itemId) {
        const currentMessages = item.messages || [];
        return { ...item, messages: [...currentMessages, newMessage] };
      }
      return item;
    });

    saveAndSetItems(updated);
    setChatText('');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">UKM Lost & Found Hub</h1>
            </div>
            <p className="text-slate-400 text-sm">Centralized Campus Asset Tracking & Retrieval Network</p>
          </div>
          <Link 
            href="/report" 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Report Incident
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 shadow-lg flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Search by keywords, tags, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Student ID">Student ID</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Personal">Personal</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
            <option value="Claimed / Resolved">Claimed / Resolved</option>
          </select>
        </div>

        {/* Item Cards Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-slate-900/90 hover:bg-slate-900 transition-all duration-200 rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {item.image && (
                  <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-3 gap-3">
                  <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{item.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    item.status === 'Lost' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : item.status === 'Found'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm mb-5 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/40">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Category</p>
                    <p className="text-slate-300 font-medium truncate">{item.category}</p>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Original Location</p>
                    <p className="text-slate-300 font-medium truncate">{item.location}</p>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Collection Point</p>
                    <p className="text-emerald-400 font-medium truncate">{item.currentLocation}</p>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Handed To</p>
                    <p className="text-slate-300 font-medium truncate">{item.handedTo}</p>
                  </div>
                </div>

                {/* In-App Chat Toggle Section */}
                <div className="mb-4">
                  <button 
                    onClick={() => setActiveChatId(activeChatId === item.id ? null : item.id)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <span>💬 Inquiries & Claim Chat ({item.messages?.length || 0})</span>
                  </button>

                  {activeChatId === item.id && (
                    <div className="mt-3 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                        {(!item.messages || item.messages.length === 0) && (
                          <p className="text-slate-500 text-xs text-center py-2">No messages yet. Start the conversation below!</p>
                        )}
                        {item.messages?.map((msg, idx) => (
                          <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-emerald-400">{msg.sender}</span>
                              <span className="text-[10px] text-slate-500">{msg.time}</span>
                            </div>
                            <p className="text-slate-300">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={(e) => handleSendMessage(item.id, e)} className="space-y-2 pt-2 border-t border-slate-900">
                        <input 
                          type="text"
                          placeholder="Your Name (e.g. Ali)"
                          value={chatSender}
                          onChange={(e) => setChatSender(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Type inquiry or claim message..."
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                          <button 
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer Buttons */}
              <div className="pt-4 border-t border-slate-800/60 flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono">{new Date(item.dateTime).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleResolved(item.id)}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 transition font-medium"
                  >
                    {item.status === 'Claimed / Resolved' ? 'Reopen' : 'Mark Claimed'}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl py-16 text-center">
              <p className="text-slate-400 text-sm">No record matches found in database.</p>
              <p className="text-slate-600 text-xs mt-1">Submit a new incident report to start tracking.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}