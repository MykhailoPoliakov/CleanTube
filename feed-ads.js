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


function softReloadPlayer() {
  const player = document.getElementById('movie_player');
  if (!player || typeof player.loadVideoById !== 'function') return;

  const videoData = player.getVideoData();
  const videoId = videoData && videoData.video_id;
  const currentTime = player.getCurrentTime();

  if (videoId) {
    console.log('[VideoAds] soft-reloading player at', currentTime);
    player.loadVideoById(videoId, currentTime);
  }
}

function recoverPlayback() {
  const player = document.getElementById('movie_player');
  if (!player || typeof player.getPlayerState !== 'function') return;
  const state = player.getPlayerState();
  if (state === 3) { // buffering
    softReloadPlayer();
  }
}


let lastGoodTime = 0;
let lastVideoId = null;
let adReloadTriggered = false;

function getVideoIdFromUrl() {
  return new URLSearchParams(window.location.search).get('v');
}

function reloadPastAd() {
  const player = document.getElementById('movie_player');
  if (!player || typeof player.loadVideoById !== 'function') return;
  if (!lastVideoId) return;
  console.log('[VideoAds] reloading player to skip ad:', lastVideoId, 'at', lastGoodTime);
  player.loadVideoById(lastVideoId, lastGoodTime);
}


function reloadPageForAd() {
  const videoId = new URLSearchParams(window.location.search).get('v');
  if (!videoId) return;

  const key = 'adReloadCount:' + videoId;
  const count = parseInt(sessionStorage.getItem(key) || '0', 10);
  if (count >= 5) return;
  sessionStorage.setItem(key, count + 1);

  saveFullscreenState();

  const resumeTime = Math.max(0, Math.floor(lastGoodTime));
  window.location.href = `${window.location.pathname}?v=${videoId}&t=${resumeTime}s`;
}




function trackGoodTime() {
  if (!isAdShowing()) {
    const player = document.getElementById('movie_player');
    if (player && typeof player.getCurrentTime === 'function') {
      lastGoodTime = player.getCurrentTime();
    }
  }
}

function restoreTimeIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const resumeParam = params.get('t');
  if (!resumeParam) return;

  const resumeTime = parseInt(resumeParam.replace('s', ''), 10);
  if (!resumeTime) return;

  const waitForPlayer = setInterval(() => {
    const player = document.getElementById('movie_player');
    if (player && typeof player.seekTo === 'function' && player.getDuration && player.getDuration() > 0) {
      player.seekTo(resumeTime, true);
      clearInterval(waitForPlayer);
    }
  }, 300);

  setTimeout(() => clearInterval(waitForPlayer), 10000); // give up after 10s
}



function saveFullscreenState() {
  sessionStorage.setItem('wasFullscreen', document.fullscreenElement ? '1' : '0');
}

function restoreFullscreenIfNeeded() {
  if (sessionStorage.getItem('wasFullscreen') !== '1') return;
  sessionStorage.removeItem('wasFullscreen');

  const waitForPlayer = setInterval(() => {
    const player = document.getElementById('movie_player');
    if (player) {
      clearInterval(waitForPlayer);
      player.requestFullscreen().catch(err => {
        console.log('[VideoAds] fullscreen restore blocked:', err.message);
      });
    }
  }, 300);

  setTimeout(() => clearInterval(waitForPlayer), 10000);
}



function watchForAdStart() {
  const player = document.querySelector('.html5-video-player');
  if (!player) {
    // player not ready yet, retry shortly
    setTimeout(watchForAdStart, 300);
    return;
  }

  const adObserver = new MutationObserver(() => {
    if (player.classList.contains('ad-showing') && !wasAdShowing) {
      wasAdShowing = true;
      reloadPageForAd();
    } else if (!player.classList.contains('ad-showing')) {
      wasAdShowing = false;
    }
  });

  adObserver.observe(player, { attributes: true, attributeFilter: ['class'] });
}

watchForAdStart();