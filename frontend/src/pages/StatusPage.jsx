import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './StatusPage.css';

const STATUS_META = {
    operational: { label: 'Operational', icon: '🟢', className: 'operational' },
    degraded: { label: 'Degraded', icon: '🟡', className: 'degraded' },
    down: { label: 'Down', icon: '🔴', className: 'down' }
};

const overallStatusLabel = (status) => {
    switch (status) {
        case 'all_operational':
            return 'All Systems Operational';
        case 'partial_outage':
            return 'Partial Service Degradation';
        case 'major_outage':
            return 'Major Outage';
        default:
            return 'Unknown';
    }
};

const formatUptime = (seconds) => {
    if (seconds == null) return '—';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
};

const StatusPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await api.get('/status/health');
            setData(response.data);
            setError(null);
            setLastUpdated(new Date());
        } catch (err) {
            setError('Unable to reach the status service. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    return (
        <div className="status-page">
            <section className="page-header">
                <div className="container">
                    <h1>System Status</h1>
                    <p>Live uptime indicators for the AgroLink platform services</p>
                </div>
            </section>

            <div className="container py-xl">
                {loading && (
                    <div className="status-loading">
                        <div className="spinner"></div>
                        <p>Checking service health...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="status-error alert">
                        <p>{error}</p>
                        <button onClick={fetchStatus} className="btn btn-primary">Retry</button>
                    </div>
                )}

                {data && (
                    <>
                        <div className={`overall-banner ${data.status === 'all_operational' ? 'banner-ok' : data.status === 'partial_outage' ? 'banner-warn' : 'banner-down'}`}>
                            <div className="overall-icon">{data.status === 'all_operational' ? '🟢' : data.status === 'partial_outage' ? '🟡' : '🔴'}</div>
                            <div>
                                <h2>{overallStatusLabel(data.status)}</h2>
                                <p>Checked at {data.checkedAt ? new Date(data.checkedAt).toLocaleString() : '—'} · Uptime {formatUptime(data.uptime)} · Response {data.totalLatencyMs}ms</p>
                            </div>
                        </div>

                        <div className="service-grid">
                            {data.services && data.services.map((service) => {
                                const meta = STATUS_META[service.status] || { label: service.status, icon: '⚪', className: 'unknown' };
                                return (
                                    <div key={service.slug} className={`service-card ${meta.className}`}>
                                        <div className="service-header">
                                            <span className="service-icon">{meta.icon}</span>
                                            <span className="service-status">{meta.label}</span>
                                        </div>
                                        <h3>{service.name}</h3>
                                        <p className="service-description">{service.description}</p>
                                        <div className="service-meta">
                                            {service.latencyMs != null && <span>Latency: {service.latencyMs}ms</span>}
                                            {service.error && <span className="service-error">{service.error}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {lastUpdated && (
                            <p className="last-updated">Last checked: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 60 seconds</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StatusPage;
