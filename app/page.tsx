"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Folder,
  PlusCircle,
  Users,
  Download,
  Upload,
  Heart,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const DRIVE_FOLDER_LINK = "https://drive.google.com/drive/folders/1IaTWw8HEmTo7IbyxudN65yu9zNkUgdbD?usp=drive_link";

const INITIAL_MEMBERS = [
  { id: "1", name: "Abegael A Jardinero", bio: "Group creator ✨", driveLink: "https://drive.google.com", photoUrl: "" },
  { id: "2", name: "Andro Oberos Aynera", bio: "PHYSCI2018 Pioneer 🔬", driveLink: "", photoUrl: "" },
  { id: "3", name: "Arra Mae De Loyola", bio: "Always active! ⚡", driveLink: "", photoUrl: "" },
  { id: "4", name: "Christine Joy Jarapa - Largado", bio: "Keeping the group together ❤️", driveLink: "", photoUrl: "" },
  { id: "5", name: "Ian Reyes Soriano", bio: "The legendary theorist 🌌", driveLink: "", photoUrl: "" },
  { id: "6", name: "Jamil Ramos Alejandria", bio: "PHYSCI2018 energy provider 🔋", driveLink: "", photoUrl: "" },
  { id: "7", name: "Jefferson Abasola", bio: "On top of every milestone 📈", driveLink: "", photoUrl: "" },
  { id: "8", name: "John Ryan M. Marasigan", bio: "Making memories every day 📸", driveLink: "", photoUrl: "" },
  { id: "9", name: "Luisa Salamia", bio: "PHYSCI2018 anchor ⚓", driveLink: "", photoUrl: "" },
  { id: "10", name: "Lyka Bernadette Versoza", bio: "Stellar performer ⭐", driveLink: "", photoUrl: "" },
  { id: "11", name: "Maria Anthonette Bea Abasola", bio: "Memory documenter 📝", driveLink: "", photoUrl: "" },
  { id: "12", name: "Mark Peñas Arce", bio: "Chasing milestones 🚀", driveLink: "", photoUrl: "" },
  { id: "13", name: "Mjg Barrosa", bio: "PHYSCI2018 life of the party 🎉", driveLink: "", photoUrl: "" },
  { id: "14", name: "Oxy Paredes Fordan", bio: "Vibe coding master 💻", driveLink: "", photoUrl: "" },
  { id: "15", name: "Resha Pangindian Mendoza", bio: "Always bringing the good news 🌟", driveLink: "", photoUrl: "" },
  { id: "16", name: "Thea Baluyo", bio: "Spreading positive vibes ✨", driveLink: "", photoUrl: "" }
];

const INITIAL_MILESTONES = [
  {
    id: "m1",
    memberName: "Abegael A Jardinero",
    title: "Built the PHYSCI2018 web hub",
    date: "2026-05-22",
    description: "Laid down the first version of the group homepage as a clean, fast browser-based memory board.",
    driveLink: DRIVE_FOLDER_LINK
  },
  {
    id: "m2",
    memberName: "Oxy Paredes Fordan",
    title: "Styled the team interface",
    date: "2026-05-22",
    description: "Polished the layout with stronger color accents, simpler navigation, and more readable member cards.",
    driveLink: DRIVE_FOLDER_LINK
  }
];

