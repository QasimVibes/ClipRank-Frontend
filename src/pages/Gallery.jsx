import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, X, ArrowUpDown, Grid3x3, List,
  ChevronDown, Scissors
} from 'lucide-react';
import ClipCard from '../components/ClipCard';
import RankBadge from '../components/RankBadge';
import { getVideoClips, approveClip, rejectClip, downloadClip } from '../api';


const SORT_OPTIONS = [
  { id: 'score-desc', label: 'Rank: High → Low' },
  { id: 'score-asc', label: 'Rank: Low → High' },
  { id: 'duration-asc', label: 'Duration: Short → Long' },
  { id: 'duration-desc', label: 'Duration: Long → Short' },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'pending', label: 'Pending' },
];

function parseDuration(d) {
  const parts = d.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}

export default function Gallery() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score-desc');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getVideoClips(jobId);
        const mapped = data.map(c => {
          const dur = Math.max(0, Math.round((c.end || 0) - (c.start || 0)));
          const mins = Math.floor(dur / 60);
          const secs = (dur % 60).toString().padStart(2, '0');
          return {
            id: c._id,
            score: c.score || 0,
            duration: `${mins}:${secs}`,
            title: c.title || `Clip starting at ${Math.round(c.start || 0)}s`,
            reason: c.reason || 'No reason provided.',
            status: c.status,
            public_url: c.public_url
          };
        });
        setClips(mapped);
      } catch (err) {
        console.error('Failed to load clips', err);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) load();
  }, [jobId]);

  const handleApprove = async (id) => {
    try {
      await approveClip(id);
      setClips((prev) => prev.map((c) => c.id === id ? { ...c, status: 'approved' } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectClip(id);
      setClips((prev) => prev.map((c) => c.id === id ? { ...c, status: 'rejected' } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectThumbnail = (id, thumbUrl) => {
    setClips((prev) => prev.map((c) => c.id === id ? { ...c, selected_thumbnail: thumbUrl } : c));
    // Best-effort: persist the choice server-side if the API supports it later.
  };

  const handleDownload = async (clip) => {
    if (clip && clip.public_url) {
      const a = document.createElement('a');
      a.href = clip.public_url;
      a.download = clip.title ? `${clip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4` : `clip_${clip.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const id = typeof clip === 'object' ? clip.id : clip;
      const filename = clip?.title
        ? `${clip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`
        : `clip_${id}.mp4`;
      try {
        await downloadClip(id, filename);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownloadAll = () => {
    console.log('Download all approved clips');
  };

  const sortedAndFiltered = useMemo(() => {
    let result = [...clips];

    if (filter !== 'all') {
      result = result.filter((c) => c.status === filter);
    }

    switch (sortBy) {
      case 'score-asc':
        result.sort((a, b) => a.score - b.score);
        break;
      case 'score-desc':
        result.sort((a, b) => b.score - a.score);
        break;
      case 'duration-asc':
        result.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
        break;
      case 'duration-desc':
        result.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
        break;
      default:
        break;
    }

    return result;
  }, [clips, sortBy, filter]);

  const approved = clips.filter((c) => c.status === 'approved');
  const rejected = clips.filter((c) => c.status === 'rejected');
  const pending = clips.filter((c) => c.status === 'pending');
  const avgScore = Math.round(clips.reduce((s, c) => s + c.score, 0) / clips.length);

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted font-medium">
                Job #{jobId && jobId !== 'demo' ? jobId.slice(-8) : 'unknown'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Clip Gallery</h1>
            <p className="text-muted text-sm mt-1">
              Review and approve the best AI-ranked moments from your video.
            </p>
          </div>

        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'Total Clips', value: clips.length, icon: '🎬' },
            { label: 'Approved', value: approved.length, icon: '✅', color: 'text-success' },
            { label: 'Rejected', value: rejected.length, icon: '❌', color: 'text-muted' },
            { label: 'Avg. Score', value: `${avgScore}/100`, icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-4 py-3 flex items-center gap-3">
              <span className="text-xl">{stat.icon}</span>
              <div>
                <div className={`text-lg font-bold ${stat.color || 'text-primary'}`}>{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map((opt) => {
              const count = opt.id === 'all' ? clips.length
                : opt.id === 'approved' ? approved.length
                  : opt.id === 'rejected' ? rejected.length
                    : pending.length;

              return (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  id={`filter-${opt.id}`}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                    ${filter === opt.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-muted border-border hover:border-accent/30 hover:text-primary'}
                  `}
                >
                  {opt.label}
                  <span className={`
                    w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${filter === opt.id ? 'bg-white/20' : 'bg-border'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="btn-secondary text-xs flex items-center gap-2"
                id="sort-dropdown-btn"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 glass-card py-1 z-20 shadow-xl"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setSortOpen(false); }}
                        id={`sort-${opt.id}`}
                        className={`
                          w-full text-left px-3 py-2 text-xs transition-colors
                          ${sortBy === opt.id ? 'text-accent bg-accent/10' : 'text-muted hover:text-primary hover:bg-card'}
                        `}
                      >
                        {sortBy === opt.id && <Check className="w-3 h-3 inline mr-2" />}
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                id="view-grid"
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-card text-primary' : 'text-muted hover:text-primary'}`}
              >
                <Grid3x3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                id="view-list"
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-card text-primary' : 'text-muted hover:text-primary'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Clips grid */}
        {sortedAndFiltered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted"
          >
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-sm">No clips match this filter.</p>
          </motion.div>
        ) : (
          <motion.div
            key="clips-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'flex flex-col gap-4'
            }
          >
            <AnimatePresence>
              {sortedAndFiltered.map((clip, index) => (
                <motion.div
                  key={clip.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  {viewMode === 'grid' ? (
                    <ClipCard
                      clip={clip}
                      index={index}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDownload={handleDownload}
                    />
                  ) : (
                    <ListClipRow
                      clip={clip}
                      index={index}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDownload={handleDownload}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// List view row variant
function ListClipRow({ clip, index, onApprove, onReject, onDownload }) {
  const { id, score, reason, duration, title, status } = clip;
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  return (
    <div className={`
      glass-card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 transition-all duration-200 w-full min-w-0
      ${isApproved ? 'border-success/40 success-glow' : ''}
      ${isRejected ? 'opacity-50' : 'hover:border-accent/30'}
    `}>
      {/* Row — top line: index + badge + title/reason + duration */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs text-muted w-5 text-center flex-shrink-0">#{index + 1}</span>
        <RankBadge score={score} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">{title}</p>
          <p className="text-xs text-muted truncate italic">"{reason}"</p>
        </div>
        <span className="text-xs text-muted flex-shrink-0 hidden sm:inline">{duration}</span>
      </div>

      {/* Actions — always on same line if space, wraps below on tiny screens */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        <span className="text-xs text-muted sm:hidden">{duration}</span>
        {!isApproved && !isRejected && (
          <>
            <button onClick={() => onApprove(id)} className="btn-success text-xs py-1 px-3" id={`list-approve-${id}`}>
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => onReject(id)} className="btn-danger text-xs py-1 px-3" id={`list-reject-${id}`}>
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </>
        )}
        {isApproved && (
          <button onClick={() => onReject(id)} className="btn-secondary text-xs py-1 px-3 hover:text-white" id={`list-undo-approve-${id}`}>
            <X className="w-3.5 h-3.5" /> Undo
          </button>
        )}
        {isRejected && (
          <button onClick={() => onApprove(id)} className="btn-ghost text-xs py-1 px-3" id={`list-restore-${id}`}>
            Restore
          </button>
        )}
      </div>
    </div>
  );
}
