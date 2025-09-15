import React, { useMemo, useState } from 'react';
import { useLeadershipProfiles } from '@/hooks/useLeadership';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, ArrowRight, Users, Award, Building2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const Leadership = () => {
  const { data: leaders, isLoading } = useLeadershipProfiles();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLeader, setPreviewLeader] = useState<any | null>(null);

  const allLeaders = Array.isArray(leaders) ? leaders : [];

  const industries = useMemo(() => {
    const set = new Set<string>();
    allLeaders.forEach((l:any) => { if (l.industry) set.add(l.industry); });
    return ['all', ...Array.from(set)];
  }, [allLeaders]);

  const filtered = useMemo(() => {
    return allLeaders.filter((l:any) => {
      if (filter !== 'all' && l.industry !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (l.name || '').toLowerCase().includes(q) || (l.title || '').toLowerCase().includes(q) || (l.company || '').toLowerCase().includes(q);
    });
  }, [allLeaders, query, filter]);

  const featured = filtered.filter((l:any) => l.featured).slice(0,5);
  const regular = filtered.filter((l:any) => !l.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
      </div>
    );
  }

  const openPreview = (leader:any) => { setPreviewLeader(leader); setPreviewOpen(true); };
  const closePreview = () => { setPreviewOpen(false); setPreviewLeader(null); };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-end">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-3 bg-insightRed/10 rounded-full"><Users className="h-8 w-8 text-insightRed"/></div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Leadership Profiles</h1>
              <p className="text-gray-200 mt-2">Profiles of visionary leaders driving transformation across industries.</p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <Input placeholder="Search leaders, titles, companies..." value={query} onChange={(e:any)=>setQuery(e.target.value)} className="w-full max-w-lg" />
            <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="h-10 rounded-md border px-3 text-sm">
              {industries.map((i)=> <option key={i} value={i}>{i === 'all' ? 'All industries' : i}</option>)}
            </select>
            <Button onClick={()=>{ setQuery(''); setFilter('all'); }}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Featured carousel */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-insightBlack">Featured Leaders</h2>
              <Link to="/leadership" className="text-sm text-insightRed">View all</Link>
            </div>
            <div className="overflow-visible relative">
              <div className="flex gap-6 overflow-x-auto py-6 px-6 no-scrollbar">
                {featured.map((l:any, idx:number)=> (
                  <div key={l.id} className="min-w-[220px] w-[220px] shrink-0 relative group cursor-pointer" onClick={()=>openPreview(l)}>
                    <div className="aspect-[3/4] overflow-visible">
                      <img src={l.image_url || '/placeholder.svg'} alt={l.name} className="w-full h-full object-contain p-2 rounded-lg shadow-lg" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-6 bg-black/60 text-white text-xs rounded-md px-3 py-1 backdrop-blur-sm opacity-90">
                      <div className="font-semibold">{l.name}</div>
                      <div className="text-[11px] text-gray-200">{l.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">All Leadership Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regular.map((l:any)=> (
              <div key={l.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6 flex items-start gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img src={l.image_url || '/placeholder.svg'} alt={l.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-insightBlack">{l.name}</h3>
                        <div className="text-insightRed text-sm font-medium">{l.title}</div>
                        {l.company && <div className="text-sm text-gray-500 mt-1">{l.company}</div>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {l.linkedin_url && <a href={l.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600"><Linkedin className="h-4 w-4"/></a>}
                          {l.twitter_url && <a href={l.twitter_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400"><Twitter className="h-4 w-4"/></a>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={()=>openPreview(l)} className="bg-insightBlack text-white">Quick View</Button>
                          <Link to={`/leadership/${l.slug}`} className="text-insightRed hover:text-insightBlack text-sm">View</Link>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-3 line-clamp-3">{l.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Empty state */}
        {allLeaders.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Leadership Profiles Available</h3>
            <p className="text-gray-500">Check back soon for inspiring leadership stories and profiles.</p>
          </div>
        )}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewLeader?.name}</DialogTitle>
            <DialogDescription>{previewLeader?.title} {previewLeader?.company ? ` • ${previewLeader.company}` : ''}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-1">
              <img src={previewLeader?.image_url || '/placeholder.svg'} alt={previewLeader?.name} className="w-full h-auto rounded-lg object-contain" />
              <div className="mt-4 flex gap-3">
                {previewLeader?.linkedin_url && <a href={previewLeader.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600"><Linkedin className="h-5 w-5"/></a>}
                {previewLeader?.twitter_url && <a href={previewLeader.twitter_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-400"><Twitter className="h-5 w-5"/></a>}
                {previewLeader?.email && <a href={`mailto:${previewLeader.email}`} className="text-gray-600 hover:text-gray-900"><Mail className="h-5 w-5"/></a>}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">About</h3>
              <p className="text-gray-700 mb-4">{previewLeader?.bio}</p>
              <h4 className="font-semibold">Key Expertise</h4>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {(previewLeader?.expertise || ['Leadership','Strategy','Digital Transformation']).slice(0,6).map((e:any,i:number)=> (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Link to={`/leadership/${previewLeader?.slug}`} className="inline-flex items-center text-insightRed hover:text-insightBlack">Read full profile <ArrowRight className="ml-2 h-4 w-4"/></Link>
                <Button variant="outline" onClick={()=>{ navigator.clipboard?.writeText(window.location.href); }} className="ml-2">Share</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leadership;
