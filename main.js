// main loop
function tick() {
  if (isAdShowing()) {
    skipAd();
  }
  removeLeftoverSkipUI();
  removeInterstitialAd();
  removeFeedAds();
  removeShortsShelf();
}

console.log('[AdSkipper] content script loaded');

setInterval(tick, 500);

// one-time setup, not part of the repeating loop
feedObserver.observe(document.body, { childList: true, subtree: true });
hideShortsNavButton();
setTimeout(hideShortsNavButton, 2000);