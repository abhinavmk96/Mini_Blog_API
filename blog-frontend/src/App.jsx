import { useState, useEffect, useCallback } from "react";
import { LogOut, MessageSquare, Heart, Plus, Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";

// ---- Config -----------------------------------------------------------
// Change this if your FastAPI server runs somewhere else.
const API_BASE = "http://localhost:8000";

// ---- Tiny helpers -------------------------------------------------------
function decodeUserId(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ? Number(payload.sub) : null;
  } catch {
    return null;
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ---- Shared bits ----------------------------------------------------------
function Banner({ error, notice }) {
  if (!error && !notice) return null;
  return (
    <div
      className={`mb-4 rounded-md border px-3 py-2 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error || notice}
    </div>
  );
}

function NavBar({ token, username, onNew, onLogout, onHome, onGoLogin, onGoRegister }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
      <button onClick={onHome} className="text-lg font-semibold tracking-tight text-neutral-900">
        blogboard
      </button>
      {token ? (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-500">{username}</span>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
          >
            <Plus size={14} /> New post
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-neutral-600 hover:bg-neutral-50"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      ) : (
        <div className="flex gap-2 text-sm">
          <button onClick={onGoLogin} className="rounded-md px-3 py-1.5 text-neutral-600 hover:bg-neutral-50">
            Log in
          </button>
          <button
            onClick={onGoRegister}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
}

function LoginScreen({ loginForm, setLoginForm, onSubmit, loading, error, notice, onGoRegister }) {
  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-neutral-900">Log in</h1>
      <p className="mb-6 text-sm text-neutral-500">Welcome back.</p>
      <Banner error={error} notice={notice} />
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
          required
        />
        <input
          type="password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="mx-auto animate-spin" size={16} /> : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        No account?{" "}
        <button className="text-neutral-900 underline" onClick={onGoRegister}>
          Sign up
        </button>
      </p>
    </div>
  );
}

function RegisterScreen({ registerForm, setRegisterForm, onSubmit, loading, error, notice, onGoLogin }) {
  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-neutral-900">Create account</h1>
      <p className="mb-6 text-sm text-neutral-500">Takes a few seconds.</p>
      <Banner error={error} notice={notice} />
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Username"
          value={registerForm.username}
          onChange={(e) => setRegisterForm((f) => ({ ...f, username: e.target.value }))}
          required
        />
        <input
          type="password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Password"
          value={registerForm.password}
          onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="mx-auto animate-spin" size={16} /> : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        Already have an account?{" "}
        <button className="text-neutral-900 underline" onClick={onGoLogin}>
          Log in
        </button>
      </p>
    </div>
  );
}

function FeedScreen({ posts, page, size, loading, error, notice, onOpenPost, onPageChange }) {
  return (
    <div>
      <Banner error={error} notice={notice} />
      {loading && <p className="text-sm text-neutral-500">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="text-sm text-neutral-500">No posts yet. Be the first to write one.</p>
      )}
      <div className="space-y-4">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpenPost(p.id)}
            className="block w-full rounded-lg border border-neutral-200 p-4 text-left hover:border-neutral-400"
          >
            <h2 className="text-base font-semibold text-neutral-900">{p.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{p.content}</p>
            <p className="mt-2 text-xs text-neutral-400">{formatDate(p.created_at)}</p>
          </button>
        ))}
      </div>
      {posts.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-neutral-200 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-neutral-500">Page {page}</span>
          <button
            disabled={posts.length < size}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-neutral-200 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function PostScreen({
  activePost,
  comments,
  userId,
  token,
  error,
  notice,
  commentText,
  setCommentText,
  onBack,
  onLike,
  onUnlike,
  onEdit,
  onDelete,
  onAddComment,
  onDeleteComment,
}) {
  if (!activePost) return null;
  const isOwner = userId != null && activePost.author_id === userId;
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft size={14} /> Back to feed
      </button>
      <Banner error={error} notice={notice} />
      <div className="rounded-lg border border-neutral-200 p-5">
        <h1 className="text-xl font-semibold text-neutral-900">{activePost.title}</h1>
        <p className="mt-1 text-xs text-neutral-400">{formatDate(activePost.created_at)}</p>
        <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-700">{activePost.content}</p>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={onLike}
            disabled={!token}
            className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40"
          >
            <Heart size={14} /> Like
          </button>
          <button
            onClick={onUnlike}
            disabled={!token}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
          >
            Unlike
          </button>
          {isOwner && (
            <>
              <button
                onClick={onEdit}
                className="ml-auto inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <MessageSquare size={14} /> Comments ({comments.length})
        </h2>
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between rounded-md border border-neutral-200 p-3 text-sm"
            >
              <div>
                <p className="text-neutral-700">{c.comment}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  User #{c.user_id} · {formatDate(c.created_at)}
                </p>
              </div>
              {userId === c.user_id && (
                <button onClick={() => onDeleteComment(c.id)} className="text-neutral-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {token ? (
          <form onSubmit={onAddComment} className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Add a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
              Post
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-neutral-400">Log in to comment.</p>
        )}
      </div>
    </div>
  );
}

function ComposeScreen({ editing, postForm, setPostForm, onSubmit, onCancel, loading, error, notice }) {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-xl font-semibold text-neutral-900">{editing ? "Edit post" : "New post"}</h1>
      <Banner error={error} notice={notice} />
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Title"
          value={postForm.title}
          onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <textarea
          className="h-40 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Write something…"
          value={postForm.content}
          onChange={(e) => setPostForm((f) => ({ ...f, content: e.target.value }))}
          required
        />
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {editing ? "Save changes" : "Publish"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- App --------------------------------------------------------------
export default function App() {
  // auth
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // routing (very small hand-rolled router)
  const [screen, setScreen] = useState("login"); // login | register | feed | post | compose | edit

  // feed
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const size = 10;

  // selected post + comments
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);

  // shared ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // form state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", password: "" });
  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [commentText, setCommentText] = useState("");

  const authHeaders = useCallback(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  function clearMessages() {
    setError("");
    setNotice("");
  }

  async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, options);
    let body = null;
    try {
      body = await res.json();
    } catch {
      /* no body */
    }
    if (!res.ok) {
      const detail = body && body.detail ? body.detail : `Request failed (${res.status})`;
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    return body;
  }

  // ---- Data loaders -----------------------------------------------------
  const loadPosts = useCallback(async (targetPage) => {
    setLoading(true);
    clearMessages();
    try {
      const data = await apiFetch(`/posts?page=${targetPage}&size=${size}`);
      setPosts(data.items || []);
      setPage(data.page || targetPage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPostDetail = useCallback(async (postId) => {
    setLoading(true);
    clearMessages();
    try {
      const [post, postComments] = await Promise.all([
        apiFetch(`/posts/${postId}`),
        apiFetch(`/posts/${postId}/comments`).catch(() => []),
      ]);
      setActivePost(post);
      setComments(Array.isArray(postComments) ? postComments : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (screen === "feed") loadPosts(1);
  }, [screen, loadPosts]);

  // ---- Auth actions -------------------------------------------------------
  async function handleRegister(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      setNotice("Account created. Log in below.");
      setLoginForm({ username: registerForm.username, password: "" });
      setScreen("login");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      // Login endpoint expects form-encoded data (OAuth2PasswordRequestForm), not JSON.
      const body = new URLSearchParams();
      body.set("username", loginForm.username);
      body.set("password", loginForm.password);
      const data = await apiFetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setToken(data.access_token);
      setUserId(decodeUserId(data.access_token));
      setUsername(loginForm.username);
      setScreen("feed");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setUserId(null);
    setUsername(null);
    setScreen("login");
  }

  // ---- Post actions -------------------------------------------------------
  async function handleCreatePost(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(postForm),
      });
      setPostForm({ title: "", content: "" });
      setScreen("feed");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePost(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch("/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ post_id: activePost.id, ...postForm }),
      });
      setScreen("feed");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId) {
    clearMessages();
    setLoading(true);
    try {
      await apiFetch(`/posts/${postId}`, { method: "DELETE", headers: authHeaders() });
      setScreen("feed");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    clearMessages();
    try {
      const c = await apiFetch(`/posts/${activePost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ comment: commentText }),
      });
      setComments((prev) => [...prev, c]);
      setCommentText("");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDeleteComment(commentId) {
    clearMessages();
    try {
      await apiFetch(`/posts/comments/${commentId}`, { method: "DELETE", headers: authHeaders() });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleLike(postId) {
    clearMessages();
    try {
      await apiFetch(`/posts/${postId}/Likes`, { method: "POST", headers: authHeaders() });
      setNotice("Liked.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleUnlike(postId) {
    clearMessages();
    try {
      await apiFetch(`/posts/${postId}/Likes`, { method: "DELETE", headers: authHeaders() });
      setNotice("Like removed.");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 font-sans text-neutral-900">
      <div className="mx-auto max-w-2xl">
        <NavBar
          token={token}
          username={username}
          onNew={() => {
            setPostForm({ title: "", content: "" });
            setScreen("compose");
          }}
          onLogout={handleLogout}
          onHome={() => setScreen("feed")}
          onGoLogin={() => setScreen("login")}
          onGoRegister={() => setScreen("register")}
        />

        {screen === "login" && (
          <LoginScreen
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            notice={notice}
            onGoRegister={() => setScreen("register")}
          />
        )}

        {screen === "register" && (
          <RegisterScreen
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            onSubmit={handleRegister}
            loading={loading}
            error={error}
            notice={notice}
            onGoLogin={() => setScreen("login")}
          />
        )}

        {screen === "feed" && (
          <FeedScreen
            posts={posts}
            page={page}
            size={size}
            loading={loading}
            error={error}
            notice={notice}
            onOpenPost={(id) => {
              setScreen("post");
              loadPostDetail(id);
            }}
            onPageChange={loadPosts}
          />
        )}

        {screen === "post" && (
          <PostScreen
            activePost={activePost}
            comments={comments}
            userId={userId}
            token={token}
            error={error}
            notice={notice}
            commentText={commentText}
            setCommentText={setCommentText}
            onBack={() => setScreen("feed")}
            onLike={() => handleLike(activePost.id)}
            onUnlike={() => handleUnlike(activePost.id)}
            onEdit={() => {
              setPostForm({ title: activePost.title, content: activePost.content });
              setScreen("edit");
            }}
            onDelete={() => handleDeletePost(activePost.id)}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {(screen === "compose" || screen === "edit") && (
          <ComposeScreen
            editing={screen === "edit"}
            postForm={postForm}
            setPostForm={setPostForm}
            onSubmit={screen === "edit" ? handleUpdatePost : handleCreatePost}
            onCancel={() => setScreen(screen === "edit" ? "post" : "feed")}
            loading={loading}
            error={error}
            notice={notice}
          />
        )}
      </div>
    </div>
  );
}