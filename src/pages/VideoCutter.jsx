import { useState, useEffect, useRef } from 'react';
import { Play, Trash2, X, RefreshCcw, Loader2, Video, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchManualVideo, processManualClips } from '../api';

export default function VideoCutter() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('controls');

  // API & Error States
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [videoDetails, setVideoDetails] = useState(null);

  // Clips State
  const [clips, setClips] = useState([]);
  const [currentStart, setCurrentStart] = useState('00:00:00');
  const [currentEnd, setCurrentEnd] = useState('00:00:15');

  // Slider State (0 to 100 percentage)
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(100);

  // Video Player State
  const [previewTime, setPreviewTime] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('youtube.com') ||
      lowerUrl.includes('youtu.be') ||
      lowerUrl.includes('instagram.com') ||
      lowerUrl.includes('tiktok.com');
  };

  // Helper to convert seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  // Helper to sync slider with time inputs if duration is known
  useEffect(() => {
    if (videoDetails?.duration) {
      const startSecs = (sliderStart / 100) * videoDetails.duration;
      const endSecs = (sliderEnd / 100) * videoDetails.duration;
      setCurrentStart(formatTime(startSecs));
      setCurrentEnd(formatTime(endSecs));
    }
  }, [sliderStart, sliderEnd, videoDetails]);

  const handleLoad = async () => {
    setError('');
    if (!isValidUrl(videoUrl)) {
      setError('Please enter a valid YouTube, Instagram, or TikTok URL.');
      return;
    }

    setIsFetching(true);
    try {
      const data = await fetchManualVideo(videoUrl);
      setVideoDetails({ ...data, originalUrl: videoUrl });
      setIsLoaded(true);
      setClips([]);
      setSliderStart(0);
      setSliderEnd(100);
      if (data.duration) {
        setCurrentStart('00:00:00');
        setCurrentEnd(formatTime(data.duration));
      }
      setIsVideoLoading(true);
    } catch (err) {
      // If the backend fails, fallback to rendering the iframe anyway for YouTube as a demo
      if (getYouTubeId(videoUrl)) {
        setVideoDetails({ originalUrl: videoUrl, duration: 600 }); // Mock duration 10 mins
        setIsLoaded(true);
        setClips([]);
        setIsVideoLoading(true);
        setError('Warning: Backend connection failed, but loading preview.');
      } else {
        setError(err.message || 'Failed to fetch video details.');
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleChangeVideo = () => {
    setIsLoaded(false);
    setVideoDetails(null);
    setVideoUrl('');
    setClips([]);
    setError('');
  };

  const handleAddClip = () => {
    const newClip = {
      id: Date.now().toString(),
      start: currentStart,
      end: currentEnd
    };
    setClips([...clips, newClip]);
    setActiveTab('clips');
  };

  const handleRemoveClip = (id) => {
    setClips(clips.filter(c => c.id !== id));
  };

  const handleFinish = async () => {
    if (clips.length === 0) {
      setError('Please add at least one clip before finishing.');
      return;
    }
    setError('');
    setIsProcessing(true);
    try {
      // Convert HH:MM:SS strings to seconds (floats), then stringify for the backend
      const formattedClips = clips.map(clip => ({
        ...clip,
        start: parseTimeToSeconds(clip.start).toString(),
        end: parseTimeToSeconds(clip.end).toString()
      }));

      const result = await processManualClips(videoDetails?.originalUrl, videoDetails?.videoId, formattedClips);
      // The backend should return the videoId or job ID. 
      // If it returns result.videoId or result.id or result._id, use it.
      const redirectId = result.videoId || result.id || result._id || videoDetails?.videoId;
      if (redirectId) {
        navigate(`/gallery/${redirectId}`);
      } else {
        // Fallback if ID is missing
        navigate('/history');
      }
    } catch (err) {
      setError(err.message || 'Failed to process clips.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (e, isStart) => {
    const val = Number(e.target.value);
    if (isStart) {
      setSliderStart(Math.min(val, sliderEnd - 1));
    } else {
      setSliderEnd(Math.max(val, sliderStart + 1));
    }
  };

  const handlePreview = () => {
    const startSecs = parseTimeToSeconds(currentStart);
    setPreviewTime(startSecs);
    if (videoRef.current) {
      videoRef.current.currentTime = startSecs;
      videoRef.current.play();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Video Cutter</h1>
        <p className="text-muted text-sm">Enter a video link and create custom clips.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {!isLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 md:p-16 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl relative overflow-hidden group max-w-2xl mx-auto mt-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-accent/20 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            <Video className="w-10 h-10 text-accent relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 text-center">
            Start by adding a video
          </h2>
          <p className="text-muted text-sm md:text-base mb-8 text-center max-w-md">
            Paste a <span className="text-primary font-medium">YouTube</span>, <span className="text-primary font-medium">Instagram</span>, or <span className="text-primary font-medium">TikTok</span> link below to begin creating your perfect clips.
          </p>
          <div className="flex flex-col w-full gap-4 relative z-10">
            <div className="relative flex items-center w-full group/input">
              <div className="absolute left-4 text-muted group-focus-within/input:text-accent transition-colors">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background/50 border border-border hover:border-border/80 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none text-sm md:text-base transition-all shadow-inner"
                disabled={isFetching}
              />
            </div>
            <button
              onClick={handleLoad}
              disabled={isFetching || !videoUrl}
              className="w-full py-3.5 flex items-center justify-center bg-gradient-to-r from-accent to-purple-600 hover:from-accent hover:to-purple-500 disabled:opacity-50 disabled:from-accent disabled:to-accent text-white font-semibold rounded-2xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.5)] active:scale-[0.98] mt-2"
            >
              {isFetching ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading Video...</>
              ) : 'Load Video'}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Left Column: Video Player */}
          <div className="flex-1 w-full flex flex-col">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
              {isVideoLoading && videoDetails && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                  <p className="text-white text-sm font-medium">Loading Media...</p>
                </div>
              )}

              {getYouTubeId(videoDetails?.originalUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoDetails.originalUrl)}?start=${previewTime}&autoplay=${previewTime > 0 ? 1 : 0}`}
                  className="w-full h-full border-0 relative z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Player"
                  onLoad={() => setIsVideoLoading(false)}
                  onError={() => setIsVideoLoading(false)}
                />
              ) : videoDetails?.videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoDetails.videoUrl}
                  controls
                  className="w-full h-full object-contain relative z-10"
                  poster={videoDetails?.thumbnail}
                  onLoadedData={(e) => {
                    setIsVideoLoading(false);
                    // If backend didn't provide duration, grab it from the video element
                    if (!videoDetails.duration && e.target.duration && !isNaN(e.target.duration)) {
                      setVideoDetails(prev => ({ ...prev, duration: e.target.duration }));
                    }
                  }}
                  onError={() => setIsVideoLoading(false)}
                />
              ) : (
                <>
                  <img
                    src={videoDetails?.thumbnail || "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=2070&auto=format&fit=crop"}
                    alt="Video Poster"
                    className="w-full h-full object-cover opacity-90 relative z-10"
                    onLoad={() => setIsVideoLoading(false)}
                    onError={() => setIsVideoLoading(false)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <p className="text-white text-sm font-medium">Video loaded. Use controls to clip.</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleChangeVideo}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-accent/50 text-muted hover:text-primary text-sm font-medium rounded-xl transition-all shadow-sm group"
              >
                <RefreshCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                Change Video
              </button>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="w-full lg:w-[450px] flex flex-col">

            {/* Tabs */}
            <div className="flex items-center border-b border-border mb-6 pb-2">
              <div className="flex bg-card p-1 rounded-xl border border-border w-full">
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'controls' ? 'bg-blue-500 text-white shadow-md' : 'text-muted hover:text-primary'
                    }`}
                >
                  Controls
                </button>
                <button
                  onClick={() => setActiveTab('clips')}
                  className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'clips' ? 'bg-blue-500 text-white shadow-md' : 'text-muted hover:text-primary'
                    }`}
                >
                  Clips
                  {clips.length > 0 && (
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {clips.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'controls' && (
              <div className="flex flex-col gap-6">

                {/* Time Inputs */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted ml-1">Start Time</label>
                    <div className="bg-card border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent rounded-xl px-4 py-3 flex items-center justify-center transition-all">
                      <input
                        type="text"
                        value={currentStart}
                        onChange={(e) => setCurrentStart(e.target.value)}
                        className="bg-transparent border-none outline-none text-center text-sm font-medium text-primary w-full tracking-wider"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted ml-1">End Time</label>
                    <div className="bg-card border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent rounded-xl px-4 py-3 flex items-center justify-center transition-all">
                      <input
                        type="text"
                        value={currentEnd}
                        onChange={(e) => setCurrentEnd(e.target.value)}
                        className="bg-transparent border-none outline-none text-center text-sm font-medium text-primary w-full tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Functional Range Slider */}
                <div className="py-6 relative">
                  <div className="text-xs font-medium text-muted mb-6 flex justify-between">
                    <span>{currentStart}</span>
                    <span>{currentEnd}</span>
                  </div>

                  <div className="relative w-full h-1.5 bg-blue-100 dark:bg-blue-950 rounded-full">
                    {/* Active Track */}
                    <div
                      className="absolute h-full bg-blue-500 rounded-full"
                      style={{ left: `${sliderStart}%`, width: `${sliderEnd - sliderStart}%` }}
                    />

                    <input
                      type="range"
                      min="0" max="100"
                      value={sliderStart}
                      onChange={(e) => handleSliderChange(e, true)}
                      className="absolute -top-2 w-full h-5 appearance-none bg-transparent pointer-events-none z-10 custom-slider-thumb"
                    />

                    <input
                      type="range"
                      min="0" max="100"
                      value={sliderEnd}
                      onChange={(e) => handleSliderChange(e, false)}
                      className="absolute -top-2 w-full h-5 appearance-none bg-transparent pointer-events-none z-20 custom-slider-thumb"
                    />
                  </div>
                </div>

                {/* CSS to make standard range inputs behave correctly */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .custom-slider-thumb::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: ew-resize;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
                    transition: box-shadow 0.2s;
                  }
                  .custom-slider-thumb::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3);
                  }
                `}} />

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePreview}
                    className="flex-1 py-3 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-medium text-sm transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={handleAddClip}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    Add Clip
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'clips' && (
              <div className="flex flex-col gap-4">
                {clips.length === 0 ? (
                  <div className="text-center p-8 bg-card border border-border border-dashed rounded-xl">
                    <p className="text-muted text-sm">No clips added yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {clips.map((clip, index) => (
                      <div key={clip.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-accent transition-colors group">
                        <div className="w-20 h-12 bg-black rounded-lg overflow-hidden relative flex-shrink-0">
                          <img
                            src={videoDetails?.thumbnail || "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=2070&auto=format&fit=crop"}
                            className="w-full h-full object-cover opacity-80"
                            alt="thumbnail"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" fill="currentColor" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-primary truncate">Clip {index + 1}</h4>
                          <p className="text-xs text-muted truncate">{clip.start} - {clip.end}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveClip(clip.id)}
                          className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => setActiveTab('controls')}
                    className="flex-1 px-6 py-2.5 bg-card border border-border hover:border-accent/50 hover:bg-accent/5 text-primary text-sm font-medium rounded-xl transition-all"
                  >
                    + Add Another
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={isProcessing || clips.length === 0}
                    className="flex-1 px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:hover:bg-accent text-white text-sm font-medium rounded-xl transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)] active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finish'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
