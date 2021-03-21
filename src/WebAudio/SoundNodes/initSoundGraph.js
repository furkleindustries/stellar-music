import {
  beginSoundLoop,
} from '../beginSoundLoop';
import {
  generateAudioGraphAndCallbacks,
} from './generateAudioGraphAndCallbacks';

export const initSoundGraph = ({
  audioContext,
  data,
  registerModulationNodes,
  waveforms,
}) => {
  const callbacks = generateAudioGraphAndCallbacks({
    audioContext,
    data,
    registerModulationNodes,
    waveforms,
  });

  const {
    destroy,
    getBpm,
    update,
  } = callbacks;

  const intervalId = beginSoundLoop({
    audioContext,
    data,
    getBpm,
    update,
  });

  return () => {
    clearInterval(intervalId);
    destroy();
  };
};
