import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { NEWS_POSTS } from "../data/mockData";

//  Runtime state 
let newsList = [...NEWS_POSTS];
let nextId = Math.max(...NEWS_POSTS.map((n) => n.id)) + 1;

const CATEGORIES = ["Announcement", "Policy", "Event", "Achievement", "Reminder"];

const categoryStyle = {
  Announcement: "text-amber-400   bg-amber-400/10   border-amber-400/20",
  Policy:       "text-cyan-400    bg-cyan-400/10    border-cyan-400/20",
  Event:        "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Achievement:  "text-purple-400  bg-purple-400/10  border-purple-400/20",
  Reminder:     "text-red-400     bg-red-400/10     border-red-400/20",
};

//  Modal 
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 w-full max-w-lg fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

//  News Form 
function NewsForm({ initial, onSave, onCancel, authorName }) {
  const [form, setForm] = useState({
    title:    initial?.title    ?? "",
    category: initial?.category ?? "Announcement",
    content:  initial?.content  ?? "",
  });
  const [error, setError] = useState("");

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim())   return setError("Title is required.");
    if (!form.content.trim()) return setError("Content is required.");
    onSave({ ...form, publishedBy: authorName, publishedAt: new Date().toISOString().slice(0, 10) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Title</label>
        <input className={inputCls} value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Post title..." />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Category</label>
        <select className={inputCls} value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Content</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={5}
          value={form.content}
          onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
          placeholder="Write your announcement..."
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">
          {initial ? "Save Changes" : "Publish"} →
        </button>
      </div>
    </form>
  );
}

//  News Card 
function NewsCard({ post, isAdmin, onEdit, onDelete, delay }) {
  const [expanded, setExpanded] = useState(false);
  const catStyle = categoryStyle[post.category] ?? "text-zinc-400 bg-zinc-700/30 border-zinc-700";

  return (
    <div className="fade-up bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors" style={{ animationDelay: `${delay}s` }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 border ${catStyle}`}>{post.category}</span>
            <span className="text-zinc-600 text-xs">{post.publishedAt}</span>
          </div>
          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={onEdit}   className="px-3 py-1 text-xs border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">Edit</button>
              <button onClick={onDelete} className="px-3 py-1 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          )}
        </div>

        <h3 className="font-display font-bold text-white text-lg mb-2 leading-snug">{post.title}</h3>
        <p className={`text-zinc-400 text-sm leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>{post.content}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-zinc-600 text-xs">By {post.publishedBy}</span>
          <button onClick={() => setExpanded(e => !e)} className="text-amber-400 text-xs hover:text-amber-300 transition-colors font-medium">
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        </div>
      </div>
    </div>
  );
}

//  News Page 
export default function News() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [list, setList]       = useState(newsList);
  const [modal, setModal]     = useState(null);
  const [catFilter, setCatFilter] = useState("all");

  const refresh = () => setList([...newsList]);

  const filtered = list.filter((p) => catFilter === "all" || p.category === catFilter);

  const handleAdd = (data) => {
    newsList = [{ id: nextId++, ...data }, ...newsList];
    refresh(); setModal(null);
  };

  const handleEdit = (data) => {
    newsList = newsList.map((p) => p.id === modal.post.id ? { ...p, ...data } : p);
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    newsList = newsList.filter((p) => p.id !== modal.post.id);
    refresh(); setModal(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
            {isAdmin ? "Management" : "Company"}
          </p>
          <h1 className="font-display text-2xl font-bold text-white">
            {isAdmin ? "News & Announcements" : "News Feed"}
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ type: "add" })}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
          >
            <span>+</span> Publish Post
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="fade-up flex flex-wrap gap-2 mb-6">
        {["all", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border ${
              catFilter === cat
                ? "bg-amber-400 text-zinc-900 border-amber-400"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-16 text-center">
          <p className="text-zinc-500 text-sm">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post, i) => (
            <NewsCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              delay={i * 0.04}
              onEdit={()   => setModal({ type: "edit",   post })}
              onDelete={() => setModal({ type: "delete", post })}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal title="Publish Post" onClose={() => setModal(null)}>
          <NewsForm onSave={handleAdd} onCancel={() => setModal(null)} authorName={user?.name} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit Post" onClose={() => setModal(null)}>
          <NewsForm initial={modal.post} onSave={handleEdit} onCancel={() => setModal(null)} authorName={user?.name} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Delete Post" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-zinc-300 text-sm">
              Delete <span className="text-white font-semibold">"{modal.post.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-display font-bold text-sm transition-colors">Delete →</button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}