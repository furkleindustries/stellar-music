import {
  getAudioContext,
} from './getAudioContext';
import {
  ModulationContext,
} from '../WebAudio/ModulationNodes/ModulationContext';
import {
  ReactAudioContext,
} from '../WebAudio/ReactAudioContext';

import React from 'react';

export const AudioProvider = ({ children }) => {
  const [ modulationState, setModulationState ] = [];

  const audioCtx = getAudioContext();

  return (
    <ReactAudioContext.Provider value={audioCtx}>
      <ModulationContext.Provider value={modulationState}>
        {React.cloneElement(
          children,
          { registerModulationNodes: setModulationState },
        )}
      </ModulationContext.Provider>
    </ReactAudioContext.Provider>
  );
};
