"use client";
import React, { useEffect, useState } from "react";
import { apiURL } from "@/src/constants";
import { Loader2, Shield, Check, X, Trash2, Download } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("stats"); // stats, users, moderation
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [statsRes, usersRes, badgesRes, flaggedRes] = await Promise.all([
        fetch(`${apiURL}/api/admin/stats`, { headers }),
        fetch(`${apiURL}/api/admin/users`, { headers }),
        fetch(`${apiURL}/api/badge/all`),
        fetch(`${apiURL}/api/admin/flagged-posts`, { headers })
      ]);
      
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const badgesData = await badgesRes.json();
      const flaggedData = await flaggedRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsers(usersData.users);
      if (badgesData.success) setBadges(badgesData.badges);
      if (flaggedData.success) setFlaggedPosts(flaggedData.posts);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAdminData();
  }, [user]);

  const handleToggleRole = async (userId) => {
    try {
        const res = await fetch(`${apiURL}/api/admin/user/role/${userId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            fetchAdminData();
        }
    } catch (error) {
        toast.error("Failed to update role");
    }
  };

  const handleIssueBadge = async (userId, badgeId) => {
    try {
        const res = await fetch(`${apiURL}/api/admin/badge/issue`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify({ userId, badgeId })
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Badge issued!");
        }
    } catch (error) {
        toast.error("Failed to issue badge");
    }
  };
  const handleModeratePost = async (postId, action) => {
    try {
        const res = await fetch(`${apiURL}/api/admin/post/moderate/${postId}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify({ action })
        });
        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            fetchAdminData();
        }
    } catch (error) {
        toast.error("Failed to moderate post");
    }
  };
  const handleExport = async (type) => {
    try {
        const res = await fetch(`${apiURL}/api/admin/export?type=${type}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success(`Exporting ${type}...`);
    } catch (error) {
        toast.error("Export failed");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500"/></div>;
  if (!stats) return <div className="p-10 text-white text-center">Admin Access Required</div>;

  return (
    <div className="h-full w-full p-8 overflow-y-auto bg-[#0a0a0f] text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex bg-[#131320] p-1 rounded-lg border border-[#1a1a2e]">
            {['stats', 'users', 'moderation'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {activeTab === "stats" && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={stats.userCount} color="blue" />
                <StatCard label="Total Posts" value={stats.postCount} color="purple" />
                <StatCard label="Total Courses" value={stats.courseCount} color="green" />
            </div>
            
            <div className="bg-[#131320] border border-[#1a1a2e] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Quick Insights & Exports</h2>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => handleExport('users')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-medium"
                    >
                        <Download size={16}/> Export Users CSV
                    </button>
                    <button 
                        onClick={() => handleExport('posts')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 border border-purple-600/20 rounded-lg hover:bg-purple-600 hover:text-white transition-all text-sm font-medium"
                    >
                        <Download size={16}/> Export Posts CSV
                    </button>
                </div>
                <p className="mt-4 text-gray-400 text-xs">System is running normally. All services active.</p>
            </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-[#131320] border border-[#1a1a2e] rounded-xl overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left text-sm">
                <thead className="bg-[#1a1a2e] text-gray-300">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a2e]">
                    {users.map(u => (
                        <tr key={u._id} className="hover:bg-[#1a1a2e]/30">
                            <td className="p-4 flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-800 overflow-hidden ring-1 ring-gray-700">
                                    {u.picture && <img src={u.picture} alt="" className="h-full w-full object-cover"/>}
                                </div>
                                <span className="font-medium">{u.userName}</span>
                            </td>
                            <td className="p-4 text-gray-400">{u.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <button 
                                    onClick={() => handleToggleRole(u._id)}
                                    className="text-xs text-blue-400 hover:underline"
                                >
                                    Toggle Role
                                </button>
                                <div className="mt-1">
                                    <select 
                                        onChange={(e) => e.target.value && handleIssueBadge(u._id, e.target.value)}
                                        className="bg-gray-800 border border-gray-700 text-[10px] rounded px-1 outline-none"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Issue Badge</option>
                                        {badges.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {activeTab === "moderation" && (
        <div className="space-y-6 animate-in fade-in duration-500">
            {flaggedPosts.length === 0 ? (
                <div className="text-center py-20 bg-[#131320] rounded-xl border border-dashed border-[#1a1a2e]">
                    <p className="text-gray-500">Moderation queue is empty. Content looks great!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {flaggedPosts.map(post => (
                        <div key={post._id} className="bg-[#131320] border border-[#1a1a2e] rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-red-500/30 transition-all">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">{post.head}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${post.moderationStatus === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                        {post.moderationStatus}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <span className="font-semibold text-gray-300">Author:</span>
                                        <span>{post.postedBy?.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                                        <Shield size={12}/>
                                        <span>AI Reason: {post.moderationReason || "Manual Flag"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                <button 
                                    onClick={() => handleModeratePost(post._id, 'approve')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all"
                                >
                                    <Check size={14}/> Approve
                                </button>
                                <button 
                                    onClick={() => handleModeratePost(post._id, 'reject')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg text-xs font-bold border border-red-500/30 transition-all"
                                >
                                    <X size={14}/> Reject
                                </button>
                                <button 
                                    onClick={() => handleModeratePost(post._id, 'delete')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-all"
                                >
                                    <Trash2 size={14}/> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue: "text-blue-500",
        purple: "text-purple-500",
        green: "text-green-500"
    };
    return (
        <div className="bg-[#131320] border border-[#1a1a2e] p-6 rounded-xl hover:shadow-xl transition-all hover:bg-[#1a1a2e]/50 cursor-default group">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</h3>
            <p className={`text-4xl font-bold mt-2 transition-all group-hover:scale-110 origin-left ${colors[color]}`}>{value}</p>
        </div>
    );
}
