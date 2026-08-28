"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, RefreshCw, AlertTriangle, X, Clock, User, AtSign } from "lucide-react";
import { getMessagesApi, deleteMessageApi } from "@/lib/api";
import { Message } from "@/types";
import { toast } from "sonner";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessagesApi();
      setMessages(data);
    } catch (e) {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting message...");
    const ok = await deleteMessageApi(id);
    if (ok) {
      toast.success("Message deleted.", { id: toastId });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } else {
      toast.error("Failed to delete message.", { id: toastId });
    }
    setDeletingId(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
            <Mail className="w-4 h-4" />
            <span>COMMUNICATION</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
            Messages Inbox
          </h1>
          <p className="text-xs text-[#A1A1A1] mt-1 font-mono">
            {messages.length} total submission{messages.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] self-start"
          title="Refresh messages"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Two-column layout: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Message List */}
        <div className="lg:col-span-5 space-y-2">
          {loading ? (
            <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2 rounded-xl bg-[#121212] border border-[#222222] font-mono text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#7CFF6B]" />
              <span>Loading inbox...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-[#666] rounded-xl bg-[#121212] border border-[#222222] font-sans text-sm">
              No messages yet.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                onClick={() => setSelectedMessage(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?._id === m._id
                    ? "bg-[#141414] border-[#7CFF6B]/50"
                    : "bg-[#121212] border-[#222222] hover:border-[#7CFF6B]/30 hover:bg-[#141414]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#F5F5F0]">{m.fullName}</span>
                    </div>
                    <div className="text-xs font-mono text-[#7CFF6B] truncate">{m.subject}</div>
                    <p className="text-xs text-[#888] font-sans line-clamp-1">{m.message}</p>
                    <div className="text-[11px] font-mono text-[#555]">{m.email}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(m._id);
                    }}
                    className="p-1.5 rounded text-[#666] hover:text-[#FF5F56] transition-colors shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-xl bg-[#121212] border border-[#222222] overflow-hidden">
              
              {/* Detail Header */}
              <div className="p-6 border-b border-[#1E1E1E] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">{selectedMessage.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#888]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      {selectedMessage.fullName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AtSign className="w-3 h-3" />
                      {selectedMessage.email}
                    </span>
                    {selectedMessage.createdAt && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(selectedMessage.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeletingId(selectedMessage._id)}
                    className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#FF5F56] hover:border-[#FF5F56]/40 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#F5F5F0]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6">
                <div className="text-xs font-mono text-[#666] uppercase tracking-widest mb-3">Message</div>
                <div className="text-sm text-[#D0D0C8] leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-xl bg-[#121212] border border-[#222222] flex items-center justify-center font-mono text-xs text-[#555]">
              <div className="text-center space-y-2">
                <Mail className="w-10 h-10 mx-auto text-[#333]" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#262626] rounded-xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex items-center gap-3 text-[#FF5F56]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">Confirm Delete</h3>
            </div>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Are you sure you want to permanently delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded bg-[#FF5F56] text-black font-semibold hover:bg-[#e0524a]"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
