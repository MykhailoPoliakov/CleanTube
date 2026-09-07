// shorts button
function hideShortsNavButton() {
  document.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
    const title = entry.querySelector('yt-formatted-string.title');
    if (title && title.textContent.trim() === 'Shorts') {
      entry.style.display = 'none';
    }
  });
}

// shorts in feed
function removeShortsShelf() {
  document.querySelectorAll('ytd-rich-shelf-renderer').forEach(el => {
    if (el.querySelector('[aria-label*="Shorts"]') || el.textContent.includes('Shorts')) {
      el.remove();
    }
  });
}




