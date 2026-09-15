const events = {
  welcome: {
    title: 'Boas-vindas',
    text: 'Oi, eu sou a Lilypad! Que bom ter você aqui. Vamos brincar?',
    hint: 'tela tocada · voz de boas-vindas',
    audio: 'assets/audio/lilypad-welcome.mp3',
    target: 'playfield',
  },
  playday: {
    title: 'Dia de brincadeiras',
    text: 'Tenha um excelente dia de brincadeiras! Vai ser muito divertido.',
    hint: 'olho esquerdo · mensagem alegre',
    audio: 'assets/audio/lilypad-playday.mp3',
    target: 'leftEye',
  },
  missed: {
    title: 'Saudade',
    text: 'Eu senti sua falta! Ainda bem que você voltou.',
    hint: 'olho direito · mensagem carinhosa',
    audio: 'assets/audio/lilypad-missed.mp3',
    target: 'rightEye',
  },
  tomorrow: {
    title: 'Até amanhã',
    text: 'Amanhã nós brincamos mais. Até logo, amiguinha!',
    hint: 'boca · despedida fofinha',
    audio: 'assets/audio/lilypad-tomorrow.mp3',
    target: 'mouth',
  },
};

const ui = {
  playfield: document.querySelector('#playfield'),
  face: document.querySelector('#face'),
  leftEye: document.querySelector('#leftEye'),
  rightEye: document.querySelector('#rightEye'),
  mouth: document.querySelector('#mouth'),
  messageText: document.querySelector('#messageText'),
  messageHint: document.querySelector('#messageHint'),
  nowPlaying: document.querySelector('.now-playing'),
  sparkles: document.querySelector('#sparkles'),
  soundToggle: document.querySelector('#soundToggle'),
  aboutToggle: document.querySelector('#aboutToggle'),
  aboutPanel: document.querySelector('#aboutPanel'),
  closeAbout: document.querySelector('#closeAbout'),
  panelBackdrop: document.querySelector('#panelBackdrop'),
  eventRows: [...document.querySelectorAll('.event-row')],
};

const audioState = {
  muted: localStorage.getItem('lilypad-muted') === '1',
  current: null,
};

function chooseVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const preferredNames = /(female|maria|francisca|helena|luciana|vitoria|vitória|leticia|google português|google português brasil)/i;
  return voices.find((voice) => voice.lang.toLowerCase() === 'pt-br' && preferredNames.test(voice.name))
    || voices.find((voice) => voice.lang.toLowerCase() === 'pt-br')
    || voices.find((voice) => voice.lang.toLowerCase().startsWith('pt'))
    || null;
}

function speakFallback(text) {
  if (audioState.muted || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = .94;
  utterance.pitch = 1.22;
  const voice = chooseVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => setTalking(true);
  utterance.onend = () => setTalking(false);
  utterance.onerror = () => setTalking(false);
  window.speechSynthesis.speak(utterance);
}

function playVoice(event) {
  if (audioState.muted) return;
  if (audioState.current) {
    audioState.current.pause();
    audioState.current.currentTime = 0;
  }

  const clip = new Audio(event.audio);
  audioState.current = clip;
  clip.volume = .95;
  clip.addEventListener('play', () => setTalking(true), { once: true });
  clip.addEventListener('ended', () => setTalking(false));
  clip.addEventListener('error', () => {
    setTalking(false);
    speakFallback(event.text);
  }, { once: true });
  clip.play().catch(() => speakFallback(event.text));
}

function setTalking(talking) {
  if (ui.mouth) ui.mouth.classList.toggle('is-talking', talking);
  if (ui.nowPlaying) ui.nowPlaying.classList.toggle('is-speaking', talking);
}

function burst() {
  const glyphs = ['✦', '·', '✧', '•'];
  for (let index = 0; index < 8; index += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = glyphs[index % glyphs.length];
    sparkle.style.left = `${38 + Math.random() * 24}%`;
    sparkle.style.top = `${44 + Math.random() * 13}%`;
    sparkle.style.animationDelay = `${index * 25}ms`;
    ui.sparkles.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
  }
}

function animateFace() {
  ui.face.classList.remove('is-celebrating');
  void ui.face.offsetWidth;
  ui.face.classList.add('is-celebrating');
  window.setTimeout(() => ui.face.classList.remove('is-celebrating'), 700);
}

function triggerEvent(key) {
  const event = events[key];
  if (!event) return;
  if (ui.messageText) ui.messageText.textContent = event.text;
  if (ui.messageHint) ui.messageHint.textContent = `${event.hint} · ${event.title.toLowerCase()}`;
  ui.eventRows.forEach((row) => row.classList.toggle('is-active', row.dataset.event === key));
  animateFace();
  burst();
  playVoice(event);
}

function setLook(clientX, clientY) {
  const rect = ui.playfield.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * .48;
  const lookX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width * .42)));
  const lookY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height * .48)));
  ui.face.style.setProperty('--look-x', lookX.toFixed(3));
  ui.face.style.setProperty('--look-y', lookY.toFixed(3));
}

