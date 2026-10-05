import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import {
  Search,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Users,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared UI primitives (kept consistent with AddProductPanel style) */
/* ------------------------------------------------------------------ */
const Card = ({ title, icon: IconComp, right, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {IconComp && (
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7b3fe4]/10 text-[#7b3fe4]">
            <IconComp size={16} />
          </span>
        )}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </div>
);

const baseInputClasses =
  "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-colors";

const StatusBadge = ({ status }) => {
  const isActive = String(status).toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      {isActive ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
      {isActive ? "Active" : status || "Ended"}
    </span>
  );
};

const DeviceIcon = ({ device }) => {
  const d = String(device || "").toLowerCase();
  if (d.includes("mobile") || d.includes("phone")) return <Smartphone size={14} className="text-gray-400" />;
  if (d.includes("tablet") || d.includes("ipad")) return <Tablet size={14} className="text-gray-400" />;
  return <Monitor size={14} className="text-gray-400" />;
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const Avatar = ({ name }) => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7b3fe4]/10 text-[#7b3fe4] text-xs font-semibold shrink-0">
    {initials(name)}
  </span>
);

/* ------------------------------------------------------------------ */
/*  UserSessionsPage                                                  */
/* ------------------------------------------------------------------ */
export const UserSessionsPage = ({ setActive }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
        const res = await api.get("/admin/sessions");
        console.log("API Response:", res.data);
      setSessions(res.data?.sessions || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        String(item.status).toLowerCase() === statusFilter;

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.userId?.name?.toLowerCase().includes(q) ||
        item.userId?.email?.toLowerCase().includes(q) ||
        item.device?.toLowerCase().includes(q) ||
        item.browser?.toLowerCase().includes(q) ||
        item.os?.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [sessions, query, statusFilter]);

  const activeCount = sessions.filter(
    (s) => String(s.status).toLowerCase() === "active"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header + stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">User sessions</h1>
          <p className="text-sm text-gray-500">
            {sessions.length} total session{sessions.length === 1 ? "" : "s"} · {activeCount} active
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 self-start"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <Card
        title="All sessions"
        icon={Users}
        right={
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, device…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${baseInputClasses} pl-8 w-56`}
              />
            </div>
          </div>
        }
      >
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Browser</th>
                <th className="px-4 py-3">OS</th>
                <th className="px-4 py-3">Login time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    No sessions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.userId?.name} />
                        <div>
                          <p className="font-medium text-gray-800 leading-tight">{item.userId?.name}</p>
                          <p className="text-xs text-gray-400 leading-tight">{item.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <DeviceIcon device={item.device} />
                        {item.device || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{item.browser || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-600">{item.os || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {item.loginTime ? new Date(item.loginTime).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserSessionsPage;