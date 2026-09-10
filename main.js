function tick() {
  trackGoodTime();
  removeLeftoverSkipUI();
  removeInterstitialAd();
  removeFeedAds();
  removeShortsShelf();
  removeShortsFeedItems();
  restoreTimeIfNeeded();
  restoreFullscreenIfNeeded(); 
}


setInterval(tick, 500);


// one-time setup, not part of the repeating loop
feedObserver.observe(document.body, { childList: true, subtree: true });
hideShortsNavButton();
setTimeout(hideShortsNavButton, 2000);


watchForAdStart();
restoreTimeIfNeeded();
restoreFullscreenIfNeeded();