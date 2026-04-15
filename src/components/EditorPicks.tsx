import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

function fmtDate(d?: any) {
  try { const dt = d ? new Date(d) : null; return dt ? dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""; } catch { return ""; }
}

const EditorPicks: React.FC<{ picks?: any[] }> = ({ picks = [] }) => {
  const big = picks[0] || null;
  const small = picks.slice(1, 3);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-insightBlack">Editor's Picks</h2>
          <Link to="/articles" className="text-sm font-semibold text-insightRed hover:text-insightBlack">View all</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {big ? (
            <Link
              to={`/article/${big.slug || ""}`}
              className="relative group lg:col-span-2 block rounded-lg overflow-hidden shadow-lg bg-gray-100"
            >
              <div className="w-full h-96 bg-gray-100 overflow-hidden">
                <img src={big.image_url || big.image || '/placeholder.svg'} alt={big.title || ''} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-6 bottom-6 text-white">
                <div className="text-xs uppercase tracking-wider text-insightRed font-bold">{big.category || ''}</div>
                <h3 className="font-semibold text-2xl md:text-3xl leading-tight">{big.title || ''}</h3>
                <div className="mt-2 text-sm text-white/90 flex items-center gap-2"><Calendar className="w-4 h-4"/>{fmtDate(big.date)}</div>
              </div>
            </Link>
          ) : (
            <div className="lg:col-span-2" />
          )}

          <div className="flex flex-col gap-6">
            {small.map((a, i) => (
              <Link key={a?.slug || i} to={`/article/${a?.slug || ''}`} className="group flex gap-4 items-center rounded-lg p-4 bg-white border border-gray-100 hover:shadow-lg transition">
                <div className="w-28 h-20 bg-gray-100 overflow-hidden rounded">
                  <img src={a?.image_url || a?.image || '/placeholder.svg'} alt={a?.title || ''} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-insightRed font-semibold uppercase mb-1">{a?.category || ''}</div>
                  <h4 className="font-semibold line-clamp-2 group-hover:text-insightRed">{a?.title || ''}</h4>
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-2"><Calendar className="w-3 h-3"/>{fmtDate(a?.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorPicks;
