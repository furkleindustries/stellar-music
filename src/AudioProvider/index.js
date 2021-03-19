import {
  ModulationContext,
} from '../ModulationContext';
import {
  ReactAudioContext,
} from '../ReactAudioContext';

import React from 'react';

export const AudioProvider = (children) => {
  const [ modulationState, setModulationState ] = [];

  const audioCtx = getAudioContext();

  <ReactAudioContext.Provider value={audioCtx}>
    <ModulationContext.Provider value={modulationState}>
      {React.cloneElement(
        children,
        { registerModulationNodes: setModulationState },
      )}
    </ModulationContext.Provider>
  </ReactAudioContext.Provider>
};
