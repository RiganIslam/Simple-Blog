"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Author = {
  _id: string;
  name: string;
  email: string;
  bio: string;
};

export default function CreatePost() {
  const router = useRouter();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [authorId, setAuthorId] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD AUTHORS
  // =========================

  async function loadAuthors() {
    try {
      setLoadingAuthors(true);

      const response = await fetch(
        "http://localhost:5000/authors",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load authors"
        );
      }

      setAuthors(data.authors || []);
    } catch (error) {
      console.error("AUTHOR ERROR:", error);
    } finally {
      setLoadingAuthors(false);
    }
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  // =========================
  // CREATE POST
  // =========================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please write your post");
      return;
    }

    if (!authorId) {
      alert("Please select an author");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            category,
            authorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create post"
        );
      }

      alert("Post published successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#191714]">

      {/* Background decoration */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#d95f3f]/10 blur-3xl" />

        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#8b7355]/10 blur-3xl" />

      </div>

      {/* Navbar */}

      <nav className="relative z-20 border-b border-[#ded6ca] bg-[#f5f1ea]/90 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-black"
          >
            SIMPLE
            <span className="text-[#d95f3f]">
              BLOG
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-[#756d63] hover:text-[#191714] transition"
          >
            ← Back Home
          </Link>

        </div>

      </nav>

      {/* Main */}

      <section className="relative max-w-4xl mx-auto px-6 py-16">

        <div className="mb-10">

          <p className="text-[#d95f3f] text-sm font-bold tracking-[0.2em] uppercase">
            Create Something
          </p>

          <h1 className="mt-4 text-5xl md:text-6xl font-black tracking-tight">
            Write a new
            <span className="text-[#d95f3f]">
              {" "}story.
            </span>
          </h1>

          <p className="mt-4 text-[#756d63] text-lg">
            Turn your ideas into something worth reading.
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-[#fffdf9] border border-[#e4ddd2] rounded-[32px] p-7 md:p-10 shadow-xl shadow-[#8b7355]/5"
        >

          {/* Title */}

          <div className="mb-6">

            <label className="block text-sm font-bold mb-2">
              Post Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter your post title..."
              className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition"
            />

          </div>

          {/* Category + Author */}

          <div className="grid md:grid-cols-2 gap-5 mb-6">

            {/* Category */}

            <div>

              <label className="block text-sm font-bold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition cursor-pointer"
              >

                <option value="Technology">
                  Technology
                </option>

                <option value="Programming">
                  Programming
                </option>

                <option value="Design">
                  Design
                </option>

                <option value="Lifestyle">
                  Lifestyle
                </option>

                <option value="Travel">
                  Travel
                </option>

              </select>

            </div>

            {/* Author */}

            <div>

              <label className="block text-sm font-bold mb-2">
                Author
              </label>

              <select
                value={authorId}
                onChange={(e) =>
                  setAuthorId(e.target.value)
                }
                disabled={loadingAuthors}
                className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition cursor-pointer disabled:opacity-50"
              >

                <option value="">
                  {loadingAuthors
                    ? "Loading authors..."
                    : authors.length === 0
                    ? "No authors available"
                    : "Select an author"}
                </option>

                {authors.map((author) => (
                  <option
                    key={author._id}
                    value={author._id}
                  >
                    {author.name}
                  </option>
                ))}

              </select>

              {!loadingAuthors &&
                authors.length === 0 && (
                  <Link
                    href="/authors"
                    className="inline-block mt-2 text-xs text-[#d95f3f] hover:underline"
                  >
                    + Create an author
                  </Link>
                )}

            </div>

          </div>

          {/* Content */}

          <div className="mb-7">

            <div className="flex justify-between mb-2">

              <label className="text-sm font-bold">
                Content
              </label>

              <span className="text-xs text-[#91887d]">
                {content.length} characters
              </span>

            </div>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your story here..."
              rows={14}
              className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition resize-none leading-8"
            />

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              href="/"
              className="sm:w-1/3 text-center py-4 rounded-2xl bg-[#eee7de] hover:bg-[#e4dbd0] transition font-bold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingAuthors ||
                authors.length === 0
              }
              className="sm:flex-1 py-4 rounded-2xl bg-[#191714] text-white hover:bg-[#d95f3f] disabled:opacity-40 disabled:cursor-not-allowed font-bold transition"
            >
              {saving
                ? "Publishing..."
                : "Publish Story →"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}