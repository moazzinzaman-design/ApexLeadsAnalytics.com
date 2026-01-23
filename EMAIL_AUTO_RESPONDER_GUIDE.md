# 📧 Setting Up Your Automated Welcome Email

I have integrated the code to automatically send your custom welcome email to anyone who fills out a form on your website.

To make this live, you need to use **EmailJS** (a free service that lets you send emails from Javascript).

## 🚀 Quick Setup Guide (Free Account)

### 1. Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and Sign Up (Free up to 200 emails/month).
2. Once logged in, click **"Add New Service"**.
3. Select "Gmail" (or your preferred service) and click "Connect Account".
4. Copy the **Service ID** (e.g., `service_abc123`).

### 2. Create the Email Template
1. Click **"Email Templates"** on the left sidebar.
2. Click **"Create New Template"**.
3. **Template Design**:
   - **Subject**: `{{subject}}`
   - **Content**: `{{message}}`
   *(Note: The actual text is already saved in your `script.js` file, so this template just needs to hold these variables)*.
4. **Auto-Responder Settings** (To send email TO the user):
   - Click **"Auto-Reply"** or ensure the "To Email" field is set to: `{{to_email}}`.
   - IMPORTANT: In the standard template, typically the email goes to *you*. To start, just configure the main template to send to `{{to_email}}`.
   - Alternatively, create *two* templates: one for you (Notification) and one for user (Welcome).
   - *Simpler Method:* I have configured the code to send ONE email. If you want the user to get the welcome email, set the "To Email" in your template to `{{to_email}}`.
5. Save the template and copy the **Template ID** (e.g., `template_xyz789`).

### 3. Get Your Public Key
1. Go to **"Account"** -> **"General"**.
2. Copy your **Public Key** (e.g., `user_123456789`).

### 4. Activate It in Your Code
Open `script.js` in your text editor and find **Lines 86-88**:

```javascript
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Paste your Public Key here
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Paste your Service ID here
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Paste your Template ID here
```

Replace the values with your actual keys.

---

## ✅ Testing
1. Save `script.js`.
2. Open your website (`index.html`).
3. Fill out the form.
4. You should see "Sending..." and then "✓ Message Sent!".
5. Check the email inbox of the email address you entered.

## 📄 Your Welcome Email Content
(Already saved in `script.js` for you)

**Subject:** Welcome to Apex Leads Analytics — Let’s Grow Your Business

**Body:**
Hi there,

I hope you’re doing well. My name is Haidar Zaman, and I’m the founder of Apex Leads Analytics. I wanted to personally welcome you and thank you for taking the time to connect with us.
...
(Full content is preserved in the code)
