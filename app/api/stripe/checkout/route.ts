import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, email, proId } = body;

    if (!priceId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, email' },
        { status: 400 }
      );
    }

    // Get the correct price ID based on the plan
    let stripePriceId: string;
    switch (priceId) {
      case 'pro':
        stripePriceId = STRIPE_PRICES.pro_monthly;
        break;
      case 'enterprise':
        stripePriceId = STRIPE_PRICES.enterprise_monthly;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid price ID' },
          { status: 400 }
        );
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: STRIPE_SUCCESS_URL,
      cancel_url: STRIPE_CANCEL_URL,
      metadata: {
        pro_id: proId || '',
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Get subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const customer = customers.data[0];

    // Get subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = subscriptions.data[0];

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0]?.price.id,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
