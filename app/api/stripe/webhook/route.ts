import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

// Map Stripe price IDs to subscription tiers
const getTierFromPriceId = (priceId: string): string => {
  if (priceId.includes('pro')) return 'pro';
  if (priceId.includes('enterprise')) return 'enterprise';
  if (priceId.includes('basic')) return 'basic';
  return 'free';
};

export async function POST(request: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook secret is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get customer email from session
        const customerEmail = session.customer_email;
        const subscriptionId = session.subscription;

        if (customerEmail && subscriptionId) {
          // Get subscription details to determine the tier
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          const priceId = subscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId);

          // Update the professional's subscription tier
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('email', customerEmail);

          if (error) {
            console.error('Failed to update subscription:', error);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string) as { email?: string };
        
        if (customer && customer.email) {
          const priceId = subscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId);

          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('email', customer.email);

          if (error) {
            console.error('Failed to update subscription:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string) as { email?: string };
        
        if (customer && customer.email) {
          // Downgrade to free
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_expires_at: null,
            })
            .eq('email', customer.email);

          if (error) {
            console.error('Failed to downgrade subscription:', error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(invoice.customer as string) as { email?: string };
        
        if (customer && customer.email) {
          // Could send an email notification here
          console.log(`Payment failed for customer: ${customer.email}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
