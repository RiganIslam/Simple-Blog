"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Author = {
  _id: string;
  name: string;
  email: string;
  bio: string;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  author?: Author;
  createdAt: string;
  updatedAt?: string;
};

export default function SinglePostPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");


  // =========================
  // LOAD POST
  // =========================

  async function loadPost() {

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/posts/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Post not found"
        );
      }

      setPost(data.post);

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load post"
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    if (id) {
      loadPost();
    }

  }, [id]);


  // =========================
  // DELETE
  // =========================

  async function deletePost() {

    const confirmed = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {

      setDeleting(true);

      const response = await fetch(
        `http://localhost:5000/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete"
        );
      }

      alert("Post deleted successfully!");

      router.push("/");

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );

    } finally {

      setDeleting(false);

    }
  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <main className="min-h-screen bg-[#f5f1ea] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-full border-4 border-[#ded6ca] border-t-[#d95f3f] animate-spin" />

          <p className="mt-4 text-[#756d63]">
            Loading story...
          </p>

        </div>

      </main>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (!post) {

    return (
      <main className="min-h-screen bg-[#f5f1ea] flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-6xl">
            📖
          </div>

          <h1 className="mt-5 text-3xl font-black">
            Post not found
          </h1>

          <p className="mt-3 text-[#756d63]">
            {error}
          </p>

          <Link
            href="/"
            className="inline-block mt-7 px-6 py-3 rounded-xl bg-[#191714] text-white hover:bg-[#d95f3f] transition"
          >
            ← Back Home
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#191714]">

      {/* Navbar */}

      <nav className="border-b border-[#ded6ca] bg-[#f5f1ea]/90 backdrop-blur-xl">

        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">

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
            className="text-sm text-[#756d63] hover:text-[#191714]"
          >
            ← Stories
          </Link>

        </div>

      </nav>


      <article className="max-w-4xl mx-auto px-6 py-16">

        {/* Category */}

        <span className="inline-block px-4 py-1.5 rounded-full bg-[#f0dfd4] text-[#a24b34] text-sm font-bold">
          {post.category}
        </span>


        {/* Title */}

        <h1 className="mt-7 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
          {post.title}
        </h1>


        {/* Date */}

        <p className="mt-6 text-sm text-[#91887d]">

          Published{" "}

          {new Date(
            post.createdAt
          ).toLocaleDateString()}

        </p>


        {/* Author */}

        {post.author && (

          <div className="mt-8 p-5 bg-[#fffdf9] border border-[#e4ddd2] rounded-3xl flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-[#191714] text-white flex items-center justify-center text-xl font-black">

              {post.author.name
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-[#91887d]">
                Written by
              </p>

              <h2 className="font-black text-lg">
                {post.author.name}
              </h2>

              <p className="text-sm text-[#91887d]">
                {post.author.email}
              </p>

            </div>

          </div>

        )}


        {/* Divider */}

        <div className="h-px bg-[#ded6ca] my-12" />


        {/* Content */}

        <div className="bg-[#fffdf9] border border-[#e4ddd2] rounded-[32px] p-7 md:p-10 shadow-sm">

          <div className="text-lg text-[#4f4941] leading-9 whitespace-pre-wrap">
            {post.content}
          </div>

        </div>


        {/* Author Bio */}

        {post.author?.bio && (

          <div className="mt-7 bg-[#191714] text-white rounded-[28px] p-7">

            <p className="text-xs uppercase tracking-widest text-[#d95f3f]">
              About the author
            </p>

            <h3 className="mt-2 text-xl font-black">
              {post.author.name}
            </h3>

            <p className="mt-3 text-white/60 leading-7">
              {post.author.bio}
            </p>

          </div>

        )}


        {/* Actions */}

        <div className="flex flex-col sm:flex-row gap-3 mt-10">

          <Link
            href="/"
            className="flex-1 text-center py-3.5 rounded-xl bg-[#eee7de] hover:bg-[#e3d8cc] transition font-bold"
          >
            ← Back
          </Link>

          <Link
            href={`/posts/${post._id}/edit`}
            className="px-7 py-3.5 text-center rounded-xl bg-[#191714] text-white hover:bg-[#d95f3f] transition font-bold"
          >
            Edit
          </Link>

          <button
            onClick={deletePost}
            disabled={deleting}
            className="px-7 py-3.5 rounded-xl bg-[#fff0ed] text-[#c84f36] hover:bg-[#ffe0da] disabled:opacity-50 transition font-bold"
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </article>

    </main>
  );
}