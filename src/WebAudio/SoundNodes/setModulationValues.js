import {
  getBpm,
} from '../ModulationNodes/getBpm';
import {
  getDataSelector,
} from '../ModulationNodes/getDataSelector';
import {
  ModulationOutputs,
} from '../ModulationNodes/ModulationOutputs';
import {
  updateOscillator,
} from './updateOscillator';

export const setModulationValues = ({
  audioContext,
  barsCounter,
  beatsCounter,
  chord,
  getData,
  getBeatsInBar,
  getOctaveBarLength,
  getTonicBarLength,
  getOctaveChangeChance,
  getRootOctaveMax,
  getRootOctaveMin,
  getScaleType,
  getOctave,
  soundModulators,
  soundDestinations,
  parameterModulators,
  parameterDestinations,
  externalModulators,
  externalDestinations,
  nodes,
}) => {
  const currentTime = audioContext.currentTime;
  const data = getData();
  let bpm = getBpm(data);
  const beatsInBar = getBeatsInBar();
  const beatLength = 60 / bpm;

  Object.values(parameterModulators).forEach((mod) => {
    if (!mod.definition.destination || !mod.definition.input) {
      return;
    }
    
    const dataSelector = getDataSelector(mod, parameterDestinations);
    const value = dataSelector(data);
    const destination = parameterDestinations[mod.definition.destination];
    if (destination) {
      if (destination.output === ModulationOutputs.DelayTime) {
        mod.modulator.offset.value = beatLength * (value / beatsInBar);
      } else {
        mod.modulator.offset.value = value;
      }
    }
  });

  const attackGain = 1;
  const decayGain = 0.9;
  const sustainGain = 0.75;
  const releaseGain = 0.001;
  const wiggleRoom = 0.0625;
  let chordLog = [];
  Object.entries(soundModulators).forEach(([ modIdx, mod ]) => {
    if (!mod.definition.destination) {
      return;
    }

    const dataSelector = getDataSelector(mod, soundDestinations);
    if (modIdx.slice(0, 2) === 'OM') {
      chordLog = updateOscillator({
        audioContext,
        beatLength,
        chord,
        chordLog,
        dataSelector,
        modIdx,
        mod,
        parameterDestinations,
        parameterModulators,
        attackGain,
        decayGain,
        sustainGain,
        releaseGain,
        wiggleRoom,
      }) || chordLog;
    } else {
      let found = false;
      if (mod.amplitudeModulator) {
        found = true;
      }
  
      if (mod.frequencyModulator) {
        found = true;
      }
  
      if (!found && mod.modulator) {
        mod.modulator.offset.value = dataSelector(data);
      }
    }
  });

  Object.values(externalModulators).forEach((mod) => {
    const shouldTick = mod.definition.everyTick || !mod.ticked;
    if (!mod.definition.destination || !shouldTick) {
      return;
    }

    const dataSelector = getDataSelector(mod, externalDestinations);
    const retVal = mod.definition.extern(dataSelector(data));

    externalDestinations[mod.definition.destination].extern({
      bpm,
      chord,
      data: retVal,
      nodes,
    });

    mod.ticked = true;
  });

  console.log(chordLog);
};
