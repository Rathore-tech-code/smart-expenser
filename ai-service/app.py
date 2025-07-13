# app.py
from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Load trained model and vectorizer
model = pickle.load(open('model.pkl', 'rb'))
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))

@app.route('/')
def home():
    return "AI Service is Running!"

@app.route('/categorize', methods=['POST'])
def categorize():
    data = request.json
    desc = data.get("description", "")
    
    if not desc:
        return jsonify({"error": "Description is required"}), 400

    # Vectorize and predict
    X = vectorizer.transform([desc])
    category = model.predict(X)[0]
    return jsonify({'predicted_category': category})

if __name__ == '__main__':
    app.run(port=5001)
