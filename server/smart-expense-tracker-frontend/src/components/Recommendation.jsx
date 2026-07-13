import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios
      .get("https://smart-expenser-qlmp.onrender.com/api/expenses/recommendations")
      .then((response) => {
        setRecommendations(response.data.recommendations || []);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
      });
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-md mt-8 w-full max-w-md border border-gray-300">
      <h2 className="text-xl font-semibold mb-3 text-blue-700">💡 AI Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recommendations yet. Add some expenses to see insights.</p>
      )}
    </div>
  );
};

export default Recommendation;
