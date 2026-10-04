"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";

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
  author?: Author;
  createdAt: string;
};

export default function Home() {

  const [posts, setPosts] = useState<Post[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);


  async function loadPosts() {

    try {

      setLoading(true);

      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      const response = await fetch(
        `http://localhost:5000/posts?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPosts(data.posts || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    const timer = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timer);

  }, [search, category]);


  async function deletePost(id: string) {

    const confirmed = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {

      const response = await fetch(
        `http://localhost:5000/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPosts((previous) =>
        previous.filter(
          (post) => post._id !== id
        )
      );

    } catch (error) {

      console.error(error);

      alert("Failed to delete post");

    }
  }


  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#191714]">

      <Navbar />


      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">

        <div className="max-w-4xl">

          <p className="text-[#d95f3f] text-sm font-bold tracking-[0.2em] uppercase">
            Stories • Ideas • People
          </p>

          <h1 className="mt-5 text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">

            Ideas deserve
            <br />

            <span className="text-[#d95f3f]">
              good stories.
            </span>

          </h1>

          <p className="mt-7 max-w-2xl text-lg text-[#756d63] leading-8">
            A simple place to discover thoughtful stories,
            creative ideas and experiences from different
            writers.
          </p>

          <Link
            href="/create"
            className="inline-flex mt-8 px-7 py-3.5 rounded-full bg-[#191714] text-white font-semibold hover:bg-[#d95f3f] hover:-translate-y-1 transition-all duration-300"
          >
            Start Writing →
          </Link>

        </div>

      </section>


      {/* SEARCH */}

      <section className="max-w-7xl mx-auto px-6 pb-10">

        <div className="bg-[#fffdf9] border border-[#e4ddd2] rounded-3xl p-4 flex flex-col md:flex-row gap-3">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search stories..."
            className="flex-1 px-5 py-3.5 rounded-2xl bg-[#f5f1ea] outline-none border border-transparent focus:border-[#d95f3f] transition"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="px-5 py-3.5 rounded-2xl bg-[#f5f1ea] outline-none cursor-pointer"
          >

            <option value="">
              All Categories
            </option>

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

      </section>


      {/* POSTS */}

      <section className="max-w-7xl mx-auto px-6 pb-24">

        {loading ? (

          <div className="py-24 text-center">

            <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#ddd4c8] border-t-[#d95f3f] animate-spin" />

            <p className="mt-4 text-[#91887d]">
              Loading stories...
            </p>

          </div>

        ) : posts.length === 0 ? (

          <div className="py-24 text-center">

            <div className="text-6xl">
              ✍️
            </div>

            <h2 className="mt-5 text-2xl font-black">
              No stories found
            </h2>

            <p className="mt-2 text-[#91887d]">
              Try another search or write your first story.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {posts.map((post) => (

              <PostCard
                key={post._id}
                post={post}
                onDelete={deletePost}
              />

            ))}

          </div>

        )}

      </section>

    </main>
  );
}