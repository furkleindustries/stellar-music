import {
  ReactAudioContext,
} from '../WebAudio/ReactAudioContext';
import {
  initSoundGraph,
} from '../WebAudio/SoundNodes/initSoundGraph';

import React from 'react';

export const Oscillators = ({
  data,
  defaults,
  registerModulationNodes,
}) => {
  const audioContext = React.useContext(ReactAudioContext);
  
  React.useEffect(initSoundGraph({
    audioContext,
    defaults,
    data,
    registerModulationNodes,
    waveforms: [
      'sine',
      'triangle',
      'square',
      'sawtooth',
    ],
  }));

  return null;
};
