# model.py
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Sample training data
data = pd.DataFrame({
    'description': [
        "Uber ride to office", "Pizza at Dominos", "Netflix subscription",
        "Groceries from BigBazaar", "Diesel refill", "Movie ticket",
        "Bus fare", "Dinner at restaurant", "Spotify monthly",
        "Apples and bananas"
    ],
    'category': [
        "Transport", "Food", "Entertainment", "Groceries", "Transport",
        "Entertainment", "Transport", "Food", "Entertainment", "Groceries"
    ]
})

# Text preprocessing
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(data['description'])
y = data['category']

# Train model
model = MultinomialNB()
model.fit(X, y)

# Save model and vectorizer
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("Model trained and saved!")
