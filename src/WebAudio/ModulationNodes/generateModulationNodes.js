import {
  defaultModulationRoutings,
} from './defaultModulationRoutings';
import {
  getDataSelector,
} from './getDataSelector';
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
  nodes,
}) => {
  const {
    destinations: defaultDests,
    modulators: defaultMods,
  } = defaultModulationRoutings;
  
  const modulators = Object.keys(defaultMods).map((modIdx) => {
    const currentMod = defaultMods[modIdx];
    currentMod.id = modIdx;
    const modType = currentMod.type;
    let node = null;
    if (defaultMods[modIdx].type === ModulationTypes.ConstantSource) {
      const constantSource = audioContext.createConstantSource();
      constantSource.offset.value = -1;
      node = constantSource;
    } else if (modType === ModulationTypes.Extern) {
      console.log('TODO: implement Extern routing');
      return null;
    } else if (modType === ModulationTypes.LFO) {
      const lfo = audioContext.createOscillator();
      lfo.frequency.value = 1;
      lfo.start();
      node = lfo;
    } else if (modType === ModulationTypes.WhiteNoise) {
      node = createWhiteNoiseGenerator(audioContext);
    } else if (modType === ModulationTypes.BrownNoise) {
      node = createBrownNoiseGenerator(audioContext);
    } else if (modType === ModulationTypes.PinkNoise) {
      node = createPinkNoiseGenerator(audioContext);
    }

    return {
      ...currentMod,
      node,
    };
  }).filter(Boolean);

  const destinations = Object.keys(defaultDests).map((destIdx, listIdx) => {
    const destination = defaultDests[destIdx];
    destination.id = destIdx;
    const modulator = modulators[listIdx];

    if (!destination ||
      !destination.output ||
      !modulator ||
      modulator.type === ModulationTypes.Extern)
    {
      return null;
    }

     if (destination.type === ModulationOutputTypes.ParameterModulation ||
      destination.type === ModulationOutputTypes.Extern)
    {
      const dataSelector = getDataSelector({
        data,
        destination,
        modulator,
      });

      routeModulationToParam({
        data,
        dataSelector,
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

    return destination;
  }).filter(Boolean);

  return {
    modulators,
    destinations,
  };
};
