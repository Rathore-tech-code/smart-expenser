import { useState, useEffect } from 'react';

export default function App() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/expenses")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched data:", data); // debug this in browser
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      } else {
        console.error("Unexpected API format:", data);
        setExpenses([]);
      }
    })
    .catch((err) => console.error("Error fetching expenses:", err));
}, []);


 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !amount) return;

  const newExpense = {
    title,
    amount: parseFloat(amount),
  };

  try {
    const response = await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    });

    const data = await response.json();

    // Add the newly created expense from backend to state
    setExpenses([...expenses, data]);

    // Clear form
    setTitle('');
    setAmount('');
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: 'DELETE',
    });

    // Update state to remove the deleted expense
    setExpenses(expenses.filter(exp => exp._id !== id));
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">💰 Smart Expense Tracker</h1>

      {/* Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter expense title"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
       <ul className="space-y-4">
  {expenses.map((expense) => (
    <li
      key={expense._id}
      className="bg-white p-4 shadow rounded flex justify-between items-center"
    >
      <div>
        <span className="block font-medium">{expense.title}</span>
        <span className="text-green-600 font-semibold">₹{expense.amount}</span>
      </div>
      <button
        onClick={() => handleDelete(expense._id)}
        className="text-red-500 hover:text-red-700 font-bold text-xl"
        title="Delete"
      >
        ✖
      </button>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}
