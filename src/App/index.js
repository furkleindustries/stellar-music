import {
  AudioProvider,
} from '../AudioProvider';
import {
  DataProvider,
} from '../DataProvider';
import {
  getDataPromise,
} from '../DataProvider/getDataPromise';
import {
  LocaleContext,
} from '../DataProvider/LocaleContext';
import {
  LocaleInput,
} from '../LocaleInput';
import {
  PlayerPiano,
} from '../PlayerPiano';
import {
  PlayingContext,
} from '../WebAudio/PlayingContext';

import React from 'react';

export const App = ({
  normalizer = (val) => val.ob,
}) => {
  const [ playing, setPlaying ] = React.useState(false);

  const play = () => {
    setPlaying(!playing);
  };

  const [ locale, setLocale ] = React.useState('philadelphia,pa');

  return (
    <div>
      <h2>Stellar Radio</h2>

      <LocaleInput
        onChange={(e) => {
          setLocale(e.target.value);
        }}

        onKeyPress={({ key }) => {
          if (key.toLowerCase() === 'enter') {
            const isPlaying = playing;

            play();

            if (isPlaying) {
              setTimeout(play, 55);
            }
          }
        }}
      />

      <button onClick={play}>
        {playing ? 'Pause' : 'Play'}
      </button>

      <PlayingContext.Provider value={playing}>
        <LocaleContext.Provider value={locale}>
          {locale && playing ? 
            <DataProvider getDataPromise={getDataPromise}>
              {(dataPromise) => (
                <AudioProvider>
                  <PlayerPiano
                    dataPromise={dataPromise}
                    normalizer={normalizer}
                  />
                </AudioProvider>
              )}
            </DataProvider> :
            null}
        </LocaleContext.Provider>
      </PlayingContext.Provider>
    </div>
  );
};
