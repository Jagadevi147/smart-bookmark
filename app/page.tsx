"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔹 Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        fetchBookmarks(data.user.id);
      }
    };
    getUser();
  }, []);

  // 🔹 Realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
        },
        () => fetchBookmarks(user.id),
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        () => fetchBookmarks(user.id),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // 🔹 Add bookmark (instant UI update)
  const addBookmark = async () => {
    if (!title || !url) return alert("Enter title & URL");

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }])
      .select();

    if (!error && data) {
      setBookmarks((prev) => [...data, ...prev]);
    }

    setTitle("");
    setUrl("");
  };

  // 🔹 Delete bookmark (instant UI update)
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // 🔹 Google login
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  // 🔹 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ================= LOGIN SCREEN =================
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Smart Bookmark</h1>

          <button
            onClick={loginWithGoogle}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN APP =================
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-12">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-2">Welcome</h2>
        <p className="text-center text-gray-500 mb-4">{user.email}</p>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg mb-6 hover:bg-red-600"
        >
          Logout
        </button>

        <h3 className="font-semibold mb-2">Add Bookmark</h3>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={addBookmark}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Add Bookmark
        </button>

        <h3 className="font-semibold mt-6 mb-2">Your Bookmarks</h3>

        {bookmarks.length === 0 && (
          <p className="text-gray-400 text-sm">No bookmarks yet</p>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
          >
            <a
              href={b.url}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {b.title}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 text-lg"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
