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
      <h2>Meteoricon Radio </h2>

      <LocaleInput onChange={(e) => {
        setLocale(e.target.value);
      }} />

      <button onClick={play}>
        {playing ? 'Pause' : 'Play'}
      </button>

      <PlayingContext.Provider value={playing}>
        <LocaleContext.Provider value={locale}>
          <DataProvider getDataPromise={locale && playing ? getDataPromise : null}>
            {(dataPromise) => (
              <AudioProvider>
                <PlayerPiano
                  dataPromise={dataPromise}
                  normalizer={normalizer}
                />
              </AudioProvider>
            )}
          </DataProvider>
        </LocaleContext.Provider>
      </PlayingContext.Provider>
    </div>
  );
};
