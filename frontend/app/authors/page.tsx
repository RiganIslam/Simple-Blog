"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Author = {
  _id: string;
  name: string;
  email: string;
  bio: string;
};

export default function AuthorsPage() {

  const [authors, setAuthors] =
    useState<Author[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);


  // =================================
  // LOAD AUTHORS
  // =================================

  async function loadAuthors() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "http://localhost:5000/authors",
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load authors"
        );
      }


      setAuthors(
        data.authors || []
      );

    } catch (error) {

      console.error(
        "LOAD AUTHORS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load authors"
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadAuthors();

  }, []);


  // =================================
  // RESET FORM
  // =================================

  function resetForm() {

    setName("");
    setEmail("");
    setBio("");
    setEditingId(null);

  }


  // =================================
  // CREATE / UPDATE
  // =================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    if (!name.trim()) {

      alert(
        "Please enter author name"
      );

      return;
    }


    if (!email.trim()) {

      alert(
        "Please enter author email"
      );

      return;
    }


    try {

      setSaving(true);


      const url = editingId
        ? `http://localhost:5000/authors/${editingId}`
        : "http://localhost:5000/authors";


      const method =
        editingId
          ? "PUT"
          : "POST";


      const response =
        await fetch(url, {

          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name: name.trim(),

            email:
              email.trim(),

            bio:
              bio.trim(),

          }),

        });


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Something went wrong"
        );
      }


      if (editingId) {

        alert(
          "Author updated successfully!"
        );

      } else {

        alert(
          "Author created successfully!"
        );

      }


      resetForm();

      await loadAuthors();


    } catch (error) {

      console.error(
        "SAVE AUTHOR ERROR:",
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setSaving(false);

    }

  }


  // =================================
  // START EDIT
  // =================================

  function handleEdit(
    author: Author
  ) {

    setEditingId(
      author._id
    );

    setName(
      author.name
    );

    setEmail(
      author.email
    );

    setBio(
      author.bio || ""
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // =================================
  // DELETE AUTHOR
  // =================================

  async function handleDelete(
    id: string
  ) {

    const confirmed =
      confirm(
        "Are you sure you want to delete this author?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `http://localhost:5000/authors/${id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete author"
        );

      }


      alert(
        "Author deleted successfully!"
      );


      setAuthors(
        (previous) =>
          previous.filter(
            (author) =>
              author._id !== id
          )
      );


      if (editingId === id) {
        resetForm();
      }


    } catch (error) {

      console.error(
        "DELETE AUTHOR ERROR:",
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete author"
      );

    }

  }


  return (

    <main className="min-h-screen bg-[#f5f1ea] text-[#191714]">


      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#d95f3f]/10 blur-3xl" />

        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#8b7355]/10 blur-3xl" />

      </div>


      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="relative z-20 border-b border-[#ded6ca] bg-[#f5f1ea]/90 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >

            SIMPLE

            <span className="text-[#d95f3f]">
              BLOG
            </span>

          </Link>


          <div className="flex items-center gap-3">

            <Link
              href="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-[#756d63] hover:bg-white hover:text-[#191714] transition"
            >
              Stories
            </Link>

            <Link
              href="/create"
              className="px-5 py-2.5 rounded-full bg-[#191714] text-white text-sm font-semibold hover:bg-[#d95f3f] transition"
            >
              + Write
            </Link>

          </div>

        </div>

      </nav>


      {/* =================================
          MAIN
      ================================= */}

      <section className="relative max-w-7xl mx-auto px-6 py-16">


        {/* HEADER */}

        <div className="mb-12">

          <p className="text-[#d95f3f] text-sm font-bold tracking-[0.2em] uppercase">

            People Behind The Stories

          </p>


          <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tight">

            Authors

          </h1>


          <p className="mt-5 max-w-2xl text-lg text-[#756d63] leading-8">

            Create writers, update their
            information and connect them
            with your stories.

          </p>

        </div>


        {/* =================================
            FORM + LIST
        ================================= */}

        <div className="grid lg:grid-cols-[380px_1fr] gap-10">


          {/* =================================
              AUTHOR FORM
          ================================= */}

          <div className="h-fit sticky top-28">

            <form
              onSubmit={handleSubmit}
              className="bg-[#fffdf9] border border-[#e4ddd2] rounded-[30px] p-7 shadow-xl shadow-[#8b7355]/5"
            >


              {/* FORM TITLE */}

              <div className="flex items-center justify-between mb-7">

                <div>

                  <p className="text-xs uppercase tracking-widest text-[#d95f3f] font-bold">

                    {editingId
                      ? "Edit Mode"
                      : "New Writer"}

                  </p>


                  <h2 className="mt-1 text-2xl font-black">

                    {editingId
                      ? "Edit Author"
                      : "Create Author"}

                  </h2>

                </div>


                {editingId && (

                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-bold text-[#756d63] hover:text-[#d95f3f]"
                  >
                    Cancel
                  </button>

                )}

              </div>


              {/* NAME */}

              <div className="mb-5">

                <label className="block text-sm font-bold mb-2">

                  Name

                </label>


                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] focus:ring-4 focus:ring-[#d95f3f]/10 transition"
                />

              </div>


              {/* EMAIL */}

              <div className="mb-5">

                <label className="block text-sm font-bold mb-2">

                  Email

                </label>


                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="john@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] focus:ring-4 focus:ring-[#d95f3f]/10 transition"
                />

              </div>


              {/* BIO */}

              <div className="mb-6">

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-bold">

                    Bio

                  </label>


                  <span className="text-xs text-[#91887d]">

                    {bio.length} chars

                  </span>

                </div>


                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  placeholder="Tell readers about this author..."
                  rows={6}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#f5f1ea] border border-[#e2dacf] outline-none focus:border-[#d95f3f] focus:ring-4 focus:ring-[#d95f3f]/10 transition resize-none leading-7"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex flex-col gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 rounded-2xl bg-[#191714] text-white hover:bg-[#d95f3f] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all duration-300"
                >

                  {saving

                    ? editingId
                      ? "Saving Changes..."
                      : "Creating..."

                    : editingId
                    ? "Save Changes →"
                    : "Create Author →"}

                </button>


                {editingId && (

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-3.5 rounded-2xl bg-[#eee7de] hover:bg-[#e3d8cc] font-bold transition"
                  >
                    Cancel Editing
                  </button>

                )}

              </div>

            </form>

          </div>


          {/* =================================
              AUTHOR LIST
          ================================= */}

          <div>


            {loading ? (

              <div className="bg-[#fffdf9] border border-[#e4ddd2] rounded-[30px] py-24 text-center">

                <div className="w-11 h-11 mx-auto rounded-full border-4 border-[#ded6ca] border-t-[#d95f3f] animate-spin" />

                <p className="mt-4 text-[#91887d]">

                  Loading authors...

                </p>

              </div>

            ) : authors.length === 0 ? (

              <div className="bg-[#fffdf9] border border-dashed border-[#d8cec1] rounded-[30px] p-14 text-center">

                <div className="text-6xl">
                  ✍️
                </div>

                <h2 className="mt-5 text-2xl font-black">

                  No authors yet

                </h2>

                <p className="mt-2 text-[#91887d]">

                  Create your first author
                  using the form.

                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-5">

                {authors.map(
                  (author, index) => (

                    <article
                      key={author._id}
                      className="group bg-[#fffdf9] border border-[#e4ddd2] rounded-[28px] p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8b7355]/10 transition-all duration-500"
                    >


                      {/* TOP */}

                      <div className="flex items-start justify-between">

                        <div className="w-14 h-14 rounded-2xl bg-[#191714] text-white flex items-center justify-center text-xl font-black group-hover:bg-[#d95f3f] transition-colors duration-300">

                          {author.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <span className="text-xs text-[#b0a69b] font-bold">

                          #{String(
                            index + 1
                          ).padStart(2, "0")}

                        </span>

                      </div>


                      {/* NAME */}

                      <h3 className="mt-6 text-2xl font-black group-hover:text-[#d95f3f] transition-colors">

                        {author.name}

                      </h3>


                      {/* EMAIL */}

                      <p className="mt-1 text-sm text-[#d95f3f] break-all">

                        {author.email}

                      </p>


                      {/* BIO */}

                      <p className="mt-5 text-sm text-[#756d63] leading-7 min-h-[84px]">

                        {author.bio ||
                          "No bio available."}

                      </p>


                      {/* DIVIDER */}

                      <div className="h-px bg-[#e8e1d8] my-5" />


                      {/* ACTIONS */}

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              author
                            )
                          }
                          className="flex-1 py-3 rounded-xl bg-[#f1ebe3] text-[#625b52] font-bold text-sm hover:bg-[#191714] hover:text-white transition"
                        >
                          ✏️ Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              author._id
                            )
                          }
                          className="flex-1 py-3 rounded-xl bg-[#fff0ed] text-[#c84f36] font-bold text-sm hover:bg-[#c84f36] hover:text-white transition"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  );
}