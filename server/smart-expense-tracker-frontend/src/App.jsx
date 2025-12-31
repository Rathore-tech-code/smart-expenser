import ExpenseChart from './components/ExpenseChart';

import { useState, useEffect } from 'react';
import Recommendation from './components/Recommendation';

export default function App() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
const [selectedDate, setSelectedDate] = useState('');


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
    category,// ye abhi add kia hai
    date: date || new Date().toISOString().slice(0, 10)
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
    setCategory('');
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
const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
const filteredExpenses = selectedDate
  ? expenses.filter(exp => exp.date?.slice(0, 10) === selectedDate)
  : expenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">💰 Smart Expense Tracker</h1>
    {/* Summary Box */}
<div className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-4 w-full max-w-md mb-6 text-center border border-gray-300">
  <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
  <p className="text-2xl font-bold text-blue-600 mt-2">₹{totalAmount}</p>
</div>
      {/* Expense Form */}
     <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-md mb-8 border border-gray-200"
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
        <div className="mb-4">
  <label className="block text-gray-700 font-semibold mb-2">Date</label>
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    required
  />
</div>

        <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        >
        <option value="">Select category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>
    </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Expense
        </button>
      </form>
<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow mb-6 w-full max-w-md">
  <p className="font-semibold text-lg">Total Spent:</p>
  <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
</div>
<div className="mb-6 w-full max-w-md">
  <label className="block text-gray-700 font-semibold mb-2">Filter by Date</label>
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded"
  />
</div>

      {/* Expense List */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
       <ul className="space-y-4">
  {filteredExpenses.map((expense) => (
    <li
      key={expense._id}
      className="bg-white/90 backdrop-blur-md p-4 shadow-lg rounded-xl flex justify-between items-center border border-gray-300 hover:shadow-2xl transition-all"
    >

      <div>
        <span className="block font-medium">{expense.title}</span>
        <span className="text-sm text-gray-500">{expense.category}</span>
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
 <ExpenseChart expenses={expenses} />
<Recommendation /> 
      </div>
    </div>
  );
}
