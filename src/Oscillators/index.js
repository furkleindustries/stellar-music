import {
  ReactAudioContext,
} from '../AudioProvider';
import {
  initSoundGraph,
} from '../initSoundGraph';

import React from 'react';

export const Oscillators = ({
  data,
  defaults,
  notes,
  registerModulationNodes,
}) => {
  const audioContext = React.useContext(ReactAudioContext);
  
  React.useEffect(initSoundGraph({
    audioContext,
    defaults,
    data,
    notes,
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
