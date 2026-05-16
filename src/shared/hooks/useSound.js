import { useCallback, useEffect, useRef } from "react";

// Utils
import {
  playSound as playSoundUtil,
  playRandomSound as playRandomSoundUtil,
  preloadSound as preloadSoundUtil,
  preloadAllSounds as preloadAllSoundsUtil,
  setGlobalVolume,
} from "@/shared/utils/sounds.utils";

const useSound = ({ volume = 1, preload = false } = {}) => {
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (preload) {
      preloadAllSoundsUtil();
    }
  }, [preload]);

  const playSound = useCallback((id, options = {}) => {
    return playSoundUtil(id, {
      volume: options.volume ?? volumeRef.current,
    });
  }, []);

  const playRandomSound = useCallback((filters = {}) => {
    return playRandomSoundUtil({
      ...filters,
      volume: filters.volume ?? volumeRef.current,
    });
  }, []);

  const preloadSound = useCallback((id) => {
    return preloadSoundUtil(id);
  }, []);

  const preloadAllSounds = useCallback(() => {
    preloadAllSoundsUtil();
  }, []);

  const setVolume = useCallback((newVolume) => {
    volumeRef.current = Math.min(1, Math.max(0, newVolume));
    setGlobalVolume(volumeRef.current);
  }, []);

  return {
    playSound,
    playRandomSound,
    preloadSound,
    preloadAllSounds,
    setVolume,
  };
};

export default useSound;
