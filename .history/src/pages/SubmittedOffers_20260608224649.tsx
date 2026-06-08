import React, { useState, useEffect } from 'react';
console.log("OFFERS COMPONENT MOUNTED");
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
import api, { dataApi } from '../lib/api';

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
  const [expandedMsgs, setExpandedMsgs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const local = localStorage.getItem('client_student_requests');
    if (local) {
      setStudentRequests(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        console.log('Fetching offers from backend...');
        const response = await dataApi.getOffers();
        console.log('Fetched offers from backend:', response);
      if (response && Array.isArray(response.data)) {

        const normalizedOffers = response.data.map((offer: any) => ({
          id: offer.offer_id,
          requestId: offer.request_id,
          requestTitle: offer.request?.title || '',
          studentName: offer.request?.poster_name || '',
          proposedPrice: offer.price,
          message: offer.message,
          status: offer.status,
          timestamp: offer.timestamp
        }));

        console.log("NORMALIZED OFFERS:", normalizedOffers);

        setProposals(normalizedOffers);

        localStorage.setItem(
          'client_shared_proposals',
          JSON.stringify(normalizedOffers)
        );
}
      } catch (err) {
        console.warn('Silently falling back to localStorage proposals:', err);
      }
    };
    fetchOffers();
  }, []);

  const handleWithdrawProposal = async (id: string) => {
    const confirmation = window.confirm('Are you sure you want to withdraw this pitch/offer?');
    if (confirmation) {
      try {
        await api.delete('/offers/' + id);
      } catch (err) {
        console.warn('Failed to delete offer from backend:', err);
      }
      const updatedProposals = proposals.filter(p => p.id !== id);
      setProposals(updatedProposals);
      localStorage.setItem('client_shared_proposals', JSON.stringify(updatedProposals));
    }
  };

  const handleOpenEditProposal = (p: any) => {
    setEditingProposal(p);
    setRevisedPrice(String(p.proposedPrice));
    setRevisedMsg(p.message);
  };

  const handleUpdateProposalValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal) return;

    const updatedProposals = proposals.map(p => {
      if (p.id === editingProposal.id) {
        return {
          ...p,
          proposedPrice: parseFloat(revisedPrice) || p.proposedPrice,
          message: revisedMsg,
          timestamp: new Date().toISOString()
        };
      }
      return p;
    });

    setProposals(updatedProposals);
    localStorage.setItem('client_shared_proposals', JSON.stringify(updatedProposals));

    try {
      await api.put(`/offers/${editingProposal.id}`, {
        price: parseFloat(revisedPrice),
        message: revisedMsg
      });
    } catch (err) {
      console.warn('Failed to update offer in backend:', err);
    }

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
          <div className="space-y-6">
            {/* Mobile View: Stacked Cards (below md) */}
            <div className="space-y-4 md:hidden">
              {filteredProposals.map((prop, idx) => {
                const relatedReq = studentRequests.find(r => r.id === prop.requestId);
                const formattedDate = new Date(prop.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const isMsgExpanded = expandedMsgs[prop.id] || false;

                return (
                  <div 
                    key={prop.id} 
                    className={`overflow-hidden rounded-[2rem] border p-5 shadow-sm space-y-4 bg-white transition-all ${
                      prop.status === 'accepted' 
                        ? 'border-emerald-200 bg-emerald-50/5' 
                        : prop.status === 'declined'
                          ? 'border-slate-100 opacity-75'
                          : 'border-slate-150'
                    }`}
                  >
                    {/* Header: Request and Status Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 text-sm leading-tight">
                          {prop.requestTitle}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-bold flex flex-wrap items-center gap-2 mt-1">
                          <span className="bg-slate-50 border border-slate-250 px-1.5 py-0.5 rounded text-[9px] text-slate-500 font-semibold font-sans">
                            By {prop.studentName}
                          </span>
                          {relatedReq && (
                            <span className="flex items-center gap-0.5 text-[9px] text-slate-400 font-semibold font-sans">
                              <MapPin size={9} /> {relatedReq.campus}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono font-semibold">
                          Sent: {formattedDate}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider shrink-0 ${
                        prop.status === 'accepted'
                          ? 'bg-emerald-50 text-brand-primary border border-emerald-100'
                          : prop.status === 'declined'
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {prop.status === 'accepted' ? '✓ Accepted' : prop.status === 'declined' ? 'Closed' : '⏱ Pending'}
                      </span>
                    </div>

                    {/* Product Offered and Price Row */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs border border-slate-100">
                        <Tag size={12} className="text-slate-400" /> {prop.product || 'Standard Matching Item'}
                      </span>
                      <span className="text-sm font-black text-brand-primary bg-emerald-50/50 px-2.5 py-1 rounded-xl border border-emerald-100 font-mono shrink-0">
                        M{prop.proposedPrice}
                      </span>
                    </div>

                    {/* Pitch message */}
                    <div className="bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl">
                      <p className={`text-xs font-semibold text-slate-500 italic leading-relaxed ${isMsgExpanded ? '' : 'line-clamp-3'}`}>
                        "{prop.message}"
                      </p>
                      {prop.message && prop.message.length > 80 && (
                        <button
                          type="button"
                          onClick={() => setExpandedMsgs(prev => ({ ...prev, [prop.id]: !isMsgExpanded }))}
                          className="text-[10px] font-black text-brand-primary uppercase mt-2 focus:outline-none focus:ring-0 select-none cursor-pointer"
                        >
                          {isMsgExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>

                    {/* Simulator Controls Row */}
                    <div className="flex items-center justify-between gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10px]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Sim:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'accepted')}
                          className={`px-2 py-0.5 font-bold uppercase rounded-md border text-[9px] transition-all select-none ${
                            prop.status === 'accepted' 
                              ? 'bg-emerald-50 text-brand-primary border-emerald-100' 
                              : 'bg-white hover:bg-slate-100 border-slate-100 text-slate-500'
                          }`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'declined')}
                          className={`px-2 py-0.5 font-bold uppercase rounded-md border text-[9px] transition-all select-none ${
                            prop.status === 'declined' 
                              ? 'bg-rose-50 text-rose-500 border-rose-100' 
                              : 'bg-white hover:bg-slate-100 border-slate-100 text-slate-500'
                          }`}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleSimulateStudentStatus(prop.id, 'pending')}
                          className="px-2 py-0.5 font-bold uppercase rounded-md border text-[9px] bg-white hover:bg-slate-100 border-slate-100 text-slate-500 transition-all z-0 cursor-pointer select-none"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Action buttons (Withdraw, Revise) */}
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => handleWithdrawProposal(prop.id)}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-red-500 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-all select-none text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={13} /> Withdraw
                      </button>
                      {prop.status === 'pending' && (
                        <button
                          onClick={() => handleOpenEditProposal(prop)}
                          className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all select-none text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Revise
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Table (hidden on mobile, visible on md and above) */}
            <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500">
                  <thead className="bg-slate-50/70 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-4.5">Request</th>
                      <th scope="col" className="px-6 py-4.5">Product Offered</th>
                      <th scope="col" className="px-6 py-4.5">Price</th>
                      <th scope="col" className="px-6 py-4.5">Message</th>
                      <th scope="col" className="px-6 py-4.5">Status</th>
                      <th scope="col" className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredProposals.map((prop, idx) => {
                      const relatedReq = studentRequests.find(r => r.id === prop.requestId);
                      const formattedDate = new Date(prop.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-6">
                            <div>
                              <div className="font-black text-slate-900 text-sm leading-tight">{prop.requestTitle}</div>
                              <div className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-2">
                                <span className="bg-slate-50 border border-slate-250 px-1.5 py-0.5 rounded text-[10px] text-slate-500">By {prop.studentName}</span>
                                {relatedReq && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-slate-400"><MapPin size={10} /> {relatedReq.campus}</span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono mt-1 font-semibold">Sent: {formattedDate}</div>
                            </div>
                          </td>

                          <td className="px-6 py-6">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs border border-slate-100">
                              <Tag size={12} className="text-slate-400" /> {prop.product || 'Standard Matching Item'}
                            </span>
                          </td>

                          <td className="px-6 py-6 font-mono">
                            <span className="text-sm font-black text-brand-primary bg-emerald-50/50 px-2.5 py-1 rounded-xl border border-emerald-100">
                              M{prop.proposedPrice}
                            </span>
                          </td>

                          <td className="px-6 py-6 max-w-xs">
                            <p className="text-xs font-semibold text-slate-500 italic line-clamp-2" title={prop.message}>
                              "{prop.message}"
                            </p>
                          </td>

                          <td className="px-6 py-6">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                              prop.status === 'accepted'
                                ? 'bg-emerald-50 text-brand-primary border border-emerald-100'
                                : prop.status === 'declined'
                                  ? 'bg-slate-100 text-slate-400'
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {prop.status === 'accepted' ? '✓ Accepted' : prop.status === 'declined' ? 'Closed' : '⏱ Pending'}
                            </span>
                          </td>

                          <td className="px-6 py-6 text-right">
                            <div className="flex flex-col gap-2.5 items-end">
                              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-[9px]">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider px-1">Sim:</span>
                                <button
                                  onClick={() => handleSimulateStudentStatus(prop.id, 'accepted')}
                                  className={`px-2 py-0.5 font-bold uppercase rounded-md border transition-all ${
                                    prop.status === 'accepted' 
                                      ? 'bg-emerald-50 text-brand-primary border-emerald-100' 
                                      : 'bg-white hover:bg-slate-100 border-slate-100 text-slate-500'
                                  }`}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleSimulateStudentStatus(prop.id, 'declined')}
                                  className={`px-2 py-0.5 font-bold uppercase rounded-md border transition-all ${
                                    prop.status === 'declined' 
                                      ? 'bg-rose-50 text-rose-500 border-rose-100' 
                                      : 'bg-white hover:bg-slate-100 border-slate-100 text-slate-500'
                                  }`}
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleSimulateStudentStatus(prop.id, 'pending')}
                                  className="px-2 py-0.5 font-bold uppercase rounded-md border bg-white hover:bg-slate-100 border-slate-100 text-slate-500 transition-all z-0 cursor-pointer"
                                >
                                  Reset
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleWithdrawProposal(prop.id)}
                                  className="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-wider transition-all select-none z-0 cursor-pointer"
                                >
                                  Withdraw
                                </button>
                                {prop.status === 'pending' && (
                                  <button
                                    onClick={() => handleOpenEditProposal(prop)}
                                    className="text-slate-900 hover:text-brand-primary text-[10px] font-black uppercase tracking-wider transition-all select-none z-0 cursor-pointer"
                                  >
                                    Revise
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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
