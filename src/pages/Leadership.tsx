import React, { useMemo, useState } from 'react';
import { useLeadershipProfiles } from '@/hooks/useLeadership';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, ArrowRight, Users, Award, Building2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

const Leadership = () => {
  const { data: leaders, isLoading } = useLeadershipProfiles();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLeader, setPreviewLeader] = useState<any | null>(null);
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Leadership", url: `${siteOrigin}/leadership` },
      ])
    : undefined;

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
      <>
        <Seo title="Leadership" noindex />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insightRed"></div>
        </div>
      </>
    );
  }

  const openPreview = (leader:any) => { setPreviewLeader(leader); setPreviewOpen(true); };
  const closePreview = () => { setPreviewOpen(false); setPreviewLeader(null); };

  return (
    <>
      <Seo
        title="Leadership"
        description="Executive profiles, leadership interviews, and insights from influential business leaders."
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen bg-white">


      <div className="max-w-7xl mx-auto px-12 sm:px-6 lg:px-8">

        {/* Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-insightBlack mb-6">All Leadership Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((l:any)=> (
              <div key={l.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <div className="aspect-video bg-gray-100">
                    <img src={l.image_url || '/placeholder.svg'} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  {l.industry && (
                    <span className="absolute top-3 left-3 bg-white/90 text-insightBlack text-xs font-semibold px-2 py-1 rounded">{l.industry}</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-insightBlack mb-1">{l.name}</h3>
                  <div className="text-insightRed text-sm font-medium">{l.title}</div>
                  {l.company && <div className="text-sm text-gray-500 mt-1">{l.company}</div>}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">{l.bio}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {l.linkedin_url && <a href={l.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600"><Linkedin className="h-4 w-4"/></a>}
                      {l.twitter_url && <a href={l.twitter_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400"><Twitter className="h-4 w-4"/></a>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm" onClick={()=>openPreview(l)} variant="outline">Quick View</Button>
                      <Link to={`/leadership/${l.slug}`} className="text-insightRed hover:text-insightBlack text-sm inline-flex items-center">Read profile <ArrowRight className="ml-1 h-4 w-4"/></Link>
                    </div>
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
              <img src={previewLeader?.image_url || '/placeholder.svg'} alt={previewLeader?.name} className="w-full h-auto rounded-lg object-cover" />
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
    </>
  );
};

export default Leadership;
