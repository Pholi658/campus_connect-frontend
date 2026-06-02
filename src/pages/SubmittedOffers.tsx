import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle, 
  X,
  Send,
  Sparkles,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const SubmittedOffers: React.FC = () => {
  const { user } = useAuthStore();
  const [proposals, setProposals] = useState<any[]>(() => {
    const saved = localStorage.getItem('client_shared_proposals');
    return saved ? JSON.parse(saved) : [
      {
        id: 'prop-fallback-l2-1',
        requestId: 'req-l2',
        requestTitle: 'HP Pavilion Laptop Charger (65W)',
        studentName: 'Thabo Mokoena',
        proposedPrice: 380,
        vendorName: 'Roma Tech Hub',
        vendorPhone: '+266 5890 1234',
        vendorRating: 4.9,
        message: 'Greetings! I have the original 65W blue-tip replacement charger in stock right now at Roma Tech Hub. Let me know when you want to pick it up.',
        status: 'pending',
        timestamp: new Date().toISOString()
      },
      {
        id: 'prop-fallback-l1-1',
        requestId: 'req-l1',
        requestTitle: 'Macroeconomics 101 Textbook',
        studentName: 'Mpuleng Tseoa',
        proposedPrice: 300,
        vendorName: 'CAS Books & Supplies',
        vendorPhone: '+266 5971 8820',
        vendorRating: 4.9,
        message: 'Hi, I have a very clean, unmarked copy of this Macroeconomics textbook. Ready to bring it to your room in Maseru campus or meet near CAS.',
        status: 'pending',
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [studentRequests, setStudentRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  
  // Revise proposal modal state
  const [editingProposal, setEditingProposal] = useState<any | null>(null);
  const [revisedPrice, setRevisedPrice] = useState('');
  const [revisedMsg, setRevisedMsg] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const local = localStorage.getItem('client_student_requests');
    if (local) {
      setStudentRequests(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('client_shared_proposals', JSON.stringify(proposals));
  }, [proposals, user]);

  const handleWithdrawProposal = (id: string) => {
    const confirmation = window.confirm('Are you sure you want to withdraw this pitch/offer?');
    if (confirmation) {
      setProposals(proposals.filter(p => p.id !== id));
    }
  };

  const handleOpenEditProposal = (p: any) => {
    setEditingProposal(p);
    setRevisedPrice(String(p.proposedPrice));
    setRevisedMsg(p.message);
  };

  const handleUpdateProposalValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal) return;

    setProposals(proposals.map(p => {
      if (p.id === editingProposal.id) {
        return {
          ...p,
          proposedPrice: parseFloat(revisedPrice) || p.proposedPrice,
          message: revisedMsg,
          timestamp: new Date().toISOString()
        };
      }
      return p;
    }));

    setEditingProposal(null);
  };

  const handleSimulateStudentStatus = (id: string, newStatus: 'accepted' | 'declined' | 'pending') => {
    setProposals(proposals.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  // Metrics calculations
  const totalBids = proposals.length;
  const acceptedBids = proposals.filter(p => p.status === 'accepted').length;
  const pendingBids = proposals.filter(p => p.status === 'pending').length;
  const projectedRevenue = proposals
    .filter(p => p.status === 'accepted')
    .reduce((sum, p) => sum + (p.proposedPrice || 0), 0);

  // Filter proposals
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = 
      p.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-bg-main pb-24 pt-8 sm:pt-12 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Area */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <Briefcase size={14} />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">
                  Interactive Pitch Hub
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Sale & <span className="text-brand-primary">Offers Submitted</span>
              </h1>
              <p className="mt-3 text-lg font-medium text-slate-500">
                Track status updates, modify active price quotes, and connect with students who requested items.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-blue-600">
                <Send size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider leading-none">Total Pitches</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalBids}</p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-emerald-55/40 bg-emerald-50 p-4 sm:p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-100 text-brand-primary">
                <CheckCircle size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[10px] sm:text-xs font-black text-brand-primary uppercase tracking-wider leading-none">Accepted</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{acceptedBids}</p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-amber-50 p-4 sm:p-6 shadow-sm border border-amber-100/60 flex flex-col justify-between">
            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-amber-100 text-amber-600">
                <Clock size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wider leading-none">Pending Feed</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{pendingBids}</p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-lime-50/80 p-4 sm:p-6 shadow-sm border border-lime-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-lime-100 text-lime-700 select-none">
                <span className="text-xs sm:text-sm font-black font-mono">M</span>
              </div>
              <h3 className="text-[10px] sm:text-xs font-black text-lime-800 uppercase tracking-wider leading-none">Booked Cash</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-lime-950 mt-2">M{projectedRevenue}</p>
          </div>
        </div>

        {/* Filters and Search toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by student display name or requested item..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-100/80 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 font-sans">
            {(['all', 'pending', 'accepted', 'declined'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all select-none capitalize ${
                  statusFilter === f 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Pitches List Content Area */}
        {filteredProposals.length === 0 ? (
          <div className="py-20 text-center rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center px-4">
            <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800">No proposals match your search</h3>
            <p className="text-sm font-medium text-slate-400 max-w-sm mt-1">
              Either search under different criteria or pitch a new deal from the active student requests feed boards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProposals.map((prop, idx) => {
              // Try to find matching original student request for additional category/context
              const relatedReq = studentRequests.find(r => r.id === prop.requestId);
              const formattedDate = new Date(prop.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-7 shadow-sm border transition-all ${
                    prop.status === 'accepted' 
                      ? 'border-emerald-200 bg-emerald-50/10' 
                      : prop.status === 'declined'
                        ? 'border-slate-100 opacity-75'
                        : 'border-slate-100 hover:shadow-md'
                  }`}
                >
                  {/* Status & Price Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                      prop.status === 'accepted'
                        ? 'bg-emerald-50 text-brand-primary border border-emerald-100'
                        : prop.status === 'declined'
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {prop.status === 'accepted' ? '✓ Agreement Formed' : prop.status === 'declined' ? 'Closed' : '⏱ Pitch Pending'}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Your Quote</span>
                      <span className="text-2xl font-black text-brand-primary font-mono select-none block mt-1">M{prop.proposedPrice}</span>
                    </div>
                  </div>

                  {/* Requested Item Block */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requested Item</span>
                    <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5 mt-0.5">
                      <Tag size={14} className="text-slate-400 shrink-0" /> {prop.requestTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
                      <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-mono">By {prop.studentName}</span>
                      {relatedReq && (
                        <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <MapPin size={10} /> {relatedReq.campus}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Letter / Msg Offer Text Description */}
                  <div className="bg-slate-50/60 border border-slate-100/60 p-4 rounded-2xl mb-5 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Direct Pitch Pitch Message</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                      "{prop.message}"
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-200/30 text-[10px] text-slate-400 font-bold font-mono">
                      <span className="flex items-center gap-1"><Clock size={10} /> Sent: {formattedDate}</span>
                      {relatedReq && <span className="text-slate-400">Budget Limit: M{relatedReq.budget}</span>}
                    </div>
                  </div>

                  {/* Simulation of interaction / Actions bottom bar */}
                  <div className="flex flex-col gap-3.5 pt-4.5 border-t border-slate-100 mt-auto">
                    {/* Simulator Action Drawer for testing */}
                    <div className="flex items-center justify-between gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-200 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response (Simulate)</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'accepted')}
                          className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all select-none active:scale-95 ${
                            prop.status === 'accepted' 
                              ? 'bg-emerald-50 text-brand-primary border-emerald-100'
                              : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          Agree
                        </button>
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'declined')}
                          className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all select-none active:scale-95 ${
                            prop.status === 'declined' 
                              ? 'bg-rose-50 text-rose-500 border-rose-100'
                              : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'pending')}
                          className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all select-none active:scale-95 ${
                            prop.status === 'pending' 
                              ? 'bg-amber-50 text-amber-500 border-amber-100'
                              : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1 sm:mt-0">
                      <button
                        onClick={() => handleWithdrawProposal(prop.id)}
                        className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border border-transparent hover:bg-red-50 text-slate-400 hover:text-red-500 select-none active:scale-90 inline-flex items-center gap-1"
                        title="Withdraw Pitch Offer"
                      >
                        <Trash2 size={13} /> Withdraw Quote
                      </button>

                      {prop.status === 'pending' && (
                        <button
                          onClick={() => handleOpenEditProposal(prop)}
                          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all select-none active:scale-95 inline-flex items-center gap-1"
                        >
                          Revise Offer <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MODAL: REVISE OFFER BUDGET / STATEMENT */}
        <AnimatePresence>
          {editingProposal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.94, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 15 }}
                className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl relative border border-slate-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                      <Send className="text-brand-primary" size={20} /> Revise Submitted Offer
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      Updating quote for <strong className="text-slate-600 font-bold">{editingProposal.studentName}</strong>
                    </p>
                  </div>
                  <button 
                    onClick={() => setEditingProposal(null)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all select-none"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProposalValue} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">New Proposed Price (Loti M)</label>
                    <input 
                      required
                      type="number"
                      placeholder="e.g. 350"
                      value={revisedPrice}
                      onChange={(e) => setRevisedPrice(e.target.value)}
                      className="w-full rounded-2xl bg-slate-55 p-3.5 text-sm font-semibold border bg-slate-50/50 border-slate-100 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Revised Direct Message</label>
                    <textarea 
                      required
                      placeholder="Update details, availability or warranty statements..."
                      value={revisedMsg}
                      onChange={(e) => setRevisedMsg(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl bg-slate-55 p-3.5 text-sm font-semibold border bg-slate-50/50 border-slate-100 focus:outline-none focus:border-brand-primary resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProposal(null)}
                      className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-2xl border transition-all select-none"
                    >
                      Bail Out
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 text-sm font-black text-white uppercase tracking-widest bg-brand-primary hover:bg-emerald-600 rounded-2xl shadow-xl shadow-green-950/5 transition-all active:scale-95"
                    >
                      Update Pitch Offer
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SubmittedOffers;
