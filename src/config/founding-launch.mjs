// Standalone introductory price; the approved standard scope in offer.mjs is unchanged.
// This does not authorize email sending, payment collection, or automatic acceptance.
export const foundingLaunch = Object.freeze({
  name: 'Founding Client Launch Offer',
  totalUSD: 299,
  depositUSD: 150,
  balanceUSD: 149,
  eligible: 'New website projects agreed in writing while this launch offer is published',
  requiresWrittenAcceptance: true,
  automaticallyCharges: false,
  expiresAt: null,
});
if (foundingLaunch.depositUSD + foundingLaunch.balanceUSD !== foundingLaunch.totalUSD) {
  throw new Error('Invalid launch payment split');
}
