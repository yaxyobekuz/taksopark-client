// States
let globalVolume = 1;
const audioCache = new Map();

// Data
import { soundCatalog } from "../data/sounds.data";

const normalizeToArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (value) return [value];
  return [];
};

export const getSounds = ({ category, sentiment } = {}) => {
  const sentiments = normalizeToArray(sentiment);

  return soundCatalog.filter((item) => {
    const categoryMatch = category ? item.category === category : true;
    const sentimentMatch = sentiments.length
      ? sentiments.includes(item.sentiment)
      : true;

    return categoryMatch && sentimentMatch;
  });
};

export const getSoundById = (id) => {
  if (!id) return null;
  return soundCatalog.find((item) => item.id === id) || null;
};

export const getRandomSound = (sounds) => {
  if (!Array.isArray(sounds) || sounds.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * sounds.length);
  return sounds[randomIndex] || null;
};

export const getRandomSoundByFilters = (filters = {}) => {
  const sounds = getSounds(filters);
  return getRandomSound(sounds);
};

export const preloadSound = (id) => {
  if (typeof window === "undefined") return null;

  const sound = getSoundById(id);
  if (!sound?.src) return null;

  if (audioCache.has(id)) return audioCache.get(id);

  const audio = new Audio(sound.src);
  audio.preload = "auto";
  audioCache.set(id, audio);
  return audio;
};

export const preloadAllSounds = () => {
  soundCatalog.forEach((sound) => preloadSound(sound.id));
};

export const setGlobalVolume = (volume) => {
  globalVolume = Math.min(1, Math.max(0, volume));
};

export const getGlobalVolume = () => globalVolume;

export const playSound = (id, { volume } = {}) => {
  if (typeof window === "undefined") return null;

  const sound = getSoundById(id);
  if (!sound?.src) return null;

  let audio = audioCache.get(id);
  if (!audio) {
    audio = new Audio(sound.src);
    audioCache.set(id, audio);
  }

  const instance = audio.cloneNode();
  instance.volume = Math.min(1, Math.max(0, volume ?? globalVolume));
  instance.play().catch(() => {});
  return instance;
};

export const playRandomSound = ({ category, sentiment, volume } = {}) => {
  const sound = getRandomSoundByFilters({ category, sentiment });
  if (!sound) return null;
  return playSound(sound.id, { volume });
};
