// removes add in the feed
function removeFeedAds() {
  const adSelectors = [
    'ytd-display-ad-renderer',
    'ytd-promoted-sparkles-web-renderer',
    'ytd-promoted-video-renderer',
    'ytd-ad-slot-renderer'
  ];

  let removedCount = 0;
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const wrapper = el.closest('ytd-rich-item-renderer') || el;
      wrapper.remove();
      removedCount++;
    });
  });
  if (removedCount > 0) {
    console.log('[FeedAds] removed', removedCount, 'ad element(s)');
  }
}


const feedObserver = new MutationObserver(() => {
  removeFeedAds();
});

feedObserver.observe(document.body, { childList: true, subtree: true });