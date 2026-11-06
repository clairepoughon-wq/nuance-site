// NUANCE — crée la session de paiement affichée dans checkout.html.
// Variables Vercel : STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_ID, STRIPE_EXPRESS_PRICE_ID
const stripe = require('./_stripe');

// Sur une adresse de test Vercel, on revient sur cette même adresse après le paiement
const SITE_URL = process.env.VERCEL_ENV === 'preview'
  ? 'https://' + (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL)
  : process.env.SITE_URL || 'https://www.nuancecoloranalysis.com';

const productOf = (price) => ({
  name: price.product.name,
  description: price.product.description,
  amount: price.unit_amount,
  currency: price.currency,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_ID, STRIPE_EXPRESS_PRICE_ID } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY || !STRIPE_PRICE_ID || !STRIPE_EXPRESS_PRICE_ID) {
    return res.status(503).json({ error: 'Checkout is not configured' });
  }

  const { first_name, last_name, email } = req.body || {};
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    // Titres, sous-titres et prix viennent de Stripe, pas du site
    const [main, express, session] = await Promise.all([
      stripe(`prices/${STRIPE_PRICE_ID}?expand[]=product`),
      stripe(`prices/${STRIPE_EXPRESS_PRICE_ID}?expand[]=product`),
      stripe('checkout/sessions', new URLSearchParams({
        mode: 'payment',
        ui_mode: 'elements',
        locale: 'en',
        return_url: SITE_URL + '/thank-you.html?session_id={CHECKOUT_SESSION_ID}',
        'line_items[0][price]': STRIPE_PRICE_ID,
        'line_items[0][quantity]': '1',
        // Stripe adapte la devise au pays de la cliente
        'adaptive_pricing[enabled]': 'true',
        'metadata[first_name]': String(first_name || '').slice(0, 100),
        'metadata[last_name]': String(last_name || '').slice(0, 100),
        integration_identifier: 'nuance_elements_v1',
      })),
    ]);
    return res.status(200).json({
      clientSecret: session.client_secret,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      products: { main: productOf(main), express: productOf(express) },
    });
  } catch (err) {
    console.error('Stripe:', err.message);
    return res.status(502).json({ error: 'Stripe error' });
  }
};