function resetLook() {
  ui.face.style.setProperty('--look-x', '0');
  ui.face.style.setProperty('--look-y', '0');
}

function blink() {
  const eyes = [ui.leftEye, ui.rightEye];
  const eye = eyes[Math.floor(Math.random() * eyes.length)];
  eye.classList.add('is-blinking');
  window.setTimeout(() => eye.classList.remove('is-blinking'), 190);
}

function setMuted(muted) {
  audioState.muted = muted;
  localStorage.setItem('lilypad-muted', muted ? '1' : '0');
  if (ui.soundToggle) {
    ui.soundToggle.classList.toggle('is-muted', muted);
    ui.soundToggle.setAttribute('aria-pressed', String(muted));
    ui.soundToggle.setAttribute('aria-label', muted ? 'Ligar som' : 'Desligar som');
    const soundLabel = ui.soundToggle.querySelector('.sound-label');
    if (soundLabel) soundLabel.textContent = muted ? 'som desligado' : 'som ligado';
  }
  if (muted) {
    if (audioState.current) audioState.current.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setTalking(false);
  }
}

function setAbout(open) {
  ui.aboutPanel.classList.toggle('is-open', open);
  ui.aboutPanel.setAttribute('aria-hidden', String(!open));
  ui.aboutToggle.setAttribute('aria-expanded', String(open));
  ui.panelBackdrop.hidden = !open;
  if (open) ui.closeAbout.focus();
}

ui.playfield.addEventListener('pointermove', (event) => setLook(event.clientX, event.clientY));
ui.playfield.addEventListener('pointerleave', resetLook);
ui.playfield.addEventListener('click', (event) => {
  if (!event.target.closest('.interactive-face')) triggerEvent('welcome');
});
ui.playfield.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.interactive-face')) {
    event.preventDefault();
    triggerEvent('welcome');
  }
});
ui.leftEye.addEventListener('click', (event) => { event.stopPropagation(); triggerEvent('playday'); });
ui.rightEye.addEventListener('click', (event) => { event.stopPropagation(); triggerEvent('missed'); });
ui.mouth.addEventListener('click', (event) => { event.stopPropagation(); triggerEvent('tomorrow'); });
ui.eventRows.forEach((row) => row.addEventListener('click', () => triggerEvent(row.dataset.event)));
if (ui.soundToggle) ui.soundToggle.addEventListener('click', () => setMuted(!audioState.muted));
if (ui.aboutToggle) ui.aboutToggle.addEventListener('click', () => setAbout(true));
if (ui.closeAbout) ui.closeAbout.addEventListener('click', () => setAbout(false));
if (ui.panelBackdrop) ui.panelBackdrop.addEventListener('click', () => setAbout(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setAbout(false);
});

setMuted(audioState.muted);
window.setInterval(blink, 4200);
window.setTimeout(blink, 1700);
if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = chooseVoice;
