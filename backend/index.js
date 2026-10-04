const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI);

let postsCollection;
let authorsCollection;

// ===============================
// DATABASE CONNECTION
// ===============================

async function connectDB() {
  try {
    await client.connect();

    const db = client.db("simpleBlogDB");

    postsCollection = db.collection("posts");
    authorsCollection = db.collection("authors");

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error
    );
  }
}

connectDB();


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SIMPLE BLOG API is running",
  });
});


// ======================================================
// AUTHORS
// ======================================================


// ===============================
// GET ALL AUTHORS
// ===============================

app.get("/authors", async (req, res) => {
  try {
    const authors = await authorsCollection
      .find({})
      .sort({ name: 1 })
      .toArray();

    res.json({
      success: true,
      authors,
    });

  } catch (error) {

    console.error(
      "GET AUTHORS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load authors",
    });
  }
});


// ===============================
// GET SINGLE AUTHOR
// ===============================

app.get("/authors/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const author =
      await authorsCollection.findOne({
        _id: new ObjectId(id),
      });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.json({
      success: true,
      author,
    });

  } catch (error) {

    console.error(
      "GET SINGLE AUTHOR ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load author",
    });
  }
});


// ===============================
// CREATE AUTHOR
// ===============================

app.post("/authors", async (req, res) => {
  try {

    const {
      name,
      email,
      bio,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name and email are required",
      });
    }

    const cleanName = name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanBio =
      bio ? bio.trim() : "";


    // Check duplicate email

    const existingAuthor =
      await authorsCollection.findOne({
        email: cleanEmail,
      });

    if (existingAuthor) {
      return res.status(409).json({
        success: false,
        message:
          "An author with this email already exists",
      });
    }


    const author = {
      name: cleanName,
      email: cleanEmail,
      bio: cleanBio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const result =
      await authorsCollection.insertOne(
        author
      );


    res.status(201).json({
      success: true,
      message:
        "Author created successfully",

      author: {
        _id: result.insertedId,
        ...author,
      },
    });

  } catch (error) {

    console.error(
      "CREATE AUTHOR ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create author",
    });
  }
});


// ===============================
// UPDATE AUTHOR
// ===============================

app.put("/authors/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      email,
      bio,
    } = req.body;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }


    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name and email are required",
      });
    }


    const cleanName = name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanBio =
      bio ? bio.trim() : "";


    // Check duplicate email
    // but ignore current author

    const existingAuthor =
      await authorsCollection.findOne({
        email: cleanEmail,

        _id: {
          $ne: new ObjectId(id),
        },
      });


    if (existingAuthor) {
      return res.status(409).json({
        success: false,
        message:
          "Another author already uses this email",
      });
    }


    const result =
      await authorsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },

        {
          $set: {
            name: cleanName,
            email: cleanEmail,
            bio: cleanBio,
            updatedAt: new Date(),
          },
        }
      );


    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }


    res.json({
      success: true,
      message:
        "Author updated successfully",
    });

  } catch (error) {

    console.error(
      "UPDATE AUTHOR ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update author",
    });
  }
});


// ===============================
// DELETE AUTHOR
// ===============================

app.delete("/authors/:id", async (req, res) => {
  try {

    const { id } = req.params;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }


    const authorId =
      new ObjectId(id);


    // Check whether this author
    // has any posts

    const postUsingAuthor =
      await postsCollection.findOne({
        authorId: authorId,
      });


    if (postUsingAuthor) {
      return res.status(409).json({
        success: false,
        message:
          "This author has posts. Delete or reassign those posts before deleting the author.",
      });
    }


    const result =
      await authorsCollection.deleteOne({
        _id: authorId,
      });


    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }


    res.json({
      success: true,
      message:
        "Author deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE AUTHOR ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete author",
    });
  }
});


// ======================================================
// POSTS
// ======================================================


// ===============================
// GET ALL POSTS
// ===============================

app.get("/posts", async (req, res) => {
  try {

    const search =
      String(
        req.query.search || ""
      ).trim();

    const category =
      String(
        req.query.category || ""
      ).trim();


    const filter = {};


    if (search) {

      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }


    if (category) {
      filter.category = category;
    }


    const posts =
      await postsCollection
        .aggregate([

          {
            $match: filter,
          },

          {
            $lookup: {
              from: "authors",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },

          {
            $unwind: {
              path: "$author",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              category: 1,
              authorId: 1,
              createdAt: 1,
              updatedAt: 1,

              author: {
                _id: "$author._id",
                name: "$author.name",
                email: "$author.email",
                bio: "$author.bio",
              },
            },
          },

          {
            $sort: {
              createdAt: -1,
            },
          },

        ])
        .toArray();


    res.json({
      success: true,
      posts,
    });

  } catch (error) {

    console.error(
      "GET POSTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load posts",
    });
  }
});


// ===============================
// GET SINGLE POST
// ===============================

app.get("/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }


    const posts =
      await postsCollection
        .aggregate([

          {
            $match: {
              _id: new ObjectId(id),
            },
          },

          {
            $lookup: {
              from: "authors",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },

          {
            $unwind: {
              path: "$author",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              category: 1,
              authorId: 1,
              createdAt: 1,
              updatedAt: 1,

              author: {
                _id: "$author._id",
                name: "$author.name",
                email: "$author.email",
                bio: "$author.bio",
              },
            },
          },

        ])
        .toArray();


    if (!posts.length) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    res.json({
      success: true,
      post: posts[0],
    });

  } catch (error) {

    console.error(
      "GET SINGLE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load post",
    });
  }
});


// ===============================
// CREATE POST
// ===============================

app.post("/posts", async (req, res) => {
  try {

    const {
      title,
      content,
      category,
      authorId,
    } = req.body;


    if (
      !title ||
      !content ||
      !category ||
      !authorId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }


    const author =
      await authorsCollection.findOne({
        _id: new ObjectId(authorId),
      });


    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }


    const newPost = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),

      authorId:
        new ObjectId(authorId),

      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const result =
      await postsCollection.insertOne(
        newPost
      );


    res.status(201).json({
      success: true,
      message:
        "Post created successfully",

      post: {
        _id: result.insertedId,
        ...newPost,
      },
    });

  } catch (error) {

    console.error(
      "CREATE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
});


// ===============================
// UPDATE POST
// ===============================

app.put("/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      content,
      category,
      authorId,
    } = req.body;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }


    if (
      !title ||
      !content ||
      !category ||
      !authorId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }


    const author =
      await authorsCollection.findOne({
        _id: new ObjectId(authorId),
      });


    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }


    const result =
      await postsCollection.updateOne(

        {
          _id: new ObjectId(id),
        },

        {
          $set: {
            title: title.trim(),
            content: content.trim(),
            category: category.trim(),

            authorId:
              new ObjectId(authorId),

            updatedAt: new Date(),
          },
        }
      );


    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    res.json({
      success: true,
      message:
        "Post updated successfully",
    });

  } catch (error) {

    console.error(
      "UPDATE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
});


// ===============================
// DELETE POST
// ===============================

app.delete("/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }


    const result =
      await postsCollection.deleteOne({
        _id: new ObjectId(id),
      });


    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    res.json({
      success: true,
      message:
        "Post deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
});