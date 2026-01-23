
import os
from flask import Flask, request, jsonify
from send_email import send_email

app = Flask(__name__)

@app.route('/')
def home():
    return "Apex Leads Analytics Email Service is running!"


@app.route('/enquiry', methods=['POST'])
def enquiry():
    data = request.json
    user_email = data.get('email')
    print(f"Received enquiry for: {user_email}")
    if not user_email:
        print("No email provided in enquiry.")
        return jsonify({"error": "Email is required"}), 400

    subject = "Welcome to Apex Leads Analytics!"
    body = "Thank you for your enquiry. We'll be in touch soon."
    send_email(user_email, subject, body)
    print("Enquiry processed.")
    return jsonify({"message": "Welcome email sent!"}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
