import { useCallback } from 'react';

const useSound = (soundFile: string) => {
  const playSound = useCallback(() => {
    try {
      const audio = new Audio(soundFile);
      audio.play().catch(e => console.error("Error playing sound:", e));
    } catch (e) {
      console.error("Could not play sound", e);
    }
  }, [soundFile]);

  return playSound;
};

export default useSound;
