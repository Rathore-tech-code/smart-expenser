const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense"); // Import the Mongoose model

// ✅ Test route
router.get("/", (req, res) => {
  res.json({ message: "🧾 Expense API is working!" });
});

// ✅ Create a new expense (POST)
router.post("/", async (req, res) => {
    //console.log("📥 Received new expense:", req.body);
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all expenses (GET)
router.get("/all", async (req, res) => {
  try {
    const expenses = await Expense.find();

    // ✅ Console log to confirm what’s being fetched
    console.log("Fetched expenses from DB:", expenses);

    res.json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get a single expense by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update an expense (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete an expense (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
