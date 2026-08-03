import { useState, useRef } from 'react';
import { Play, Pause, Clock, Download, Check, X, Volume2, VolumeX } from 'lucide-react';
import RankBadge from './RankBadge';

export default function ClipCard({ clip, onApprove, onReject, onDownload, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for autoplay policies, or false. Let's use false but allow toggle.
  const videoRef = useRef(null);

  const { id, score, reason, duration, title, status, public_url } = clip;
  const thumbnail = clip.thumbnail;

  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const cardClass = `
    relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 group
    ${isApproved
      ? 'border-success/50 bg-gradient-to-br from-success/10 to-card shadow-success-glow ring-1 ring-success/20'
      : isRejected
        ? 'border-border border-dashed bg-card/40 grayscale opacity-80 hover:opacity-100 hover:grayscale-0'
        : 'border-border/60 bg-gradient-to-b from-card to-card/80 hover:-translate-y-1 hover:border-accent/50 hover:shadow-card-hover'}
  `;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleProgressBarClick = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = clickedValue;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(clip);
    } else if (public_url) {
      const a = document.createElement('a');
      a.href = public_url;
      a.download = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4` : `clip_${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

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

      {/* Duration Badge */}
      <div className="absolute top-3 right-12 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 h-6 rounded-full transition-opacity duration-300">
        <Clock className="w-3 h-3" />
        {duration}
      </div>

      {/* Clip Number */}
      <div className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-white font-semibold">
        {index + 1}
      </div>

      {/* Thumbnail / Video — 9:16 aspect ratio phone screen */}
      <div
        className={`relative w-full overflow-hidden ${thumbnail || public_url ? 'bg-zinc-900' : 'bg-gradient-to-br from-accent/20 via-background to-black'} cursor-pointer`}
        style={{ aspectRatio: '9/16' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          if (videoRef.current) {
            e.stopPropagation();
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
        }}
      >
        {public_url ? (
          <video
            ref={videoRef}
            src={public_url}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered && !isPlaying ? 'scale-105' : 'scale-100'}`}
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            loading="lazy"
          />
        ) : null}

        {/* Dark overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

        {/* Play button */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none
          ${isHovered && !isPlaying ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Pause button */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none
          ${isHovered && isPlaying ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl">
            <Pause className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Caption bars (decorative — simulating burned-in captions) */}
        <div className={`absolute bottom-20 left-0 right-0 flex flex-col items-center gap-1 px-4 transition-opacity duration-300 ${isPlaying || isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded text-center leading-tight max-w-full">
            {title}
          </div>
        </div>

        {/* Controls Bar (Progress, Volume, Download) */}
        {public_url && (
          <div className={`absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${isHovered || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div 
              className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden relative"
              onClick={handleProgressBarClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center px-1">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-accent transition-colors p-1 bg-black/40 rounded-full backdrop-blur-sm"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleDownload}
                className="text-white hover:text-accent transition-colors p-1 bg-black/40 rounded-full backdrop-blur-sm flex items-center gap-1 px-2"
                title="Download Clip"
              >
                <Download className="w-3 h-3" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Save</span>
              </button>
            </div>
          </div>
        )}
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
            <button
              onClick={() => onReject(id)}
              className="btn-secondary flex-1 text-xs py-1.5 justify-center transition-colors hover:text-white"
              id={`undo-approve-${id}`}
            >
              <X className="w-3.5 h-3.5" />
              Undo
            </button>
          )}

          {isRejected && (
            <button
              onClick={() => onApprove(id)}
              className="btn-secondary flex-1 text-xs py-1.5 justify-center text-muted transition-colors hover:text-white"
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
