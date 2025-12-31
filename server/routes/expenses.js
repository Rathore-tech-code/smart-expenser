const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense"); // Import the Mongoose model

// ✅ Test route
router.get("/", (req, res) => {
  res.json({ message: "🧾 Expense API is working!" });
});

// ✅ Create a new expense (POST)
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body; // ✅ extract date from body

    const expense = new Expense({
      title,
      amount,
      category,
      date, // ✅ now this is defined
    });

    const savedExpense = await expense.save();
    console.log("✅ Expense saved to DB:", savedExpense);
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("❌ Error saving expense:", err);
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

// Inside expenses.js or the relevant route file
// Recommendation endpoint
router.get('/recommendation', async (req, res) => {
  try {
    const expenses = await Expense.find();

    if (expenses.length === 0) {
      return res.json({ recommendations: ["No expenses found. Start adding your spending details."] });
    }

    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);

    const mostSpent = sortedCategories[0][0];
    const leastSpent = sortedCategories[sortedCategories.length - 1][0];

    const recommendations = [
      `You've been spending the most on **${mostSpent}**. Consider reviewing if all those expenses are necessary.`,
      `Your least spending category is **${leastSpent}**. Maybe you can increase budget there if needed.`,
    ];

    res.json({ recommendations });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while generating recommendations.' });
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
