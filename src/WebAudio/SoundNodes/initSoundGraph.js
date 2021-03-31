import {
  getSoundLoop,
} from '../getSoundLoop';
import {
  generateAudioGraphAndCallbacks,
} from './generateAudioGraphAndCallbacks';

export const initSoundGraph = ({
  audioContext,
  getData,
  waveforms,
  getBeatsInBar = () => 4,
  getOctaveBarLength = () => 8,
  getTonicBarLength = () => 16,
  getOctaveChangeChance = () => 0.25,
  getRootOctaveMax = () => 4,
  getRootOctaveMin = () => 2,
  getScaleType = () => 'major',
  getOctave = () => 3,
}) => {
  const {
    destroy,
    update,
  } = generateAudioGraphAndCallbacks({
    audioContext,
    getData,
    waveforms,
    getBeatsInBar,
    getOctaveBarLength,
    getTonicBarLength,
    getOctaveChangeChance,
    getRootOctaveMax,
    getRootOctaveMin,
    getScaleType,
    getOctave,
  });

  const intervalId = getSoundLoop({
    audioContext,
    getData,
    getBeatsInBar,
    getOctaveBarLength,
    getTonicBarLength,
    getOctaveChangeChance,
    getRootOctaveMax,
    getRootOctaveMin,
    getScaleType,
    getOctave,
    update,
  });

  return () => {
    clearInterval(intervalId);
    destroy();
  };
};
