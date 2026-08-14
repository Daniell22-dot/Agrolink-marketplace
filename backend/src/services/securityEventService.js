/**
 * SecurityEventService — In-memory threat event collector
 * 
 * Tracks security incidents (brute-force, rate-limit hits, webhook rejections, XSS)
 * with a pluggable interface for future PostgreSQL persistence.
 * 
 * Usage:
 *   const { securityEvents } = require('./securityEventService');
 *   securityEvents.record('brute_force', { ip: '1.2.3.4', email: 'user@test.com' });
 *   const metrics = securityEvents.getMetrics();
 */

const CATEGORIES = {
  BRUTE_FORCE: 'brute_force',
  RATE_LIMIT: 'rate_limit',
  WEBHOOK_REJECTION: 'webhook_rejection',
  XSS_INTERCEPTION: 'xss_interception',
  SECURITY_ACCESS: 'security_access',
};

const MAX_EVENTS = 10000;     // Cap in-memory events to prevent unbounded growth
const RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours

class SecurityEventCollector {
  constructor() {
    this.events = [];
    this.counters = {};
    Object.values(CATEGORIES).forEach(cat => {
      this.counters[cat] = 0;
    });
    
    // Prune stale events every 5 minutes
    this._pruneInterval = setInterval(() => this._prune(), 5 * 60 * 1000);
    if (this._pruneInterval.unref) this._pruneInterval.unref();
  }

  /**
   * Record a security event
   * @param {string} category - One of CATEGORIES values
   * @param {object} metadata - { ip, email, userAgent, payload, ... }
   */
  record(category, metadata = {}) {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      category,
      timestamp: new Date().toISOString(),
      epochMs: Date.now(),
      ip: metadata.ip || 'unknown',
      details: { ...metadata },
      severity: this._getSeverity(category),
    };

    this.events.push(event);
    this.counters[category] = (this.counters[category] || 0) + 1;

    // Enforce cap
    if (this.events.length > MAX_EVENTS) {
      this.events = this.events.slice(-MAX_EVENTS);
    }
  }

  /**
   * Get aggregate metrics for the last N hours
   * @param {number} hours - Lookback window (default 24)
   */
  getMetrics(hours = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recent = this.events.filter(e => e.epochMs >= cutoff);

    const byCategory = {};
    Object.values(CATEGORIES).forEach(cat => {
      byCategory[cat] = {
        count: recent.filter(e => e.category === cat).length,
        allTimeCount: this.counters[cat] || 0,
      };
    });

    // Unique IPs involved
    const uniqueIPs = [...new Set(recent.map(e => e.ip).filter(ip => ip !== 'unknown'))];

    return {
      windowHours: hours,
      totalEvents: recent.length,
      allTimeTotalEvents: this.events.length,
      categories: byCategory,
      uniqueThreatenedIPs: uniqueIPs.length,
      topIPs: this._getTopIPs(recent, 10),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get recent events (paginated)
   * @param {number} limit - Max events to return
   * @param {number} offset - Offset for pagination
   * @param {string} category - Optional filter by category
   */
  getRecentEvents(limit = 50, offset = 0, category = null) {
    let filtered = [...this.events].reverse(); // Newest first
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
    return {
      total: filtered.length,
      events: filtered.slice(offset, offset + limit),
    };
  }

  /**
   * Get time-series data bucketed by hour
   * @param {number} hours - Lookback window
   */
  getTimeSeries(hours = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recent = this.events.filter(e => e.epochMs >= cutoff);
    
    const buckets = {};
    for (let i = 0; i < hours; i++) {
      const bucketStart = new Date(Date.now() - ((hours - i) * 60 * 60 * 1000));
      const hourLabel = bucketStart.toISOString().slice(0, 13) + ':00';
      buckets[hourLabel] = {};
      Object.values(CATEGORIES).forEach(cat => {
        buckets[hourLabel][cat] = 0;
      });
    }

    recent.forEach(event => {
      const hourLabel = event.timestamp.slice(0, 13) + ':00';
      if (buckets[hourLabel]) {
        buckets[hourLabel][event.category] = (buckets[hourLabel][event.category] || 0) + 1;
      }
    });

    return Object.entries(buckets).map(([hour, cats]) => ({
      hour,
      ...cats,
      total: Object.values(cats).reduce((a, b) => a + b, 0),
    }));
  }

  /**
   * Get currently locked-out accounts (from events, best-effort)
   */
  getActiveLockouts() {
    const lockoutEvents = this.events
      .filter(e => e.category === CATEGORIES.BRUTE_FORCE && e.details.lockedUntil)
      .reverse();

    // De-dupe by email, keep most recent
    const seen = new Set();
    const active = [];
    const now = Date.now();

    for (const evt of lockoutEvents) {
      const email = evt.details.email;
      if (!email || seen.has(email)) continue;
      seen.add(email);

      const lockedUntil = new Date(evt.details.lockedUntil).getTime();
      if (lockedUntil > now) {
        active.push({
          email,
          ip: evt.ip,
          lockedUntil: evt.details.lockedUntil,
          lockedAt: evt.timestamp,
        });
      }
    }

    return active;
  }

  // --- Internal helpers ---

  _getSeverity(category) {
    const map = {
      [CATEGORIES.BRUTE_FORCE]: 'high',
      [CATEGORIES.RATE_LIMIT]: 'medium',
      [CATEGORIES.WEBHOOK_REJECTION]: 'high',
      [CATEGORIES.XSS_INTERCEPTION]: 'critical',
      [CATEGORIES.SECURITY_ACCESS]: 'high',
    };
    return map[category] || 'low';
  }

  _getTopIPs(events, limit) {
    const ipCounts = {};
    events.forEach(e => {
      if (e.ip && e.ip !== 'unknown') {
        ipCounts[e.ip] = (ipCounts[e.ip] || 0) + 1;
      }
    });
    return Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([ip, count]) => ({ ip, count }));
  }

  _prune() {
    const cutoff = Date.now() - RETENTION_MS;
    this.events = this.events.filter(e => e.epochMs >= cutoff);
  }
}

// Singleton instance
const securityEvents = new SecurityEventCollector();

module.exports = { securityEvents, CATEGORIES, SecurityEventCollector };
