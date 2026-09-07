// check if ad is active rn
function isAdShowing() {
  const player = document.querySelector('.html5-video-player');
  return player && player.classList.contains('ad-showing');
}

// skip ad
function skipAd() {
  const video = document.querySelector('video');
  if (video && video.duration) {
    video.currentTime = video.duration;
    console.log('[YoutubeAdSkipper] skipped ad at', new Date().toLocaleTimeString());
  }
}


// remove after ad screen
function removeLeftoverSkipUI() {
  const selectors = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-container'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.remove());
  });
}


function removeInterstitialAd() {
  document.querySelectorAll('.ytp-video-interstitial-buttoned-centered-layout').forEach(el => {
    el.closest('.video-ads')?.remove();
  });
}
