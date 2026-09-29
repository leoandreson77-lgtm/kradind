"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Tag,
  Smile,
  Shield,
  ShieldCheck,
  Compass,
  Headphones,
  Sliders,
  CheckCircle2,
  Phone,
  Mail,
  X,
  Eye,
  Plus,
  ArrowUpRight,
  Clock,
  Check,
} from "lucide-react";
import { AdminRole, CustomerRecord } from "@/lib/cms-store";

interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: AdminRole;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  taggedCustomerId?: string;
  taggedCustomerName?: string;
  isUrgent?: boolean;
  reactions?: Record<string, string[]>;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: "channel" | "direct";
  allowedRoles?: AdminRole[];
  icon: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  phone: string;
  online: boolean;
}

interface CustomerTagOption {
  id: string;
  name: string;
  phone: string;
  lifecycleStage: string;
}

export default function AdminTeamChatPage() {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [customerTags, setCustomerTags] = useState<CustomerTagOption[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: AdminRole } | null>(null);

  const [activeChannelId, setActiveChannelId] = useState<string>("general");
  const [activeDmUser, setActiveDmUser] = useState<TeamMember | null>(null);

  const [inputText, setInputText] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedCustomerTag, setSelectedCustomerTag] = useState<CustomerTagOption | null>(null);
  const [showCustomerTagPicker, setShowCustomerTagPicker] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Slide-over preview for tagged customer
  const [previewCustomerId, setPreviewCustomerId] = useState<string | null>(null);
  const [previewCustomerData, setPreviewCustomerData] = useState<CustomerRecord | null>(null);
  const [loadingCustomerPreview, setLoadingCustomerPreview] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat data
  const fetchChatData = async (channelId: string) => {
    try {
      const res = await fetch(`/api/admin/chat?channelId=${encodeURIComponent(channelId)}`);
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
        setMessages(data.messages || []);
        setTeamMembers(data.teamMembers || []);
        setCustomerTags(data.customerTags || []);
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
        }
      }
    } catch (err) {
      console.error("Failed to load chat data:", err);
      showToast("Error loading conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData(activeChannelId);
    const interval = setInterval(() => {
      fetchChatData(activeChannelId);
    }, 6000); // Polling every 6s for lively updates
    return () => clearInterval(interval);
  }, [activeChannelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Customer Preview if requested
  useEffect(() => {
    if (!previewCustomerId) {
      setPreviewCustomerData(null);
      return;
    }
    const loadCustomer = async () => {
      setLoadingCustomerPreview(true);
      try {
        const res = await fetch("/api/admin/crm/customers");
        if (res.ok) {
          const list: CustomerRecord[] = await res.json();
          const found = list.find((c) => c.id === previewCustomerId);
          setPreviewCustomerData(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCustomerPreview(false);
      }
    };
    loadCustomer();
  }, [previewCustomerId]);

  // Handlers
  const handleSelectChannel = (channel: ChatChannel) => {
    setActiveDmUser(null);
    setActiveChannelId(channel.id);
  };

  const handleSelectDm = (member: TeamMember) => {
    setActiveDmUser(member);
    // Format DM channel id reliably using sorted user emails or IDs
    const myId = currentUser?.name?.toLowerCase().replace(/\s+/g, "") || "admin";
    const theirId = member.name.toLowerCase().replace(/\s+/g, "");
    const sorted = [myId, theirId].sort();
    const dmChannelId = `dm_${sorted[0]}_${sorted[1]}`;
    setActiveChannelId(dmChannelId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: activeChannelId,
          content: inputText,
          taggedCustomerId: selectedCustomerTag?.id || undefined,
          taggedCustomerName: selectedCustomerTag?.name || undefined,
          isUrgent,
        }),
      });

      if (res.ok) {
        const savedMessage = await res.json();
        setMessages((prev) => [...prev, savedMessage]);
        setInputText("");
        setIsUrgent(false);
        setSelectedCustomerTag(null);
        scrollToBottom();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send message");
      }
    } catch {
      alert("Error transmitting message");
    } finally {
      setSending(false);
    }
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "react",
          messageId,
          emoji,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
      }
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  // Filtered customer options for tagging
  const filteredCustomerTags = useMemo(() => {
    if (!customerSearch) return customerTags.slice(0, 10);
    const q = customerSearch.toLowerCase();
    return customerTags.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.lifecycleStage.toLowerCase().includes(q)
    );
  }, [customerTags, customerSearch]);

  // Current Active Channel / DM Header info
  const activeChannel = useMemo(() => {
    return channels.find((c) => c.id === activeChannelId) || null;
  }, [channels, activeChannelId]);

  const getRoleBadgeClasses = (role?: AdminRole) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Operations Manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sales / CRM Agent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Expedition Leader":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getRoleIcon = (role?: AdminRole) => {
    switch (role) {
      case "Super Admin":
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      case "Operations Manager":
        return <Sliders className="w-3.5 h-3.5 text-blue-600" />;
      case "Sales / CRM Agent":
        return <Headphones className="w-3.5 h-3.5 text-emerald-600" />;
      case "Expedition Leader":
        return <Compass className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Users className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Multi-Role Internal Team Chat
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-500 text-xs font-medium">Cross-Functional Operational Collaboration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Team Comms & Role Channels
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant communication between Sales Agents, Ground Operations, Field Guides & Leadership with live Customer 360 tagging.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {currentUser && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">{currentUser.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeClasses(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          )}
          <button
            onClick={() => fetchChatData(activeChannelId)}
            title="Refresh Feed"
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Slack-style Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: CHANNELS & DIRECT MESSAGES (4 COLS) */}
        {/* ========================================================= */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/70">
          {/* Channels Section */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span>Operational Channels</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                {channels.length}
              </span>
            </div>

            <div className="space-y-1">
              {channels.map((ch) => {
                const isActive = activeChannelId === ch.id && !activeDmUser;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChannel(ch)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{ch.icon}</span>
                      <span className="truncate">#{ch.name}</span>
                    </div>

                    {ch.allowedRoles && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {ch.allowedRoles.length} roles
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span>Direct Messages</span>
              <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
            </div>

            <div className="space-y-1.5">
              {teamMembers.map((member) => {
                const isActive = activeDmUser?.id === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => handleSelectDm(member)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "hover:bg-white border border-transparent hover:border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-xs ${
                            isActive
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold truncate text-xs">{member.name}</div>
                        <div className={`text-[10px] truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                          {member.department}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold border truncate max-w-[85px] ${
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : getRoleBadgeClasses(member.role)
                      }`}
                    >
                      {member.role.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT AREA: ACTIVE CHANNEL MESSAGES & COMPOSER (8 COLS) */}
        {/* ========================================================= */}
        <div className="md:col-span-8 flex flex-col h-[640px] bg-white">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeDmUser ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {activeDmUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span>{activeDmUser.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getRoleBadgeClasses(activeDmUser.role)}`}>
                        {activeDmUser.role}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">{activeDmUser.department} • Direct 1-on-1 Comms</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xl">{activeChannel?.icon || "💬"}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span>#{activeChannel?.name || "all-team-ops"}</span>
                      {activeChannel?.allowedRoles && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {activeChannel.allowedRoles.join(" • ")}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{activeChannel?.description}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomerTagPicker(!showCustomerTagPicker)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  selectedCustomerTag
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedCustomerTag ? selectedCustomerTag.name : "+ Tag Customer"}</span>
              </button>
            </div>
          </div>

          {/* Tag Customer Floating Popover */}
          {showCustomerTagPicker && (
            <div className="p-3 bg-slate-50 border-b border-slate-200 shadow-sm animate-fade-in text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Attach Customer 360 Profile to Next Message</span>
                </span>
                <button
                  onClick={() => setShowCustomerTagPicker(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search customer by name, phone or status..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />

              <div className="max-h-36 overflow-y-auto space-y-1">
                {filteredCustomerTags.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomerTag(c);
                      setShowCustomerTagPicker(false);
                      showToast(`Customer ${c.name} attached to message`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800">
                      {c.name} ({c.phone})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {c.lifecycleStage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                Loading conversations...
              </div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">No messages in this channel yet.</p>
                <p className="text-[11px] text-slate-400">Start the conversation below with your teammates!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUser?.name === msg.senderName;
                return (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-xs shrink-0 ${
                        msg.senderRole === "Super Admin"
                          ? "bg-purple-700"
                          : msg.senderRole === "Operations Manager"
                          ? "bg-blue-600"
                          : msg.senderRole === "Sales / CRM Agent"
                          ? "bg-emerald-600"
                          : "bg-amber-600"
                      }`}
                    >
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Message Meta Info */}
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{msg.senderName}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${getRoleBadgeClasses(
                            msg.senderRole
                          )}`}
                        >
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {msg.isUrgent && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-extrabold border border-rose-200">
                            🚨 URGENT NOTICE
                          </span>
                        )}
                      </div>

                      {/* Content Bubble */}
                      <div
                        className={`p-3 rounded-2xl text-xs max-w-2xl border shadow-xs leading-relaxed ${
                          msg.isUrgent
                            ? "bg-rose-50/70 border-rose-200 text-slate-900"
                            : isMe
                            ? "bg-white border-slate-200 text-slate-900"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Tagged Customer Reference Card */}
                        {msg.taggedCustomerId && (
                          <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-700 font-bold truncate">
                              <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Customer Ref: {msg.taggedCustomerName || msg.taggedCustomerId}</span>
                            </div>
                            <button
                              onClick={() => setPreviewCustomerId(msg.taggedCustomerId || null)}
                              className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors flex items-center gap-1 shrink-0"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View 360</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reactions Bar */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {msg.reactions &&
                          Object.entries(msg.reactions).map(([emoji, usersList]) => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              title={usersList.join(", ")}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                                currentUser && usersList.includes(currentUser.name)
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <span>{emoji}</span>
                              <span>{usersList.length}</span>
                            </button>
                          ))}

                        {/* Quick React Picker */}
                        {["👍", "❤️", "🏔️", "🚀"].map((em) => (
                          <button
                            key={em}
                            onClick={() => handleToggleReaction(msg.id, em)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-xs transition-opacity"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Active Tagged Customer Indicator */}
          {selectedCustomerTag && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tagged Customer: {selectedCustomerTag.name} ({selectedCustomerTag.phone})</span>
              </span>
              <button
                onClick={() => setSelectedCustomerTag(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className={isUrgent ? "text-rose-600 font-bold" : ""}>Mark as Urgent / Field Alert 🚨</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeChannel?.name || "chat"} (as ${currentUser?.name || "Staff"} - ${
                  currentUser?.role || ""
                })...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CUSTOMER 360 PREVIEW DRAWER (OPENS FROM CHAT TAGS) */}
      {/* ========================================================= */}
      {previewCustomerId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-[#0F3A2E] to-[#0A261E] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Tagged Customer Dossier</h3>
                <p className="text-xs text-emerald-200">Customer 360 Quick Inspection</p>
              </div>
              <button
                onClick={() => setPreviewCustomerId(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {loadingCustomerPreview ? (
                <div className="py-20 text-center text-slate-400">Loading customer profile...</div>
              ) : !previewCustomerData ? (
                <div className="py-20 text-center text-slate-400">Customer not found.</div>
              ) : (
                <>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-extrabold text-slate-900 text-sm">{previewCustomerData.name}</div>
                    <div className="text-slate-500">
                      {previewCustomerData.phone} • {previewCustomerData.city}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {previewCustomerData.lifecycleStage}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {previewCustomerData.loyaltyTier}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total Lifetime Spend</div>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        ₹{previewCustomerData.totalSpent.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Trips Completed</div>
                      <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                        {previewCustomerData.totalTrips}
                      </div>
                    </div>
                  </div>

                  {previewCustomerData.medicalNotes && (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                      <div className="font-bold text-[11px] mb-1">Medical & Dietary Alert</div>
                      <p className="text-xs">{previewCustomerData.medicalNotes}</p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${previewCustomerData.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-xs"
                    >
                      WhatsApp Customer
                    </a>
                    <a
                      href={`tel:${previewCustomerData.phone}`}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-xs"
                    >
                      Call
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
