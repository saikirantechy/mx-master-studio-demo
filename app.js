const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$$('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(element => observer.observe(element));

$$('.filter').forEach(button => {
  button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.product-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

$$('.heart').forEach(button => {
  button.addEventListener('click', () => {
    button.textContent = button.textContent === '♡' ? '♥' : '♡';
    button.setAttribute('aria-pressed', button.textContent === '♥');
  });
});

const descriptions = {
  'MX Master 3S': 'Quiet clicks, an ultra-precise MagSpeed wheel and Flow support for moving seamlessly between computers.',
  'MX Keys S': 'Smart illumination, low-profile keys and multi-device connection for a focused typing experience.',
  'MX Creative Console': 'A customizable keypad and dial set designed to put creative tools and actions close at hand.'
};
const dialog = $('#productDialog');
$$('.round-button').forEach(button => {
  button.addEventListener('click', () => {
    $('#dialogTitle').textContent = button.dataset.product;
    $('#dialogDescription').textContent = descriptions[button.dataset.product];
    dialog.showModal();
  });
});
$('.dialog-close').addEventListener('click', () => dialog.close());
$('.dialog-action').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingRect?.();
  if (event.target === dialog) dialog.close();
});

$$('.feature').forEach(button => {
  button.addEventListener('click', () => {
    $$('.feature').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const cursor = $('.cursor');
    const positions = { flow: ['48%', '44%'], transfer: ['62%', '38%'], charge: ['39%', '58%'] };
    const [left, top] = positions[button.dataset.feature];
    cursor.style.left = left;
    cursor.style.top = top;
  });
});

$('#fullscreenButton').addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.();
    $('#fullscreenButton').textContent = 'Exit';
  } else {
    await document.exitFullscreen?.();
    $('#fullscreenButton').textContent = 'Fullscreen';
  }
});

document.addEventListener('fullscreenchange', () => {
  $('#fullscreenButton').textContent = document.fullscreenElement ? 'Exit' : 'Fullscreen';
});

const placeholder = $('#videoPlaceholder');
const video = $('#demoVideo');
const frame = $('#demoFrame');
let localVideoUrl = null;

function toEmbedUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  let videoId = '';
  if (parsed.hostname.includes('youtu.be')) {
    videoId = parsed.pathname.slice(1).split('/')[0];
  } else if (parsed.hostname.includes('youtube.com')) {
    videoId = parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || '';
  }

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : url;
}

const demoVideos = {
  demo: 'https://www.youtube.com/watch?v=PyB191uRES8',
  master: 'https://www.youtube.com/watch?v=9CLGENaxA8Q',
  keys: ''
};

function loadEmbeddedVideo(url, title) {
  placeholder.hidden = true;
  video.pause();
  video.hidden = true;
  video.removeAttribute('src');
  frame.hidden = false;
  frame.src = toEmbedUrl(url);
  placeholder.querySelector('div').innerHTML = `<strong>${title}</strong><small>MX product film</small>`;
}

function showPlaceholder() {
  placeholder.hidden = false;
  video.hidden = true;
  frame.hidden = true;
}

function playLocal() {
  placeholder.hidden = true;
  frame.hidden = true;
  video.hidden = false;
  video.play().catch(() => {});
}

$('#playButton').addEventListener('click', () => {
  if (video.src) {
    playLocal();
  } else {
    loadEmbeddedVideo(demoVideos.demo, 'Introducing Logitech MX Master 4');
  }
});

$('#videoFile').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
  localVideoUrl = URL.createObjectURL(file);
  frame.hidden = true;
  frame.removeAttribute('src');
  video.src = localVideoUrl;
  placeholder.hidden = true;
  video.hidden = false;
});

$('#applyVideo').addEventListener('click', () => {
  const url = $('#videoUrl').value.trim();
  if (!url) return;
  video.pause();
  video.removeAttribute('src');
  video.hidden = true;
  placeholder.hidden = true;
  frame.hidden = false;
  frame.src = toEmbedUrl(url);
  $('#videoUrl').value = url;
});

$('#adminToggle').addEventListener('click', () => {
  const panel = $('#adminPanel');
  panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', panel.classList.contains('open') ? 'false' : 'true');
});

$$('.demo-chip').forEach(button => {
  button.addEventListener('click', () => {
    $$('.demo-chip').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    video.pause();
    frame.hidden = true;
    frame.removeAttribute('src');
    if (localVideoUrl) {
      video.src = localVideoUrl;
      video.hidden = false;
      placeholder.hidden = true;
    } else if (demoVideos[button.dataset.video]) {
      loadEmbeddedVideo(demoVideos[button.dataset.video], button.textContent.trim());
    } else {
      showPlaceholder();
      placeholder.querySelector('div').innerHTML = `<strong>${button.textContent}</strong><small>Upload a local MP4 or apply a hosted video in demo settings ⚙</small>`;
    }
  });
});

const luckyForm = $('#luckyForm');
const entryCount = $('#entryCount');
const formMessage = $('#formMessage');

function readLuckyEntries() {
  try {
    return JSON.parse(localStorage.getItem('mxLuckyEntries') || '[]');
  } catch {
    return [];
  }
}

function refreshEntryCount() {
  entryCount.textContent = String(readLuckyEntries().length);
}

luckyForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(luckyForm);
  const entry = {
    name: data.get('name').trim(),
    email: data.get('email').trim(),
    phone: data.get('phone').trim(),
    feedback: data.get('feedback').trim(),
    consent: data.get('consent') === 'on',
    submittedAt: new Date().toISOString()
  };

  const entries = readLuckyEntries();
  entries.push(entry);
  localStorage.setItem('mxLuckyEntries', JSON.stringify(entries));
  refreshEntryCount();
  luckyForm.reset();
  formMessage.textContent = 'You’re entered! Good luck.';
});

refreshEntryCount();

window.addEventListener('beforeunload', () => {
  if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
});
