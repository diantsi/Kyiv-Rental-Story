import chooseSoundUrl from "../../sound/choose_sound.wav";
import menuMusicUrl from "../../sound/menu_background_music.mp3";
import textWritingUrl from "../../sound/text_writing.mp3";
import phoneRingingUrl from "../../sound/phone_ringing.mp3";
import callingSoundUrl from "../../sound/calling_sound.mp3";
import anxiousMusicUrl from "../../sound/anxious_background_music.mp3";
import mainMusicUrl from "../../sound/main_theme_music.mp3";
import positiveMusicUrl from "../../sound/positive_background_music.mp3";
import sadMusicUrl from "../../sound/sad_background_music.mp3";
import type { MusicTrack } from "../story/sceneMusic";

const SCENE_MUSIC_BASE = 0.5;
const MENU_MUSIC_BASE = 0.6;
const SETTINGS_KEY = "kyiv-rental-volume";

type VolumeSettings = { music: number; effects: number };

function loadVolume(): VolumeSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null");
    const clamp = (v: unknown) => (typeof v === "number" ? Math.min(1, Math.max(0, v)) : 1);
    if (raw) return { music: clamp(raw.music), effects: clamp(raw.effects) };
  } catch {
    // storage unavailable or corrupt: use defaults
  }
  return { music: 1, effects: 1 };
}

const volume = loadVolume();
const sceneMusicVolume = () => SCENE_MUSIC_BASE * volume.music;
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
  fade(next, sceneMusicVolume());
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
chooseSound.volume = 0.8 * volume.effects;

const textWriting = new Audio(textWritingUrl);
textWriting.volume = 0.5 * volume.effects;

const menuMusic = new Audio(menuMusicUrl);
menuMusic.loop = true;
menuMusic.volume = MENU_MUSIC_BASE * volume.music;

function play(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  // Browsers reject playback before the first user gesture; ignore that.
  return audio.play().catch(() => false);
}

export function playChooseSound() {
  void play(chooseSound);
}

textWriting.loop = true;

const callingSound = new Audio(callingSoundUrl);
callingSound.volume = 0.8 * volume.effects;
const CALLING_REPEATS = 2;
let callingLeft = 0;
callingSound.addEventListener("ended", () => {
  callingLeft -= 1;
  if (callingLeft > 0) void play(callingSound);
});

/** Plays the single ringback tone three times in a row. */
export function startCallingSound() {
  callingLeft = CALLING_REPEATS;
  void play(callingSound);
}

export function stopCallingSound() {
  callingLeft = 0;
  callingSound.pause();
}

const phoneRinging = new Audio(phoneRingingUrl);
phoneRinging.loop = true;
phoneRinging.volume = 0.8 * volume.effects;

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
  const others = [chooseSound, textWriting, phoneRinging, callingSound,...Object.values(sceneTracks)];
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

export function getVolume(): VolumeSettings {
  return { ...volume };
}

/** Sets music and/or effects volume (0–1), applies it live and saves it. */
export function setVolume(next: Partial<VolumeSettings>) {
  Object.assign(volume, next);
  menuMusic.volume = MENU_MUSIC_BASE * volume.music;
  if (currentTrack) {
    const audio = sceneTracks[currentTrack];
    window.clearInterval(fades.get(audio));
    fades.delete(audio);
    audio.volume = sceneMusicVolume();
  }
  chooseSound.volume = 0.8 * volume.effects;
  textWriting.volume = 0.5 * volume.effects;
  callingSound.volume = 0.8 * volume.effects;
  phoneRinging.volume = 0.8 * volume.effects;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(volume));
  } catch {
    // ignore
  }
}
