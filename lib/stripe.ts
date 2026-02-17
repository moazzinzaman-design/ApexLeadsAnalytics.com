import Stripe from 'stripe';

// Initialize Stripe with your secret key
// You need to set STRIPE_SECRET_KEY in your environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20', // Use the latest API version
});

// Your price IDs from Stripe Dashboard
// These need to be created in your Stripe Dashboard
export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  enterprise_monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
};

// Your Stripe webhook secret
// This is set in your Stripe Dashboard webhook settings
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Success and cancel URLs
export const STRIPE_SUCCESS_URL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`
  : 'http://localhost:3000/dashboard/subscription?success=true';

export const STRIPE_CANCEL_URL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`
  : 'http://localhost:3000/dashboard/subscription?canceled=true';
