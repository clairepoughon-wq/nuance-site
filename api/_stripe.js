// NUANCE — appels à l'API Stripe. La clé secrète reste dans Vercel (Settings → Environment Variables).
module.exports = async function stripe(path, params) {
  const r = await fetch('https://api.stripe.com/v1/' + path, {
    method: params ? 'POST' : 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY,
      'Stripe-Version': '2026-10-28.endive',
      ...(params ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: params,
  });
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || 'Stripe error');
  return data;
};
