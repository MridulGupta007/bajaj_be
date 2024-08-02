const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const cors = require("cors");

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());
app.use(bodyParse.urlencoded({ extended: true }));
// Middleware for input validation
function validateInput(req, res, next) {
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      Status: "Error",
      Message: "Input data should be an array.",
    });
  }

  for (let item of data) {
    if (typeof item !== "string" && typeof item !== "number") {
      return res.status(400).json({
        Status: "Error",
        Message: "Array elements should be either numbers or alphabets.",
      });
    }

    if (typeof item === "string" && !item.match(/^[a-zA-Z0-9]$/)) {
      return res.status(400).json({
        Status: "Error",
        Message:
          "Invalid character in the array. Only single alphabets or numbers are allowed.",
      });
    }
  }

  next();
}

// Route to handle both GET and POST requests
app.get("/bfhl", (req, res) => {
  try {
    // Handle GET request
    const operation_code = 1; // Example operation code
    res.json({ operation_code: operation_code });
  } catch (error) {
    res
      .status(500)
      .json({
        Status: "Error",
        Message: "An error occurred while processing your request.",
      });
  }
});
app.post("/bfhl", (req, res) => {
  try {
    // Handle POST request
    const data = req.body.data;

    // Separate the mixed array into numbers and alphabets
    const numbers_array = [];
    const alphabets_array = [];

    data.forEach((item) => {
      if (!isNaN(item)) {
        // If the item is a number
        numbers_array.push(Number(item));
      } else if (typeof item === "string" && item.match(/^[a-zA-Z]$/)) {
        // If the item is an alphabet
        alphabets_array.push(item);
      }
    });

    // Find the highest alphabet (case insensitive)
    let highest_alphabet = null;
    if (alphabets_array.length > 0) {
      highest_alphabet = alphabets_array.reduce((highest, current) => {
        return current.toLowerCase() > highest.toLowerCase()
          ? current
          : highest;
      });
    }

    const response = {
      is_success: true,
      user_id: "Mridul_Gupta_17022003",
      roll_number: "RA2111003011753",
      numbers: numbers_array,
      alphabets: alphabets_array,
      highest_alphabet: highest_alphabet,
    };

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({
        Status: "Error",
        Message: "An error occurred while processing your request.",
      });
  }
});

// Global error handling middleware
app.use((req, res) => {
//   console.error(err.stack);
  res.status(500).json({ Status: "Error", Message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
