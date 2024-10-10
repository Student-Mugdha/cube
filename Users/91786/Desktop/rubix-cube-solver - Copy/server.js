// const express = require("express");
// const cors = require("cors");
// const db = require("./backend/config/db"); // Ensure the path to your db.js is correct
// const app = express();

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Use CORS middleware
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow only your frontend origin
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
//     credentials: true, // Include credentials (cookies, etc.)
//   })
// );

// // Root endpoint to confirm the server is running
// app.get("/", (req, res) => {
//   res.send("Welcome to the Rubik's Cube Solver API!");
// });

// // Endpoint to create a new user
// app.post("/users", (req, res) => {
//   const { name, color } = req.body;
//   console.log("Creating user:", { name, color });

//   // Check if both name and color are provided
//   if (!name || !color) {
//     return res.status(400).send("Name and color are required.");
//   }

//   const query = "INSERT INTO users (name, color) VALUES (?, ?)";
//   db.query(query, [name, color], (err, result) => {
//     if (err) {
//       console.error("Error creating user:", err);
//       return res.status(500).send("Error creating user.");
//     }
//     res
//       .status(201)
//       .send({ message: "User created successfully", userId: result.insertId });
//   });
// });

// // Endpoint to update a user's color
// app.put("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const { color } = req.body;

//   // Check if color is provided
//   if (!color) {
//     return res.status(400).send("Color is required.");
//   }

//   const query = "UPDATE users SET color = ? WHERE id = ?";
//   db.query(query, [color, userId], (err, result) => {
//     if (err) {
//       console.error("Error updating user:", err);
//       return res.status(500).send("Error updating user.");
//     } else if (result.affectedRows === 0) {
//       return res.status(404).send("User not found.");
//     }
//     res.status(200).send("User color updated successfully.");
//   });
// });

// // Endpoint to get a user by ID
// app.get("/users/:id", (req, res) => {
//   const userId = req.params.id;

//   const query = "SELECT * FROM users WHERE id = ?";
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching user:", err);
//       return res.status(500).send("Error fetching user.");
//     } else if (results.length === 0) {
//       return res.status(404).send("User not found.");
//     }
//     res.status(200).json(results[0]);
//   });
// });

// // Endpoint to get all users
// app.get("/users", (req, res) => {
//   const query = "SELECT * FROM users";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching users:", err);
//       return res.status(500).send("Error fetching users.");
//     }
//     res.status(200).json(results);
//   });
// });

// // Endpoint to create a new cube attempt
// app.post("/cube_attempts", (req, res) => {
//   const { user_id, cube_state } = req.body;
//   console.log("Creating cube attempt:", { user_id, cube_state });

//   // Check if both user_id and cube_state are provided
//   if (!user_id || !cube_state) {
//     return res.status(400).send("User ID and cube state are required.");
//   }

//   const query =
//     "INSERT INTO cube_attempts (user_id, cube_state, created_at) VALUES (?, ?, NOW())";
//   db.query(query, [user_id, cube_state], (err, result) => {
//     if (err) {
//       console.error("Error creating cube attempt:", err);
//       return res.status(500).send("Error creating cube attempt.");
//     }
//     res
//       .status(201)
//       .send({
//         message: "Cube attempt created successfully",
//         attemptId: result.insertId,
//       });
//   });
// });

// // Endpoint to get all cube attempts by a specific user
// app.get("/cube_attempts/user/:user_id", (req, res) => {
//   const userId = req.params.user_id;

//   const query = "SELECT * FROM cube_attempts WHERE user_id = ?";
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching cube attempts:", err);
//       return res.status(500).send("Error fetching cube attempts.");
//     }
//     res.status(200).json(results);
//   });
// });

// // Start the server on port 5000
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./backend/config/db");
const path = require("path");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    credentials: true, // Include credentials (cookies, etc.)
  })
);

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with a unique name
  },
});

// Initialize multer with storage settings
const upload = multer({ storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root endpoint to confirm the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Rubik's Cube Solver API!");
});

// Endpoint to create a new user
app.post("/users", (req, res) => {
  const { name, color } = req.body;
  console.log("Creating user:", { name, color });

  // Check if both name and color are provided
  if (!name || !color) {
    return res.status(400).send("Name and color are required.");
  }

  const query = "INSERT INTO users (name, color) VALUES (?, ?)";
  db.query(query, [name, color], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      return res.status(500).send("Error creating user.");
    }
    res
      .status(201)
      .send({ message: "User created successfully", userId: result.insertId });
  });
});

// Endpoint to update a user's color
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { color } = req.body;

  // Check if color is provided
  if (!color) {
    return res.status(400).send("Color is required.");
  }

  const query = "UPDATE users SET color = ? WHERE id = ?";
  db.query(query, [color, userId], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Error updating user.");
    } else if (result.affectedRows === 0) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send("User color updated successfully.");
  });
});

// Endpoint to get a user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Error fetching user.");
    } else if (results.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.status(200).json(results[0]);
  });
});

// Endpoint to get all users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users.");
    }
    res.status(200).json(results);
  });
});

// Endpoint to create a new cube attempt
app.post("/cube_attempts", (req, res) => {
  const { user_id, cube_state } = req.body;
  console.log("Creating cube attempt:", { user_id, cube_state });

  // Check if both user_id and cube_state are provided
  if (!user_id || !cube_state) {
    return res.status(400).send("User ID and cube state are required.");
  }

  const query =
    "INSERT INTO cube_attempts (user_id, cube_state, created_at) VALUES (?, ?, NOW())";
  db.query(query, [user_id, cube_state], (err, result) => {
    if (err) {
      console.error("Error creating cube attempt:", err);
      return res.status(500).send("Error creating cube attempt.");
    }
    res.status(201).send({
      message: "Cube attempt created successfully",
      attemptId: result.insertId,
    });
  });
});

// Endpoint to get all cube attempts by a specific user
app.get("/cube_attempts/user/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const query = "SELECT * FROM cube_attempts WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cube attempts:", err);
      return res.status(500).send("Error fetching cube attempts.");
    }
    res.status(200).json(results);
  });
});

// Endpoint to upload an image
// Endpoint to upload an image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const userId = req.body.userId; // Ensure this retrieves the correct userId
  const imageUrl = req.file.path; // Path to the uploaded file

  // Log userId to check its value
  console.log("Received userId:", userId);

  // Check if userId is valid
  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  // Insert the image URL into the uploaded_images table
  const query =
    "INSERT INTO uploaded_images (user_id, image_url) VALUES (?, ?)";
  db.query(query, [userId, imageUrl], (err, result) => {
    if (err) {
      console.error("Error saving image URL:", err);
      return res.status(500).send("Error saving image URL.");
    }
    res.status(200).send({
      message: "Image uploaded successfully",
      filePath: imageUrl,
      id: result.insertId,
    });
  });
});

// Endpoint to get hints for solving the cube based on cube state
app.get("/hints/:cube_state", (req, res) => {
  const cubeState = req.params.cube_state;
  console.log("Fetching hints for cube state:", cubeState);

  // Logic to generate hints based on cube state
  const hints = {
    // Customize hints based on the cube state
    unsolved: "Try solving the white cross on the top face first.",
    solved: "Congratulations! The cube is already solved.",
  };

  // Return hints based on the cube state
  const hint = hints[cubeState] || "No hints available for this state.";
  res.status(200).send({ hint });
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
