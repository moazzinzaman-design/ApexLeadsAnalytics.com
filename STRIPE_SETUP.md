# Stripe Payment Integration Setup Guide

This document explains how to set up Stripe payments for Apex Leads Analytics.

## What's Been Implemented

### 1. Stripe Configuration
- **lib/stripe.ts** - Stripe client configuration with price IDs and URLs

### 2. API Routes
- **app/api/stripe/checkout/route.ts** - Creates Stripe checkout sessions
- **app/api/stripe/webhook/route.ts** - Handles Stripe webhook events

### 3. Frontend Integration
- **app/dashboard/subscription/page.tsx** - Updated with Stripe checkout functionality

## What You Need to Do

### Step 1: Install Stripe Packages
Run these commands:
```
bash
npm install stripe @stripe/stripe-js
```

### Step 2: Configure Environment Variables
Copy .env.example to .env.local and fill in your Stripe keys:
```
bash
cp .env.example .env.local
```

Edit .env.local with your actual Stripe credentials:
- `STRIPE_SECRET_KEY` - Get from Stripe Dashboard → Developers → API Keys
- `STRIPE_WEBHOOK_SECRET` - Get from Stripe Dashboard → Webhooks
- `STRIPE_PRO_PRICE_ID` - Create in Stripe Dashboard → Products
- `STRIPE_ENTERPRISE_PRICE_ID` - Create in Stripe Dashboard → Products

### Step 3: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products → Add Product
3. Create "Pro" plan:
   - Name: Pro Monthly
   - Price: £29/month (recurring)
   - Get the price ID (starts with price_xxx)
4. Create "Enterprise" plan:
   - Name: Enterprise Monthly
   - Price: £99/month (recurring)
   - Get the price ID

### Step 4: Set Up Webhook

1. Go to Stripe Dashboard → Webhooks → Add endpoint
2. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Get the webhook signing secret and add to .env.local

### Step 5: Deploy and Test

1. Deploy to Vercel
2. Test the checkout flow:
   - Log in as a professional
   - Go to /dashboard/subscription
   - Click "Upgrade" on Pro or Enterprise
   - Complete the payment
   - Verify the subscription is updated in the database

## How It Works

1. User clicks "Upgrade" on the subscription page
2. handleUpgrade() calls /api/stripe/checkout
3. API creates a Stripe Checkout session
4. User is redirected to Stripe to complete payment
5. After payment, Stripe sends a webhook to /api/stripe/webhook
6. Webhook updates the professional's subscription_tier in the database

## Troubleshooting

### Webhook Not Working?
- Check Stripe Dashboard → Webhooks → Recent events
- Verify the endpoint URL is correct
- Check Vercel function logs for errors

### Price IDs Not Found?
- Make sure the price IDs in lib/stripe.ts match your Stripe Dashboard
- Price IDs start with "price_" not "prod_"

### Subscription Not Updating?
- Check the database profiles table
- Verify the webhook is receiving events
- Check the service_role key has write permissions

## Cost

- Stripe fees: 1.4% + 20p per UK card transaction
- No monthly fee for using Stripe
- Vercel: Free tier sufficient for start
