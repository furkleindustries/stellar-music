import {
  initSoundGraph,
} from '../WebAudio/SoundNodes/initSoundGraph';
import {
  ModMatrix,
} from '../ModMatrix';
import {
  PlayingContext,
} from '../WebAudio/PlayingContext';
import {
  ReactAudioContext,
} from '../WebAudio/ReactAudioContext';

import React from 'react';

export const PlayerPiano = ({
  dataPromise,
  normalizer,
}) => {
  if (!dataPromise) {
    return null;
  }

  const [ loaded, setLoaded ] = React.useState(false);
  let [ data, setData ] = React.useState(null);

  const audioContext = React.useContext(ReactAudioContext);
  React.useEffect(() => {
    if (!loaded) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    
      dataPromise.then(
        (response) => {
          const normalized = normalizer(response);
          data = normalized;
          const getData = () => data;

          setData(normalized);
          setLoaded(true);
  
          const destroy = initSoundGraph({
            audioContext,
            getData,
            waveforms: [
              'square',
              'sawtooth',
              'triangle',
              'sine',
              'triangle',
              'sawtooth',
              'square',
            ],
          });
        },
  
        (err) => {
          console.error(err);
        },
      );
    }
  }, []);

  return (
    <div>
      <PlayingContext.Consumer>
        {(playing) => (
          playing && loaded ?
            <p>Now playing!</p> :
            null
        )}
      </PlayingContext.Consumer>

      <ModMatrix />
    </div>
  );
};
