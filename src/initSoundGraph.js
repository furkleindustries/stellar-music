import {
  beginSoundLoop,
} from './beginSoundLoop';
import {
  generateAudioGraphAndCallbacks,
} from './generateAudioGraphAndCallbacks';

export const initSoundGraph = ({
  audioContext,
  data,
  notes,
  registerModulationNodes,
  waveforms,
}) => {
  const callbacks = generateAudioGraphAndCallbacks({
    audioContext,
    data,
    notes,
    registerModulationNodes,
    waveforms,
  });

  const intervalId = beginSoundLoop({
    audioContext,
    data,
    notes,
    registerModulationNodes,
  });

  return () => {
    clearInterval(intervalId);
    callbacks.forEach(({ destroy }) => destroy());
  };
};
