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
  createdAt: string;
  updatedAt?: string;
};

export default function EditPostPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;


  // =========================
  // STATES
  // =========================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [authorId, setAuthorId] = useState("");

  const [authors, setAuthors] = useState<Author[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // =========================
  // LOAD POST + AUTHORS
  // =========================

  async function loadData() {

    try {

      setLoading(true);

      const [postResponse, authorResponse] =
        await Promise.all([

          fetch(
            `http://localhost:5000/posts/${id}`,
            {
              cache: "no-store",
            }
          ),

          fetch(
            "http://localhost:5000/authors",
            {
              cache: "no-store",
            }
          ),

        ]);


      const postData =
        await postResponse.json();

      const authorData =
        await authorResponse.json();


      if (!postResponse.ok) {

        throw new Error(
          postData.message ||
            "Failed to load post"
        );

      }


      if (!authorResponse.ok) {

        throw new Error(
          authorData.message ||
            "Failed to load authors"
        );

      }


      const post: Post =
        postData.post;


      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setAuthorId(post.authorId);

      setAuthors(
        authorData.authors || []
      );

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load data"
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    if (id) {
      loadData();
    }

  }, [id]);


  // =========================
  // UPDATE POST
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

      alert("Please write some content");

      return;
    }


    if (!authorId) {

      alert("Please select an author");

      return;
    }


    try {

      setSaving(true);


      const response = await fetch(
        `http://localhost:5000/posts/${id}`,
        {
          method: "PUT",

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
          data.message ||
            "Failed to update post"
        );

      }


      alert("Post updated successfully!");


      router.push(`/posts/${id}`);

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


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <main className="min-h-screen bg-[#f5f1ea] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-full border-4 border-[#ded6ca] border-t-[#d95f3f] animate-spin" />

          <p className="mt-4 text-[#756d63]">
            Loading post...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#191714]">

      {/* Navbar */}

      <nav className="border-b border-[#ded6ca] bg-[#f5f1ea]/90 backdrop-blur-xl">

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
            href={`/posts/${id}`}
            className="text-sm text-[#756d63] hover:text-[#191714]"
          >
            ← Back to Post
          </Link>

        </div>

      </nav>


      {/* Page */}

      <section className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-10">

          <p className="text-[#d95f3f] text-sm font-bold tracking-[0.2em] uppercase">
            Edit Story
          </p>

          <h1 className="mt-4 text-5xl md:text-6xl font-black">
            Refine your
            <span className="text-[#d95f3f]">
              {" "}story.
            </span>
          </h1>

          <p className="mt-4 text-[#756d63]">
            Make your changes and save the updated story.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-[#fffdf9] border border-[#e4ddd2] rounded-[32px] p-7 md:p-10 shadow-xl shadow-[#8b7355]/5"
        >

          {/* TITLE */}

          <div className="mb-6">

            <label className="block text-sm font-bold mb-2">
              Post Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition"
            />

          </div>


          {/* CATEGORY */}

          <div className="grid md:grid-cols-2 gap-5 mb-6">

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


            {/* AUTHOR */}

            <div>

              <label className="block text-sm font-bold mb-2">
                Author
              </label>

              <select
                value={authorId}
                onChange={(e) =>
                  setAuthorId(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition cursor-pointer"
              >

                <option value="">
                  Select an author
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

            </div>

          </div>


          {/* CONTENT */}

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
              rows={15}
              className="w-full px-5 py-4 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] transition resize-none leading-8"
            />

          </div>


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              href={`/posts/${id}`}
              className="sm:w-1/3 text-center py-4 rounded-2xl bg-[#eee7de] hover:bg-[#e3d8cc] transition font-bold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="sm:flex-1 py-4 rounded-2xl bg-[#191714] text-white hover:bg-[#d95f3f] disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes →"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}