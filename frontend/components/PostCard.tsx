"use client";

import Link from "next/link";

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

type Props = {
  post: Post;
  onDelete: (id: string) => void;
};

export default function PostCard({
  post,
  onDelete,
}: Props) {
  return (
    <article className="group bg-[#fffdf9] border border-[#e4ddd2] rounded-[28px] p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8b7355]/10 transition-all duration-500">

      {/* Category */}

      <div className="flex items-center justify-between">

        <span className="px-3 py-1 rounded-full bg-[#f1e6db] text-[#a24b34] text-xs font-bold">
          {post.category}
        </span>

        <span className="text-xs text-[#91887d]">
          {post.createdAt
            ? new Date(
                post.createdAt
              ).toLocaleDateString()
            : ""}
        </span>

      </div>

      {/* Title */}

      <Link href={`/posts/${post._id}`}>

        <h2 className="mt-6 text-2xl font-black leading-tight text-[#191714] group-hover:text-[#d95f3f] transition-colors duration-300">
          {post.title}
        </h2>

      </Link>

      {/* Content */}

      <p className="mt-4 text-[#756d63] leading-7 line-clamp-3">
        {post.content}
      </p>

      {/* Author */}

      {post.author && (
        <div className="mt-7 pt-5 border-t border-[#e8e1d8] flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-[#191714] text-white flex items-center justify-center font-bold">
            {post.author.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="text-[10px] uppercase tracking-widest text-[#9a9187]">
              Author
            </p>

            <p className="text-sm font-bold text-[#29251f]">
              {post.author.name}
            </p>

          </div>

        </div>
      )}

      {/* Actions */}

      <div className="flex gap-2 mt-6">

        <Link
          href={`/posts/${post._id}`}
          className="flex-1 text-center py-2.5 rounded-xl bg-[#191714] text-white text-sm font-semibold hover:bg-[#d95f3f] transition"
        >
          Read
        </Link>

        <Link
          href={`/posts/${post._id}/edit`}
          className="px-4 py-2.5 rounded-xl bg-[#f1ebe3] text-[#625b52] text-sm font-semibold hover:bg-[#e5dbcf] transition"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(post._id)}
          className="px-4 py-2.5 rounded-xl bg-[#fff0ed] text-[#c84f36] text-sm font-semibold hover:bg-[#ffe0da] transition"
        >
          Delete
        </button>

      </div>

    </article>
  );
}