import {
  DataProvider,
} from '../DataProvider';
import {
  getDataPromise,
} from '../getDataPromise';
import {
  LocaleContext,
} from '../LocaleContext';
import {
  LocaleInput,
} from '../LocaleInput';
import {
  notes,
} from '../notes';
import {
  ModulationContext,
} from '../ModulationContext';
import {
  PlayerPiano,
} from '../PlayerPiano';
import {
  PlayingContext,
} from '../PlayingContext';

import React from 'react';

export const App = ({
  normalizer = (val) => val,
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
              <PlayerPiano
                dataPromise={dataPromise}
                normalizer={normalizer}
                notes={notes}
              />
            )}
          </DataProvider>
        </LocaleContext.Provider>
      </PlayingContext.Provider>
    </div>
  );
};
