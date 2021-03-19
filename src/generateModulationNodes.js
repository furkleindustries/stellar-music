import {
  defaultModulationRoutings,
} from './defaultModulationRoutings';
import {
  getSoundStateFrame,
} from './getSoundStateFrame';
import {
  ModulationOutputTypes,
} from './ModulationOutputTypes';
import {
  ModulationTypes,
} from './ModulationTypes';
import {
  createWhiteNoiseGenerator,
  createBrownNoiseGenerator,
  createPinkNoiseGenerator,
} from './NoiseGenerators';
import {
  routeModulationToParam,
} from './routeModulationToParam';
import {
  routeModulationToSound,
} from './routeModulationToSound';

export const generateModulationNodes = ({
  audioContext,
  data,
  notes,
  nodes,
}) => {
  const {
    destinations: defaultDests,
    modulators: defaultMods,
  } = defaultModulationRoutings;
  
  const modulators = Object.keys(defaultMods).map((modIdx) => {
    if (defaultMods[modIdx].type === ModulationTypes.ConstantSource) {
      const constantSource = audioContext.createConstantSource();
      constantSource.offset.value = -1;
      return constantSource;
    } else if (defaultMods[modIdx].type === ModulationTypes.External) {
      // ???
    } else if (defaultMods[modIdx].type === ModulationTypes.LFO) {
      const lfo = audioContext.createOscillator();
      lfo.frequency.value = 1;
      lfo.start();
      return lfo;
    } else if (defaultMods[modIdx].type === ModulationTypes.WhiteNoise) {
      return createWhiteNoiseGenerator();
    } else if (defaultMods[modIdx].type === ModulationTypes.BrownNoise) {
      return createBrownNoiseGenerator();
    } else if (defaultMods[modIdx].type === ModulationTypes.PinkNoise) {
      return createPinkNoiseGenerator();
    }

    throw new Error();
  });

  const destinations = Object.keys(defaultDests).map((destIdx, listIdx) => {
    const destination = defaultDests[destIdx];
    const modulator = modulators[listIdx];

    if (destination.type === ModulationOutputTypes.ParameterModulation) {
      routeModulationToParam({
        data,
        modulator,
        destination,
        nodes,
      });
    } else if (destination.type === ModulationOutputTypes.Sound) {
      routeModulationToSound({
        modulator,
        destination,
        nodes,
      });
    }
  });

  return {
    modulators,
    destinations,
  };
};
