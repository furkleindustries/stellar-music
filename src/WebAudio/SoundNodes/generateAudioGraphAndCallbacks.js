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
import {
  setModulationValues,
} from './setModulationValues';

export const generateAudioGraphAndCallbacks = ({
  audioContext,
  getData,
  waveforms,
  getBeatsInBar,
  getOctaveBarLength,
  getTonicBarLength,
  getOctaveChangeChance,
  getRootOctaveMax,
  getRootOctaveMin,
  getScaleType,
  getOctave,
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
  const reverbGain = audioContext.createGain();
  reverbGain.connect(globalFilter);
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

      convolverGain.connect(reverbGain);
    });
  });

  const nodes = {
    [ModulationOutputs.GlobalGain]: globalGain,
    [ModulationOutputs.GlobalFilter]: globalFilter,
    [ModulationOutputs.Distortion]: waveShaper,
    [ModulationOutputs.Compressor]: compressor,
    [ModulationOutputs.DelayTime]: delay,
    [ModulationOutputs.DelayFilter]: delayFilter,
    [ModulationOutputs.DelayGain]: delayGain,
    [ModulationOutputs.DelayFeedback]: delayFeedback,
    [ModulationOutputs.ReverbGain]: reverbGain,
    Reverbs: reverbs,
    SoundOscillators: soundOscillators,
  };

  const {
    soundModulators,
    soundDestinations,
    parameterModulators,
    parameterDestinations,
    externalModulators,
    externalDestinations,
  } = generateModulationNodes({
    audioContext,
    nodes,
  });

  console.log(parameterModulators);

  return {
    update: ({
      barsCounter,
      beatsCounter,
      chord,
      getData,
    }) => {
      setModulationValues({
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
      });
    },

    destroy: () => {
      destroyAudioGraph({
        audioContext,
        nodes,
        parameterModulators,
        soundModulators,
      });
    },
  };
};
