import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, ExternalLink, Loader2, Unlink, Upload,
    RefreshCw, Send, Layers, Activity, Link2, Clock, AlertCircle,
    ChevronRight, CheckSquare, Square, Eye,
} from 'lucide-react';
import { FacebookIcon } from '../components/PlatformIcon';
import RankBadge from '../components/RankBadge';
import {
    disconnectFacebook,
    getFacebookConnectUrl,
    getFacebookStatus,
    listSocialUploads,
    listUploadJobs,
    publishClipToFacebook,
    bulkPublishToFacebook,
    getBatchUploadJobs,
    fetchPublishableClips,
    listFacebookPages,
} from '../api';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Link2 },
    { id: 'publish', label: 'Publish', icon: Send },
    { id: 'uploads', label: 'Published', icon: Upload },
    { id: 'jobs', label: 'Jobs', icon: Activity },
];

const PRIVACY_OPTIONS = [
    { value: 'private', label: 'Private' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'public', label: 'Public' },
];

function StatusPill({ status }) {
    const styles = {
        completed: { color: 'bg-success/15 text-success border-success/30', icon: CheckCircle2, label: 'Completed' },
        failed: { color: 'bg-danger/15 text-danger border-danger/30', icon: AlertCircle, label: 'Failed' },
        processing: { color: 'bg-accent/15 text-accent-light border-accent/30', icon: Loader2, label: 'Processing' },
        queued: { color: 'bg-zinc-700/30 text-muted border-border', icon: Clock, label: 'Queued' },
    };
    const cfg = styles[status] || styles.queued;
    const Icon = cfg.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg.color}`}>
            <span className="relative flex items-center justify-center">
                {status === 'processing' && (
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style={{ background: 'currentColor' }} />
                )}
                <Icon className={`w-3 h-3 relative ${status === 'processing' ? 'animate-spin' : ''}`} />
            </span>
            {cfg.label}
        </span>
    );
}

export default function ConnectFacebook() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');

    const [status, setStatus] = useState(null);
    const [uploads, setUploads] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [publishableClips, setPublishableClips] = useState([]);
    const [selectedClipIds, setSelectedClipIds] = useState(new Set());

    const [loading, setLoading] = useState(true);
    const [clipsLoading, setClipsLoading] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [publishDescription, setPublishDescription] = useState('');
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchLoading, setBatchLoading] = useState(false);

    const connected = status?.connected;
    const account = status?.account;

    const loadCoreData = useCallback(async () => {
        setError('');
        try {
            const [statusData, uploadsData, jobsData, pagesData] = await Promise.all([
                getFacebookStatus(),
                listSocialUploads().catch(() => ({ items: [] })),
                listUploadJobs().catch(() => ({ items: [] })),
                listFacebookPages().catch(() => ({ pages: [] })),

            ]);
            setStatus(statusData);
            setUploads(uploadsData.items ?? []);
            setJobs(jobsData.items ?? []);
            const loadedPages = pagesData.pages ?? [];
            setPages(loadedPages);
            if (loadedPages.length > 0 && !selectedPageId) setSelectedPageId(loadedPages[0].id);
            return statusData?.connected;
        } catch (err) {
            setError(err.message || 'Failed to load Facebook data');
            return false;
        }
    }, []);

    const loadPublishableClips = useCallback(async () => {
        setClipsLoading(true);
        try {
            const clips = await fetchPublishableClips('facebook');
            setPublishableClips(clips);
        } catch (err) {
            setError(err.message || 'Failed to load clips');
        } finally {
            setClipsLoading(false);
        }
    }, []);

    const loadAll = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        const isConn = await loadCoreData();
        if (isConn) {
            await loadPublishableClips();
        }

        setLoading(false);
        setRefreshing(false);
    }, [loadCoreData, loadPublishableClips]);

    useEffect(() => {
        const success = searchParams.get('success');
        const oauthError = searchParams.get('error');

        if (success === '1') {
            setMessage('Facebook account connected successfully!');
            setActiveTab('overview');
            setSearchParams({}, { replace: true });
        } else if (oauthError) {
            setError(decodeURIComponent(oauthError));
            setSearchParams({}, { replace: true });
        }

        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Poll jobs while pending
    useEffect(() => {
        const hasPending = jobs.some((j) => j.status === 'queued' || j.status === 'processing');
        if (activeTab !== 'jobs' || !hasPending) return;

        const interval = setInterval(() => {
            listUploadJobs().then((data) => setJobs(data.items ?? [])).catch(() => { });
        }, 5000);
        return () => clearInterval(interval);
    }, [activeTab, jobs]);

    const handleConnect = async () => {
        setConnecting(true);
        setError('');
        try {
            const { url } = await getFacebookConnectUrl();
            window.location.href = url;
        } catch (err) {
            setError(err.message || 'Failed to start Facebook connection');
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Disconnect your Facebook account?')) return;
        setDisconnecting(true);
        setError('');
        try {
            await disconnectFacebook();
            setMessage('Facebook account disconnected.');
            setPublishableClips([]);
            setSelectedClipIds(new Set());
            await loadCoreData();
        } catch (err) {
            setError(err.message || 'Failed to disconnect');
        } finally {
            setDisconnecting(false);
        }
    };

    const toggleClip = (id) => {
        setSelectedClipIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAllClips = () => {
        if (selectedClipIds.size === publishableClips.length) {
            setSelectedClipIds(new Set());
        } else {
            setSelectedClipIds(new Set(publishableClips.map((c) => c.id)));
        }
    };

    const handlePublishSingle = async (clip) => {
        if (!connected) {
            setError('Connect Facebook first');
            return;
        }
        setPublishing(true);
        setError('');
        setMessage('');
        try {
            const result = await publishClipToFacebook(clip.id, {
                title: clip.title,
                description: publishDescription || `Uploaded via ClipRank — ${clip.reason || ''}`.trim(),
                privacyStatus,
                pageId: selectedPageId,
            });
            setMessage(`Upload queued! Job ID: ${result.jobId}`);
            setActiveTab('jobs');
            await loadCoreData();
            await loadPublishableClips();
        } catch (err) {
            setError(err.message || 'Publish failed');
        } finally {
            setPublishing(false);
        }
    };

    const handleBulkPublish = async () => {
        if (!connected) {
            setError('Connect Facebook first');
            return;
        }
        const selected = publishableClips.filter((c) => selectedClipIds.has(c.id));
        if (selected.length === 0) {
            setError('Select at least one clip');
            return;
        }
        setPublishing(true);
        setError('');
        setMessage('');
        try {
            const result = await bulkPublishToFacebook(
                selected.map((clip) => ({
                    clipId: clip.id,
                    title: clip.title,
                    description: publishDescription || `Uploaded via ClipRank`,
                    privacyStatus,
                    pageId: selectedPageId,
                })),
            );
            setMessage(`Bulk upload queued! Batch ID: ${result.batchId} (${result.total} clips)`);
            setSelectedClipIds(new Set());
            setActiveTab('jobs');
            await loadCoreData();
            await loadPublishableClips();
        } catch (err) {
            setError(err.message || 'Bulk publish failed');
        } finally {
            setPublishing(false);
        }
    };

    const viewBatch = async (batchId) => {
        setBatchLoading(true);
        try {
            const data = await getBatchUploadJobs(batchId);
            setSelectedBatch(data);
        } catch (err) {
            setError(err.message || 'Failed to load batch');
        } finally {
            setBatchLoading(false);
        }
    };

    const pendingJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'processing').length;
    const completedJobs = jobs.filter((j) => j.status === 'completed').length;
    const failedJobs = jobs.filter((j) => j.status === 'failed').length;

    return (
        <div className="min-h-screen px-4 py-8 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1877F2 0%, #145CB3 100%)', boxShadow: '0 4px 20px rgba(24,119,242,0.25)' }}
                        >
                            <FacebookIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">Facebook Studio</h1>
                            <p className="text-muted text-sm mt-0.5">
                                Connect, publish clips, and track uploads
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => loadAll(true)}
                        disabled={refreshing}
                        className="btn-secondary text-sm self-start"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </motion.div>

                {/* Alerts */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            {message}
                            <button onClick={() => setMessage('')} className="ml-auto text-success/60 hover:text-success">×</button>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                            <button onClick={() => setError('')} className="ml-auto text-danger/60 hover:text-danger">×</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                    {[
                        { label: 'Status', value: connected ? 'Connected' : 'Not linked', color: connected ? 'text-success' : 'text-muted' },
                        { label: 'Published', value: uploads.length, color: 'text-primary' },
                        { label: 'Ready to publish', value: publishableClips.length, color: 'text-accent-light' },
                        { label: 'Pending jobs', value: pendingJobs, color: pendingJobs ? 'text-warning' : 'text-muted' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card px-4 py-3">
                            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-muted">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 glass-card overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === id
                                    ? 'bg-accent text-white shadow-[0_2px_10px_rgba(124,58,237,0.35)]'
                                    : 'text-muted hover:text-primary hover:bg-card/60'}
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            {id === 'jobs' && pendingJobs > 0 && (
                                <span className="w-5 h-5 rounded-full bg-warning text-[10px] font-bold flex items-center justify-center text-black">
                                    {pendingJobs}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-muted gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Loading…
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* ── Overview ── */}
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="glass-card p-6">
                                    {connected ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-success/15 border border-success/25 flex items-center justify-center">
                                                    <CheckCircle2 className="w-6 h-6 text-success" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-primary text-lg">{account?.platformUsername || 'Facebook Channel'}</p>
                                                    <p className="text-sm text-muted">Channel connected &amp; ready to publish</p>
                                                    {account?.connectedAt && (
                                                        <p className="text-xs text-muted mt-1">
                                                            Since {new Date(account.connectedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button onClick={handleDisconnect} disabled={disconnecting} className="btn-secondary text-sm">
                                                {disconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 space-y-4">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                                                <FacebookIcon className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-primary">Connect your Facebook channel</p>
                                                <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                                                    Grant ClipRank permission to upload clips to your channel. You'll be redirected to Google sign-in.
                                                </p>
                                            </div>
                                            <button onClick={handleConnect} disabled={connecting} className="btn-primary mx-auto">
                                                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FacebookIcon className="w-4 h-4" />}
                                                Connect Facebook
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {connected && (
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setActiveTab('publish')}
                                            className="glass-card p-5 text-left hover:border-accent/40 transition-all group"
                                        >
                                            <Send className="w-5 h-5 text-accent mb-2" />
                                            <p className="font-semibold text-primary">Publish Clips</p>
                                            <p className="text-xs text-muted mt-1">{publishableClips.length} clips ready</p>
                                            <ChevronRight className="w-4 h-4 text-muted mt-3 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('uploads')}
                                            className="glass-card p-5 text-left hover:border-accent/40 transition-all group"
                                        >
                                            <Upload className="w-5 h-5 text-accent mb-2" />
                                            <p className="font-semibold text-primary">View Published</p>
                                            <p className="text-xs text-muted mt-1">{uploads.length} videos on Facebook</p>
                                            <ChevronRight className="w-4 h-4 text-muted mt-3 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── Publish ── */}
                        {activeTab === 'publish' && (
                            <motion.div
                                key="publish"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {!connected ? (
                                    <div className="glass-card p-8 text-center text-muted">
                                        <Link2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
                                        <p>Connect Facebook first to publish clips.</p>
                                        <button onClick={() => setActiveTab('overview')} className="btn-primary mt-4 text-sm">
                                            Go to Overview
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Publish settings */}
                                        <div className="glass-card p-5 space-y-4">
                                            <h3 className="font-semibold text-primary flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-accent" />
                                                Upload Settings
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="flex flex-col">
                                                    <label className="block text-xs font-medium text-muted mb-1.5">
                                                        Privacy
                                                    </label>

                                                    <div className="relative">
                                                        <select
                                                            value={privacyStatus}
                                                            onChange={(e) => setPrivacyStatus(e.target.value)}
                                                            className="input-field w-full appearance-none pr-10"
                                                        >
                                                            {PRIVACY_OPTIONS.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="m6 9 6 6 6-6" />
                                                            </svg>
                                                        </span>
                                                    </div>

                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="block text-xs font-medium text-muted mb-1.5">
                                                        Facebook Page
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={selectedPageId}
                                                            onChange={(e) => setSelectedPageId(e.target.value)}
                                                            className="input-field w-full appearance-none pr-10"
                                                        >
                                                            {pages.map((p) => (
                                                                <option key={p.id} value={p.id}>
                                                                    {p.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="m6 9 6 6 6-6" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-muted mb-1.5">Description (optional)</label>
                                                    <input
                                                        type="text"
                                                        value={publishDescription}
                                                        onChange={(e) => setPublishDescription(e.target.value)}
                                                        placeholder="Uploaded via ClipRank"
                                                        className="input-field w-full"
                                                    />
                                                </div>
                                            </div>
                                            {selectedClipIds.size > 0 && (
                                                <button
                                                    onClick={handleBulkPublish}
                                                    disabled={publishing}
                                                    className="btn-primary w-full sm:w-auto justify-center"
                                                >
                                                    {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    Publish {selectedClipIds.size} selected to Facebook
                                                </button>
                                            )}
                                        </div>

                                        {/* Clips list */}
                                        <div className="glass-card overflow-hidden">
                                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                                <h3 className="font-semibold text-primary">
                                                    Ready to Publish
                                                    <span className="text-muted font-normal text-sm ml-2">({publishableClips.length})</span>
                                                </h3>
                                                {publishableClips.length > 0 && (
                                                    <button onClick={toggleAllClips} className="btn-ghost text-xs py-1">
                                                        {selectedClipIds.size === publishableClips.length ? (
                                                            <><CheckSquare className="w-3.5 h-3.5" /> Deselect all</>
                                                        ) : (
                                                            <><Square className="w-3.5 h-3.5" /> Select all</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {clipsLoading ? (
                                                <div className="flex items-center justify-center py-16 text-muted gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Loading clips…
                                                </div>
                                            ) : publishableClips.length === 0 ? (
                                                <div className="text-center py-16 text-muted">
                                                    <Upload className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                                    <p className="text-sm">No clips ready to publish.</p>
                                                    <p className="text-xs mt-1">Approve clips in Gallery first.</p>
                                                </div>
                                            ) : (
                                                <ul className="divide-y divide-border">
                                                    {publishableClips.map((clip) => (
                                                        <li key={clip.id} className="flex items-center gap-4 px-5 py-4 hover:bg-card/40 transition-colors">
                                                            <button
                                                                onClick={() => toggleClip(clip.id)}
                                                                className="flex-shrink-0 text-accent"
                                                            >
                                                                {selectedClipIds.has(clip.id)
                                                                    ? <CheckSquare className="w-5 h-5" />
                                                                    : <Square className="w-5 h-5 text-muted" />}
                                                            </button>

                                                            <div className="w-16 h-10 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0">
                                                                {clip.public_url && (
                                                                    <video src={clip.public_url} className="w-full h-full object-cover" muted />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-primary truncate">{clip.title}</p>
                                                                <p className="text-xs text-muted truncate">{clip.videoTitle} · {clip.duration}</p>
                                                            </div>

                                                            <RankBadge score={clip.score || 0} size="sm" />

                                                            <button
                                                                onClick={() => handlePublishSingle(clip)}
                                                                disabled={publishing}
                                                                className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
                                                            >
                                                                {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                                Publish
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {/* ── Uploads ── */}
                        {activeTab === 'uploads' && (
                            <motion.div
                                key="uploads"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {uploads.length === 0 ? (
                                    <div className="glass-card p-16 text-center text-muted">
                                        <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium text-primary">No published videos yet</p>
                                        <p className="text-sm mt-1">Publish a clip to see it here.</p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {uploads.map((item) => (
                                            <div key={item.id || item.platformVideoId} className="glass-card p-4 hover:border-accent/30 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                                                        <FacebookIcon className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-primary truncate">{item.title}</p>
                                                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '—'}
                                                        </p>
                                                        <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border text-muted capitalize">
                                                            {item.privacyStatus || 'private'}
                                                        </span>
                                                    </div>
                                                    {item.url && (
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── Jobs ── */}
                        {activeTab === 'jobs' && (
                            <motion.div
                                key="jobs"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-4 px-1 text-sm">
                                    <span className="text-success font-medium">{completedJobs} completed</span>
                                    <span className="text-warning font-medium">{pendingJobs} pending</span>
                                    <span className="text-danger font-medium">{failedJobs} failed</span>
                                    {pendingJobs > 0 && (
                                        <span className="text-xs text-muted flex items-center gap-1 ml-auto">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Auto-refreshing
                                        </span>
                                    )}
                                </div>

                                {jobs.length === 0 ? (
                                    <div className="glass-card p-16 text-center text-muted">
                                        <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No upload jobs yet.</p>
                                    </div>
                                ) : (
                                    <div className="glass-card overflow-hidden">
                                        <ul className="divide-y divide-border">
                                            {jobs.map((job) => (
                                                <li key={job.jobId} className="px-5 py-4 hover:bg-card/40 transition-colors group">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-primary truncate">{job.title}</p>
                                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                <span className="text-[10px] text-muted font-mono bg-card px-1.5 py-0.5 rounded border border-border">
                                                                    {job.jobId}
                                                                </span>
                                                                <span className="text-[11px] text-muted flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'Unknown date'}
                                                                </span>
                                                            </div>
                                                            {job.error && (
                                                                <p className="text-xs text-danger mt-2 bg-danger/10 border border-danger/20 p-2 rounded-lg line-clamp-2">
                                                                    {job.error}
                                                                </p>
                                                            )}
                                                            {job.result?.url && (
                                                                <a href={job.result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-light hover:underline mt-2 inline-flex items-center gap-1 font-medium">
                                                                    <FacebookIcon className="w-3.5 h-3.5" /> View on Facebook <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col sm:items-end gap-2 flex-shrink-0 mt-2 sm:mt-0">
                                                            <StatusPill status={job.status} />
                                                            {job.batchId && (
                                                                <button
                                                                    onClick={() => viewBatch(job.batchId)}
                                                                    className="text-[11px] text-accent hover:text-accent-light hover:underline flex items-center gap-1"
                                                                >
                                                                    <Eye className="w-3 h-3" /> View batch
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Progress bar for active jobs */}
                                                    {(job.status === 'processing' || job.status === 'queued') && (
                                                        <div className="mt-4 w-full h-1 bg-border rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-1000 ${job.status === 'processing' ? 'bg-accent animate-pulse w-2/3' : 'bg-zinc-500 w-1/4'}`} />
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Batch detail modal */}
                                <AnimatePresence>
                                    {selectedBatch && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                            onClick={() => setSelectedBatch(null)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.95, opacity: 0 }}
                                                className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <h3 className="font-bold text-primary mb-1">Batch Upload</h3>
                                                <p className="text-xs text-muted font-mono mb-4">{selectedBatch.batchId}</p>

                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                    {[
                                                        { label: 'Total', value: selectedBatch.total, color: 'text-primary' },
                                                        { label: 'Done', value: selectedBatch.completed, color: 'text-success' },
                                                        { label: 'Failed', value: selectedBatch.failed, color: 'text-danger' },
                                                    ].map((s) => (
                                                        <div key={s.label} className="text-center p-3 rounded-xl bg-card/50 border border-border">
                                                            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                                                            <div className="text-[10px] text-muted">{s.label}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {batchLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-muted mx-auto" />
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {(selectedBatch.jobs ?? []).map((job) => (
                                                            <li key={job.jobId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-card/50 border border-border">
                                                                <span className="text-sm truncate flex-1">{job.title}</span>
                                                                <StatusPill status={job.status} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                <button onClick={() => setSelectedBatch(null)} className="btn-secondary w-full mt-4 justify-center">
                                                    Close
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
