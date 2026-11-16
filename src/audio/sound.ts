import chooseSoundUrl from "../../sound/choose_sound.wav";
import menuMusicUrl from "../../sound/menu_background_music.wav";
import textWritingUrl from "../../sound/text_writing.mp3";
import phoneRingingUrl from "../../sound/phone_ringing.mp3";
import anxiousMusicUrl from "../../sound/anxious_background_music.wav";
import mainMusicUrl from "../../sound/main_theme_music.mp3";
import positiveMusicUrl from "../../sound/positive_background_music.mp3";
import sadMusicUrl from "../../sound/sad_background_music.wav";
import type { MusicTrack } from "../story/sceneMusic";

const SCENE_MUSIC_VOLUME = 0.5;
const FADE_MS = 800;

const sceneTracks: Record<MusicTrack, HTMLAudioElement> = {
  main: new Audio(mainMusicUrl),
  anxious: new Audio(anxiousMusicUrl),
  positive: new Audio(positiveMusicUrl),
  sad: new Audio(sadMusicUrl),
};
for (const audio of Object.values(sceneTracks)) audio.loop = true;

let currentTrack: MusicTrack | null = null;
const fades = new Map<HTMLAudioElement, number>();

function fade(audio: HTMLAudioElement, to: number, onDone?: () => void) {
  window.clearInterval(fades.get(audio));
  const from = audio.volume;
  const startedAt = performance.now();
  const timer = window.setInterval(() => {
    const progress = Math.min((performance.now() - startedAt) / FADE_MS, 1);
    audio.volume = from + (to - from) * progress;
    if (progress < 1) return;
    window.clearInterval(timer);
    fades.delete(audio);
    onDone?.();
  }, 40);
  fades.set(audio, timer);
}

/** Crossfades to the given scene track; keeps playing if it is already on. */
export function playSceneMusic(track: MusicTrack) {
  if (track === currentTrack) return;
  if (currentTrack) {
    const old = sceneTracks[currentTrack];
    fade(old, 0, () => old.pause());
  }
  currentTrack = track;
  const next = sceneTracks[track];
  next.volume = 0;
  void play(next);
  fade(next, SCENE_MUSIC_VOLUME);
}

export function stopSceneMusic() {
  for (const audio of Object.values(sceneTracks)) {
    window.clearInterval(fades.get(audio));
    fades.delete(audio);
    audio.pause();
  }
  currentTrack = null;
}

const chooseSound = new Audio(chooseSoundUrl);
chooseSound.volume = 0.8;

const textWriting = new Audio(textWritingUrl);
textWriting.volume = 0.5;

const menuMusic = new Audio(menuMusicUrl);
menuMusic.loop = true;
menuMusic.volume = 0.6;

function play(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  // Browsers reject playback before the first user gesture; ignore that.
  return audio.play().catch(() => false);
}

export function playChooseSound() {
  void play(chooseSound);
}

textWriting.loop = true;

const phoneRinging = new Audio(phoneRingingUrl);
phoneRinging.loop = true;
phoneRinging.volume = 0.8;

/** Loops the ringtone (from the start) while an incoming call is on screen. */
export function startPhoneRinging() {
  void play(phoneRinging);
}

export function stopPhoneRinging() {
  phoneRinging.pause();
}

/** Loops the typing sound while the context sheet types its text. */
export function startTextWriting() {
  void play(textWriting);
}

export function stopTextWriting() {
  textWriting.pause();
}

/**
 * Called from the splash-screen click. Starts the menu music right inside the
 * gesture and silently primes every other sound, so Safari also lets them play later.
 */
export function unlockAudio() {
  void play(menuMusic);
  const others = [chooseSound, textWriting, phoneRinging, ...Object.values(sceneTracks)];
  for (const audio of others) {
    audio.muted = true;
    void audio
      .play()
      .then(() => audio.pause())
      .catch(() => {})
      .finally(() => {
        audio.currentTime = 0;
        audio.muted = false;
      });
  }
}

/** Starts the looping menu music; returns a cleanup that stops it. */
export function startMenuMusic() {
  // Set once the menu is left; nothing may start the music after that.
  let stopped = false;
  const retry = () => {
    if (!stopped && menuMusic.paused) void menuMusic.play().catch(() => {});
  };
  const events = ["pointerdown", "keydown"] as const;

  // Already started by the splash screen: keep playing instead of restarting.
  const started = menuMusic.paused ? play(menuMusic) : Promise.resolve();
  void started.then((result) => {
    // Autoplay was blocked: start on the first interaction instead.
    if (result === false && !stopped) {
      events.forEach((e) => document.addEventListener(e, retry, { once: true }));
    }
  });

  return () => {
    stopped = true;
    events.forEach((e) => document.removeEventListener(e, retry));
    menuMusic.pause();
  };
}