export default function PhysciHub() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'profiles' | 'admin'>('timeline');
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const [selectedMember, setSelectedMember] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneDrive, setMilestoneDrive] = useState("");

  useEffect(() => {
    const savedMembers = localStorage.getItem('physci_members');
    const savedMilestones = localStorage.getItem('physci_milestones');
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedMilestones) setMilestones(JSON.parse(savedMilestones));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    }
  }, []);

  const saveToLocal = (updatedMembers: typeof members, updatedMilestones: typeof milestones) => {
    localStorage.setItem('physci_members', JSON.stringify(updatedMembers));
    localStorage.setItem('physci_milestones', JSON.stringify(updatedMilestones));
  };

  const handleUpdateBio = (id: string, newBio: string, newLink: string, newPhotoUrl?: string) => {
    const updated = members.map(m =>
      m.id === id ? { ...m, bio: newBio, driveLink: newLink, photoUrl: newPhotoUrl ?? m.photoUrl } : m
    );
    setMembers(updated);
    saveToLocal(updated, milestones);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !milestoneTitle || !milestoneDate) return;

    const newMilestone = {
      id: Date.now().toString(),
      memberName: selectedMember,
      title: milestoneTitle,
      date: milestoneDate,
      description: milestoneDesc,
      driveLink: milestoneDrive || DRIVE_FOLDER_LINK
    };

    const updatedMilestones = [newMilestone, ...milestones];
    setMilestones(updatedMilestones);
    saveToLocal(members, updatedMilestones);

    setMilestoneTitle("");
    setMilestoneDate("");
    setMilestoneDesc("");
    setMilestoneDrive("");
    alert("✨ Milestone shared successfully to the feed!");
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ members, milestones });
    navigator.clipboard.writeText(dataStr);
    alert("📋 Data copied to clipboard! Paste this code block into your group chat so others can import it.");
  };

  const handleImportData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget.elements.namedItem('importJSON') as HTMLTextAreaElement;
    try {
      const parsed = JSON.parse(target.value);
      if (parsed.members && parsed.milestones) {
        setMembers(parsed.members);
        setMilestones(parsed.milestones);
        saveToLocal(parsed.members, parsed.milestones);
        alert("🟢 Success! Your PHYSCI2018 App data has synced up with the group chat update!");
        target.value = "";
      } else {
        alert("❌ Invalid package layout structure.");
      }
    } catch {
      alert("❌ Critical decoding failure. Make sure you copy the entire code chunk.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500 selection:text-white">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-gradient-to-tr from-pink-500 via-blue-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-md animate-pulse">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-pink-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-wider">
                PHYSCI2018
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Our Eternal Memory Hub</p>
            </div>
          </div>
          <div className="bg-slate-800 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20 flex items-center space-x-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PWA Sync Active</span>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 pt-4 pb-28 min-h-[calc(100vh-65px)]">
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-400" />
              <h3 className="text-md font-bold mb-3 flex items-center text-pink-400">
                <PlusCircle className="h-5 w-5 mr-1.5" /> Share New Milestone
              </h3>
              <form onSubmit={handleAddMilestone} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Who is posting?</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-all"
                  >
                    <option value="">Select Member Name...</option>
                    {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Milestone Action</label>
                    <input
                      type="text"
                      placeholder="e.g., Passed the Board Exam!"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                    <input
                      type="date"
                      value={milestoneDate}
                      onChange={(e) => setMilestoneDate(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Context / Details</label>
                  <textarea
                    placeholder="Describe this group core memory details..."
                    rows={2}
                    value={milestoneDesc}
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Google Drive Media Link</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={milestoneDrive}
                    onChange={(e) => setMilestoneDrive(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-500 hover:opacity-90 active:scale-[0.99] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all mt-2"
                >
                  <span>Broadcast to PHYSCI Timeline</span>
                </button>
              </form>
            </section>
            <section className="space-y-4">
              <h2 className="text-lg font-black tracking-wide text-slate-300 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Live Milestone Timeline</span>
              </h2>
              {milestones.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-2xl">
                  No memories broadcasted yet. Be the first to post!
                </div>
              ) : (
                milestones.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full flex items-center justify-center font-bold text-xs">
                          {item.memberName.charAt(0)}
                        </div>
                        <span className="text-xs font-black text-slate-300">{item.memberName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center font-mono">
                        <Calendar className="h-3 w-3 mr-1" /> {item.date}
                      </span>
                    </div>
                    <h4 className="text-md font-bold text-emerald-400 tracking-wide mb-1.5">{item.title}</h4>
                    {item.description && <p className="text-sm text-slate-400 leading-relaxed mb-3">{item.description}</p>}
                    {item.driveLink && (
                      <a
                        href={item.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-xl border border-blue-500/20 font-bold tracking-wide transition-all"
                      >
                        <Folder className="h-3.5 w-3.5" />
                        <span>Open Drive Gallery</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </section>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg font-black text-slate-300 flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span>PHYSCI2018 Directory ({members.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {members.map((member) => {
                const isExpanded = expandedProfile === member.id;
                return (
                  <div
                    key={member.id}
                    className={`bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden shadow-md ${
                      isExpanded ? 'border-pink-500 ring-1 ring-pink-500/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedProfile(isExpanded ? null : member.id)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-inner">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={`${member.name} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-black text-sm tracking-wide">
                              {member.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200 text-sm tracking-wide">{member.name}</h3>
                          <p className="text-xs text-slate-500 max-w-[200px] truncate">{member.bio || "No profile setup yet."}</p>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="bg-slate-950/60 p-4 border-t border-slate-800/80 space-y-4 animate-slideDown">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Personal Group Status Bio</label>
                          <input
                            type="text"
                            defaultValue={member.bio}
                            placeholder="Set personal badge subtitle description..."
                            onBlur={(e) => handleUpdateBio(member.id, e.target.value, member.driveLink)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Photo URL</label>
                          <input
                            type="url"
                            defaultValue={member.photoUrl}
                            placeholder="https://example.com/photo.jpg"
                            onBlur={(e) => handleUpdateBio(member.id, member.bio, member.driveLink, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Add a hosted image URL to show your profile picture.</p>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dedicated Personal Drive Folder Link</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              defaultValue={member.driveLink}
                              placeholder="https://drive.google.com/drive/..."
                              onBlur={(e) => handleUpdateBio(member.id, member.bio, e.target.value, member.photoUrl)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                            {member.driveLink && (
                              <a
                                href={member.driveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-500 text-slate-950 p-2 rounded-xl hover:opacity-90 font-bold transition-all text-xs flex items-center space-x-1"
                              >
                                <Folder className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic text-right">⚠️ Tap away from input fields to auto-save changes locally.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h2 className="text-md font-bold text-blue-400 flex items-center mb-2">
                <Download className="h-5 w-5 mr-1.5" /> Step 1: Export Data to Chat
              </h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Since this app runs for free without database dependencies, you can copy the full data state block below and drop it in your WhatsApp/Messenger chain.
              </p>
              <button
                onClick={handleExportData}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Generate Chat Package Link</span>
              </button>
            </section>
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h2 className="text-md font-bold text-emerald-400 flex items-center mb-1">
                <Upload className="h-5 w-5 mr-1.5" /> Step 2: Import Chat Updates
              </h2>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Paste any memory data chunk sent by your friends below to update your local timeline display instantly.
              </p>
              <form onSubmit={handleImportData} className="space-y-3">
                <textarea
                  name="importJSON"
                  placeholder="Paste long code layout received from the chat group here..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm py-2 rounded-xl transition-all"
                >
                  Unpack & Synchronize Layout
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center space-y-1 py-1 transition-all px-4 rounded-xl ${
              activeTab === 'timeline' ? 'text-pink-400 font-bold bg-pink-500/5' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex flex-col items-center space-y-1 py-1 transition-all px-4 rounded-xl ${
              activeTab === 'profiles' ? 'text-blue-400 font-bold bg-blue-500/5' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">Profiles</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center space-y-1 py-1 transition-all px-4 rounded-xl ${
              activeTab === 'admin' ? 'text-emerald-400 font-bold bg-emerald-500/5' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">Sync Chat</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
