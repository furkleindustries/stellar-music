import {
  defaultModulationRoutings,
} from './defaultModulationRoutings';
import {
  getCarrier,
} from './getCarrier';
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
  routeModulationToSound,
} from './routeModulationToSound';

export const generateModulationNodes = ({
  audioContext,
  nodes,
}) => {
  const {
    destinations: defaultDests,
    modulators: defaultMods,
  } = defaultModulationRoutings;

  const soundDestinations = {};
  const parameterDestinations = {};
  const externalDestinations = {};
  
  Object.keys(defaultDests).forEach((destIdx) => {
    const currentDest = defaultDests[destIdx];
    const destType = currentDest.type;
    if (destType === ModulationOutputTypes.SoundModulation) {
      soundDestinations[destIdx] = { ...currentDest };
    } else if (destType === ModulationOutputTypes.ParameterModulation) {
      parameterDestinations[destIdx] = { ...currentDest };
    } else if (destType === ModulationOutputTypes.Extern) {
      if (typeof currentDest.extern !== 'function') {
        throw new Error(`Missing extern function from destination ${destIdx}.`);
      }
      
      externalDestinations[destIdx] = { ...currentDest };
    }
  });
  
  const soundModulators = {};
  const parameterModulators = {};
  const externalModulators = {};

  Object.keys(defaultMods).forEach((modIdx) => {
    const currentMod = defaultMods[modIdx];
    const modType = currentMod.type;
    if (modIdx.slice(0, 2) === 'OM') {
      const frequencyModulator = audioContext.createConstantSource();
      frequencyModulator.offset.automationRate = 'k-rate';
      frequencyModulator.offset.value = 440;

      const amplitudeModulator = audioContext.createConstantSource();
      amplitudeModulator.offset.value = 0;

      const oscNodeGroup = nodes.SoundOscillators[Number(modIdx[modIdx.length - 1]) - 1];

      soundModulators[modIdx] = {
        carrier: oscNodeGroup,
        amplitudeModulator,
        frequencyModulator,
        definition: currentMod,
      };

      routeModulationToSound(soundModulators[modIdx]);
    } else if (defaultMods[modIdx].type === ModulationTypes.ConstantSource) {
      const modulator = audioContext.createConstantSource();

      const modContainer = {
        carrier: null,
        modulator,
        definition: currentMod,
      };

      const carrier = getCarrier({
        modContainer,
        nodes,
        parameterDestinations,
      });

      if (carrier) {
        modulator.connect(carrier);
      }

      parameterModulators[modIdx] = {
        ...modContainer,
        carrier,
      };

      modulator.start();
    } else if (modType === ModulationTypes.Extern) {
      if (typeof currentMod.extern !== 'function') {
        throw new Error(`Missing extern function from modulator ${modIdx}.`);
      }

      externalModulators[modIdx] = {
        carrier: null,
        modulator: currentMod.extern,
        definition: currentMod,
      };

      const destIdx = currentMod.destination;
      if (destIdx) {
        if (destIdx in soundDestinations) {
          routeModulationToSound({
            destination: soundDestinations[destIdx],
            modulator: externalModulators[modIdx],
            nodes,
          });
        } else if (destIdx in parameterDestinations) {
          routeModulationToSound({
            destination: parameterDestinations[destIdx],
            modulator: externalModulators[modIdx],
            nodes,
          });
        }
      }
    } else if (modType === ModulationTypes.LFO) {
      const carrier = audioContext.createOscillator();
      carrier.start();

      const gainNode = audioContext.createGain();
      const amplitudeModulator = audioContext.createConstantSource();
      amplitudeModulator.connect(gainNode.gain);
      amplitudeModulator.start();

      const frequencyModulator = audioContext.createConstantSource();
      frequencyModulator.offset.automationRate = 'k-rate';
      frequencyModulator.connect(lfo.frequency);
      frequencyModulator.start();

      parameterModulators[modIdx] = {
        carrier,
        amplitudeModulator,
        frequencyModulator,
        definition: currentMod,
      };
    } else if (modType === ModulationTypes.WhiteNoise) {
      const whiteNoiseGen = createWhiteNoiseGenerator(audioContext);
      const noiseGain = audioContext.createGain();
      whiteNoiseGen.connect(noiseGain);

      const modulator = audioContext.createConstantSource();
      modulator.connect(noiseGain.gain);
      modulator.start();
      
      parameterModulators[modIdx] = {
        carrier: noiseGain,
        modulator,
        definition: currentMod,
      };
    } else if (modType === ModulationTypes.BrownNoise) {
      const brownNoiseGen = createBrownNoiseGenerator(audioContext);
      const noiseGain = audioContext.createGain();
      brownNoiseGen.connect(noiseGain);
      
      const modulator = audioContext.createConstantSource();
      modulator.connect(noiseGain.gain);
      modulator.start();

      parameterModulators[modIdx] = {
        carrier: noiseGain,
        modulator,
        definition: currentMod,
      };
    } else if (modType === ModulationTypes.PinkNoise) {
      const pinkNoiseGen = createPinkNoiseGenerator(audioContext);
      const noiseGain = audioContext.createGain();
      pinkNoiseGen.connect(noiseGain);

      const modulator = audioContext.createConstantSource();
      modulator.connect(noiseGain.gain);
      modulator.start();

      parameterModulators[modIdx] = {
        carrier: noiseGain,
        modulator,
        definition: currentMod,
      };
    }
  });

  return {
    soundModulators,
    soundDestinations,
    parameterModulators,
    parameterDestinations,
    externalModulators,
    externalDestinations,
  };
};
