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
} from './generateModulationNodes';
import {
  generateSoundOscillators,
} from './generateSoundOscillators'
import {
  generateWaveShaper,
} from './generateWaveShaper';
import {
  ModulationOutputTypes,
} from './ModulationOutputTypes';

export const generateAudioGraphAndCallbacks = ({
  audioContext,
  data,
  notes,
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
  createReverbs(
    audioContext,
    [
      'https://meteoricon.s3.amazonaws.com/ir_lime_kiln.wav',
      'https://meteoricon.s3.amazonaws.com/ir_reactor_hall.wav',
      'https://meteoricon.s3.amazonaws.com/ir_snow.wav',
    ],
  ).then((convolvers) => {
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
    [ModulationOutputTypes.GlobalGain]: globalGain,
    [ModulationOutputTypes.Filter]: globalFilter,
    [ModulationOutputTypes.WaveShaper]: waveShaper,
    [ModulationOutputTypes.Compressor]: compressor,
    [ModulationOutputTypes.Delay]: delay,
    [ModulationOutputTypes.DelayFilter]: delayFilter,
    [ModulationOutputTypes.DelayGain]: delayGain,
    [ModulationOutputTypes.DelayFeedback]: delayFeedback,
    SoundOscillators: soundOscillators,
    Reverbs: reverbs,
  };

  generateModulationNodes({
    audioContext,
    data,
    notes,
    registerModulation,
    nodes,
  });
};
