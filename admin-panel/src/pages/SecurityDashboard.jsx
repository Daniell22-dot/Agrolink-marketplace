import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  fetchSecurityMetrics,
  fetchSecurityStatus,
  fetchSecurityInvites,
  createSecurityInvite,
  revokeSecurityInvite
} from '../redux/slices/securitySlice';

const CATEGORY_META = {
  brute_force: { label: 'Brute-Force Attacks', color: '#ef4444', icon: '🔑' },
  rate_limit: { label: 'Traffic Spikes / Rate Limit', color: '#f59e0b', icon: '📈' },
  webhook_rejection: { label: 'Webhook Spoofing', color: '#8b5cf6', icon: '🔗' },
  xss_interception: { label: 'XSS / Malicious Payload', color: '#3b82f6', icon: '🧪' },
  security_access: { label: 'Security Access Grants', color: '#10b981', icon: '🛡️' }
};

const SEVERITY_STYLE = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600'
};

const formatTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
};

const SecurityDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.adminAuth);
  const { metrics, status, invites, isLoading, invitesLoading } = useSelector(state => state.security);

  const [email, setEmail] = useState('');
  const [expiresInHours, setExpiresInHours] = useState(24);

  useEffect(() => {
    dispatch(fetchSecurityStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status?.hasSecurityAccess) {
      dispatch(fetchSecurityMetrics());
      if (user?.role === 'super_admin') {
        dispatch(fetchSecurityInvites());
      }
    }
  }, [dispatch, status?.hasSecurityAccess, user?.role]);

  if (!status?.hasSecurityAccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Restricted Area</h1>
        <p className="text-gray-600 mb-6">
          The Security & Threat Dashboard is restricted to <strong>SUPER_ADMIN</strong> or
          users explicitly granted the <strong>SECURITY_AUDITOR</strong> role by the platform owner.
        </p>
        <p className="text-sm text-gray-500">
          Your current role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>
    );
  }

  if (!status?.twoFaEnabled) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <div className="text-5xl mb-4">🛡️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication Required</h1>
        <p className="text-gray-600 mb-4">
          Access to the security dashboard requires mandatory 2FA (TOTP). Please enable
          two-factor authentication on your account first.
        </p>
        <span className="inline-flex items-center px-4 py-2 bg-agrolink-green text-white rounded-lg font-semibold">
          2FA not enabled
        </span>
      </div>
    );
  }

  const categoryCounts = metrics?.metrics?.categories || {};
  const timeSeries = metrics?.timeSeries || [];

  return (
    <div className="security-dashboard">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Security & Threat Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time threat incident metrics · Last updated {formatTime(metrics?.metrics?.lastUpdated)}
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchSecurityMetrics())}
          className="px-4 py-2 bg-agrolink-green text-white rounded-lg hover:bg-agrolink-darkGreen transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrolink-green"></div>
        </div>
      ) : (
        <>
          {/* Threat category summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(categoryCounts).map(([key, value]) => {
              const meta = CATEGORY_META[key] || { label: key, color: '#6b7280', icon: '⚠️' };
              return (
                <div key={key} className="bg-white rounded-lg shadow-md p-5 border-t-4" style={{ borderTopColor: meta.color }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <span className="text-sm font-semibold text-gray-500">{value.count || 0} recent</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{meta.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">All-time: {value.allTimeCount || 0}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Time series chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Threat Activity Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={meta.color} strokeWidth={2} dot={false} name={meta.label} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top threatened IPs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Threat Sources</h3>
              {metrics?.metrics?.topIPs?.length ? (
                <ul className="space-y-3">
                  {metrics.metrics.topIPs.map((entry, i) => (
                    <li key={entry.ip} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-400">#{i + 1}</span>
                        <span className="font-mono text-sm text-gray-800">{entry.ip}</span>
                      </div>
                      <span className="text-sm font-semibold text-agrolink-orange">{entry.count} events</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No threats detected in the last 24 hours.</p>
              )}

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Unique threatened IPs:</span>{' '}
                  {metrics?.metrics?.uniqueThreatenedIPs || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Total events:</span>{' '}
                  {metrics?.metrics?.totalEvents || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Active lockouts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Currently Locked Accounts</h3>
              {metrics?.activeLockouts?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Account</th>
                        <th className="py-2 pr-4">IP</th>
                        <th className="py-2">Locked Until</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.activeLockouts.map((l, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 text-gray-800">{l.email}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-gray-600">{l.ip}</td>
                          <td className="py-2 text-red-600 text-xs">{formatTime(l.lockedUntil)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No accounts currently locked.</p>
              )}
            </div>

            {/* Super Admin: Invite management */}
            {user?.role === 'super_admin' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Grant Security Auditor Access</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(createSecurityInvite({ email: email.trim() || undefined, expiresInHours }));
                    setEmail('');
                    setExpiresInHours(24);
                  }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="team@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrolink-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expires in (hours)</label>
                    <input
                      type="number"
                      min="1"
                      value={expiresInHours}
                      onChange={(e) => setExpiresInHours(parseInt(e.target.value) || 24)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrolink-green"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-agrolink-green text-white rounded-lg hover:bg-agrolink-darkGreen transition-colors font-semibold"
                  >
                    Generate Invite Token
                  </button>
                </form>

                <h4 className="font-semibold text-gray-800 mb-3">Active Invitations</h4>
                {invitesLoading ? (
                  <p className="text-gray-500 text-sm">Loading...</p>
                ) : invites?.length ? (
                  <ul className="space-y-2">
                    {invites.map((inv) => (
                      <li key={inv.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{inv.email || 'Anyone with token'}</p>
                          <p className="text-xs text-gray-500">
                            {inv.status} · expires {formatTime(inv.expiresAt)}
                          </p>
                        </div>
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => dispatch(revokeSecurityInvite(inv.id))}
                            className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            Revoke
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No invitations yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Recent security events */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Security Events</h3>
            {metrics?.recentEvents?.events?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Severity</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Source IP</th>
                      <th className="py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentEvents.events.map((evt) => (
                      <tr key={evt.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 text-gray-600 whitespace-nowrap text-xs">{formatTime(evt.timestamp)}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_STYLE[evt.severity] || SEVERITY_STYLE.low}`}>
                            {evt.severity}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-800">{(CATEGORY_META[evt.category] || {}).label || evt.category}</td>
                        <td className="py-2 pr-4 font-mono text-xs text-gray-600">{evt.ip}</td>
                        <td className="py-2 text-xs text-gray-600 truncate max-w-xs">
                          {JSON.stringify(evt.details).slice(0, 120)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No security events recorded yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityDashboard;
