// NUANCE — ajoute ou retire l'option Express de la session de paiement.
const stripe = require('./_stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_EXPRESS_PRICE_ID } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID || !STRIPE_EXPRESS_PRICE_ID) {
    return res.status(503).json({ error: 'Checkout is not configured' });
  }

  const { session_id, express } = req.body || {};
  if (typeof session_id !== 'string' || !/^cs_[A-Za-z0-9_]+$/.test(session_id) || typeof express !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const session = await stripe(`checkout/sessions/${session_id}?expand[]=line_items`);
    const items = session.line_items.data;
    const main = items.find((item) => item.price.id === STRIPE_PRICE_ID);
    const extra = items.find((item) => item.price.id === STRIPE_EXPRESS_PRICE_ID);
    if (session.status !== 'open' || !main) return res.status(409).json({ error: 'Session closed' });
    if (express === Boolean(extra)) return res.status(200).json({ ok: true });

    // Stripe demande la liste complète des articles à chaque mise à jour
    const params = new URLSearchParams({ 'line_items[0][id]': main.id });
    if (express) {
      params.set('line_items[1][price]', STRIPE_EXPRESS_PRICE_ID);
      params.set('line_items[1][quantity]', '1');
    }
    await stripe(`checkout/sessions/${session_id}`, params);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Stripe:', err.message);
    return res.status(502).json({ error: 'Stripe error' });
  }
};
