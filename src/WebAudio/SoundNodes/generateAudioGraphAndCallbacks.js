import {
  createReverbs,
} from './createReverbs';
import {
  generateCompressor,
} from './generateCompressor';
import {
  generateDelayNodes,
} from './generateDelayNodes';
import {
  generateGlobalFilter,
} from './generateGlobalFilter';
import {
  generateGlobalGain,
} from './generateGlobalGain';
import {
  generateModulationNodes,
} from '../ModulationNodes/generateModulationNodes';
import {
  generateSoundOscillators,
} from './generateSoundOscillators'
import {
  generateWaveShaper,
} from './generateWaveShaper';
import {
  ModulationOutputs,
} from '../ModulationNodes/ModulationOutputs';

export const generateAudioGraphAndCallbacks = ({
  audioContext,
  data,
  registerModulation,
  waveforms,
}) => {
  const globalGain = generateGlobalGain(
    audioContext,
    // volume
    0.25,
  );

  const globalFilter = generateGlobalFilter(
    audioContext,
    globalGain,
    // filter type
    'allpass',
  );

  const waveShaper = generateWaveShaper(
    audioContext,
    globalFilter,
    // distortion
    1,
  );

  const compressor = generateCompressor(
    audioContext,
    waveShaper,
  );

  const {
    delay,
    delayGain,
    delayFeedback,
    delayFilter,
  } = generateDelayNodes(
    audioContext,
    globalFilter,
    // feedback amount
    0.25,
    // minimum BPM, from which maximum delay time is derived
    45,
  );
  
  const soundOscillators = generateSoundOscillators(
    audioContext,
    waveforms,
    compressor,
    delay,
  );

  let reverbs = [];
  createReverbs(audioContext).then((convolvers) => {
    reverbs.push(...convolvers.map((convolver) => ({
      convolver,
      convolverGain: audioContext.createGain(),
    })));

    reverbs.forEach(({
      convolver,
      convolverGain,
    }) => {
      waveShaper.connect(convolver);
      delayGain.connect(convolver);

      convolver.connect(convolverGain);

      convolverGain.connect(globalFilter);
    });
  });

  const nodes = {
    [ModulationOutputs.GlobalGain]: globalGain,
    [ModulationOutputs.GlobalFilter]: globalFilter,
    [ModulationOutputs.WaveformMorph]: waveShaper,
    [ModulationOutputs.Compressor]: compressor,
    [ModulationOutputs.DelayTime]: delay,
    [ModulationOutputs.DelayFilter]: delayFilter,
    [ModulationOutputs.DelayGain]: delayGain,
    [ModulationOutputs.DelayFeedback]: delayFeedback,
    SoundOscillators: soundOscillators,
    Reverbs: reverbs,
  };

  const {
    modulators,
    destinations,
  } = generateModulationNodes({
    audioContext,
    data,
    registerModulation,
    nodes,
  });

  return {
    update: () => {
      console.log('updating');
    },

    getBpm: () => {
      const destIdx = destinations.find(({ output }) => output === ModulationOutputs.Bpm).id;
      return modulators.find(({ destination }) => destination === destIdx).node.value;
    },

    destroy: () => {

    },
  };
};
