import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

interface Props { articles: any[]; basePath?: string; layout?: 'editorial' | 'grid' }

function imgOf(a:any){return a?.image_url||'/placeholder.svg'}
function titleOf(a:any){return a?.title||'Untitled'}
function slugOf(a:any){return a?.slug||''}
function dateOf(a:any){const d=a?.date?new Date(a.date):null;return d?d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):''}
function categoryOf(a:any){return a?.category||'Business'}
function excerptOf(a:any){return a?.excerpt||''}

const EditorialList = ({articles = [], basePath = '/article', layout = 'editorial'}: Props) => {
  const sorted = Array.isArray(articles)?[...articles].sort((a,b)=>new Date(b?.date||0).getTime()-new Date(a?.date||0).getTime()):[];
  const lead = sorted[0];
  const list = sorted.slice(1);
  const trending = [...sorted].slice(0,6);

  if (layout === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((a,i)=> (
            <Link key={slugOf(a)+i} to={`${basePath}/${slugOf(a)}`} className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              </div>
              <div className="p-4">
                <div className="text-xs text-insightRed font-bold uppercase tracking-wide mb-1">{categoryOf(a)}</div>
                <h3 className="text-lg font-semibold text-insightBlack group-hover:text-insightRed mb-1 line-clamp-2">{titleOf(a)}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{excerptOf(a)}</p>
                <div className="text-xs text-gray-500 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-8">
        {lead && (
          <Link to={`${basePath}/${slugOf(lead)}`} className="block group overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[16/9]">
              <img src={imgOf(lead)} alt={titleOf(lead)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 p-6 text-white">
                <div className="inline-flex px-3 py-1 rounded bg-insightRed text-white text-xs font-bold mb-3">{categoryOf(lead)}</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{titleOf(lead)}</h2>
                <p className="text-white/80 line-clamp-2">{excerptOf(lead)}</p>
              </div>
            </div>
          </Link>
        )}

        <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {list.map((a,i)=> (
            <Link key={slugOf(a)+i} to={`${basePath}/${slugOf(a)}`} className="flex flex-col md:flex-row gap-5 p-5 hover:bg-gray-50 transition">
              <div className="md:w-60 flex-shrink-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-insightRed font-bold uppercase tracking-wide mb-1">{categoryOf(a)}</div>
                <h3 className="text-xl font-semibold text-insightBlack group-hover:text-insightRed mb-2">{titleOf(a)}</h3>
                <p className="text-gray-600 line-clamp-2 mb-2">{excerptOf(a)}</p>
                <div className="text-xs text-gray-500 flex items-center gap-2"><Calendar className="h-3 w-3"/>{dateOf(a)}</div>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-300 self-center group-hover:text-insightRed"/>
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 font-semibold uppercase tracking-wide text-sm text-insightBlack">Trending</div>
          <ul className="divide-y divide-gray-200">
            {trending.map((a,i)=> (
              <li key={slugOf(a)+i} className="p-4 hover:bg-white transition">
                <Link to={`${basePath}/${slugOf(a)}`} className="flex gap-3 group">
                  <img src={imgOf(a)} alt={titleOf(a)} className="w-16 h-16 rounded object-cover flex-shrink-0"/>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{categoryOf(a)}</div>
                    <h4 className="font-semibold group-hover:text-insightRed line-clamp-2">{titleOf(a)}</h4>
                    <div className="text-xs text-gray-500 mt-1">{dateOf(a)}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 p-6 bg-white text-center shadow-sm">
          <h3 className="text-xl font-bold mb-2">Weekly Brief</h3>
          <p className="text-gray-600 mb-4">Get the top stories in your inbox.</p>
          <Link to="/contact" className="inline-flex items-center px-4 py-2 rounded-md bg-insightRed text-white font-medium hover:bg-insightRed/90">Subscribe</Link>
        </div>
      </aside>
    </div>
  )
}

export default EditorialList;
