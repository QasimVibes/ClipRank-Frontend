import { useState } from 'react';
import { Play, Clock, Download, Check, X, Share2 } from 'lucide-react';
import RankBadge from './RankBadge';

const MOCK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
  'https://images.unsplash.com/photo-1536240478700-b869ad10a2a0?w=400&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
];

export default function ClipCard({ clip, onApprove, onReject, onDownload, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const { id, score, reason, duration, title, status } = clip;
  const thumbnail = MOCK_THUMBNAILS[index % MOCK_THUMBNAILS.length];

  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const cardClass = `
    relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300
    ${isApproved
      ? 'border-success/50 shadow-success-glow bg-card'
      : isRejected
        ? 'border-border/50 bg-card/60 opacity-60'
        : 'border-border bg-card hover:border-accent/40 hover:shadow-card-hover'}
  `;

  return (
    <div
      className={cardClass}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Approved Badge */}
      {isApproved && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-success text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          <Check className="w-3 h-3" />
          Approved
        </div>
      )}

      {/* Rejected Badge */}
      {isRejected && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-zinc-700 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          <X className="w-3 h-3" />
          Rejected
        </div>
      )}

      {/* Clip Number */}
      <div className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-white font-semibold">
        {index + 1}
      </div>

      {/* Thumbnail — 9:16 aspect ratio phone screen */}
      <div
        className="relative w-full overflow-hidden bg-zinc-900 cursor-pointer"
        style={{ aspectRatio: '9/16' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          loading="lazy"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play button */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3" />
          {duration}
        </div>

        {/* Caption bars (decorative — simulating burned-in captions) */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-1 px-4">
          <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded text-center leading-tight max-w-full">
            {title}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 flex flex-col gap-3">
        {/* Score row */}
        <div className="flex items-center justify-between">
          <RankBadge score={score} size="md" />
          <span className="text-xs text-muted">AI Score</span>
        </div>

        {/* AI reason */}
        <p className="text-xs text-muted leading-relaxed italic line-clamp-2">
          "{reason}"
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {!isApproved && !isRejected && (
            <>
              <button
                onClick={() => onApprove(id)}
                className="btn-success flex-1 text-xs py-1.5 justify-center"
                id={`approve-clip-${id}`}
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => onReject(id)}
                className="btn-danger flex-1 text-xs py-1.5 justify-center"
                id={`reject-clip-${id}`}
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </>
          )}

          {isApproved && (
            <>
              <button
                onClick={() => onDownload(id)}
                className="btn-primary flex-1 text-xs py-1.5 justify-center"
                id={`download-clip-${id}`}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                className="btn-secondary text-xs py-1.5 px-3"
                id={`share-clip-${id}`}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isRejected && (
            <button
              onClick={() => onApprove(id)}
              className="btn-secondary flex-1 text-xs py-1.5 justify-center text-muted"
              id={`restore-clip-${id}`}
            >
              <Check className="w-3.5 h-3.5" />
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
