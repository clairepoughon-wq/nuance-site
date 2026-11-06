// NUANCE — dit à thank-you.html si le paiement est terminé et son montant.
const stripe = require('./_stripe');

module.exports = async (req, res) => {
  const id = String(req.query.session_id || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return res.status(400).json({ error: 'Invalid session' });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Checkout is not configured' });

  try {
    const session = await stripe('checkout/sessions/' + id);
    return res.status(200).json({ status: session.status, amount: session.amount_total / 100, currency: session.currency });
  } catch (err) {
    console.error('Stripe:', err.message);
    return res.status(404).json({ error: 'Session not found' });
  }
};
