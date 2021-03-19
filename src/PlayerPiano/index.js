import {
  ModMatrix,
} from '../ModMatrix';
import {
  Oscillators,
} from '../Oscillators';
import {
  PlayingContext,
} from '../PlayingContext';
import {
  ReactAudioContext,
} from '../AudioProvider';

import React from 'react';

export const PlayerPiano = (props) => {
  const {
    dataPromise,
    defaults = {},
    normalizer,
    notes,
  } = (props || { defaults: {} });

  if (!dataPromise) {
    return null;
  }

  const [ loaded, setLoaded ] = React.useState(false);
  const [ data, setData ] = React.useState(null);

  const audioContext = React.useContext(ReactAudioContext);
  if (!loaded) {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  
    dataPromise.then(
      (response) => {
        const normalized = normalizer(response);
        setData(normalized);
        setLoaded(true);
      },

      (err) => {
        console.error(err);
      },
    );
  }

  return (
    <div>
      <PlayingContext.Consumer>
        {(playing) => (
          playing && loaded ?
            <Oscillators
              defaults={defaults}
              notes={notes}
              data={data}
            /> :
            null
        )}
      </PlayingContext.Consumer>

      <ModMatrix />
    </div>
  );
};
