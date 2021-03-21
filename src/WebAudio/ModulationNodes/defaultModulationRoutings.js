import { delayFractions } from '../SoundNodes/delayFractions';
import { ModulationOutputs } from './ModulationOutputs';
import { ModulationOutputTypes } from './ModulationOutputTypes';
import { ModulationTypes } from './ModulationTypes';

export const defaultModulationRoutings = {
  modulators: {
    'A1': {
      input: [ 'feelsLikeC', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B1',
      range: [ 45, 180 ],
    },

    'A2': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B2',
      range: 'percent',
    },

    'A3': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B3',
      range: 'percent',
    },

    'A4': {
      input: [ 'windSpeedKPH', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B4',
      range: 'percent',
    },

    'A5': {
      input: [ 'precipMM', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B5',
      range: 'percent',
    },

    'A6': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B6',
      range: 'percent',
    },

    'A7': {
      input: 'widget',
      type: ModulationTypes.Extern,
      extern: () => {},
      destination: 'B7',
      range: [
        'sine',
        'square',
        'sawtooth',
        'triangle',
      ],
    },

    'A8': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B8',
      range: delayFractions,
    },

    'A9': {
      input: [ 'spressureMB', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B9',
      range: 'percent',
    },

    'A10': {
      input: [ 'spressureMB', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B10',
      range: 'percent',
    },

    'A11': {
      input: [ 'humidity', 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B11',
      range: 'percent',
    },

    'A12': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B12',
      range: 'percent',
    },

    'A13': {
      input: null,
      type: ModulationTypes.ConstantSource,
      destination: 'B13',
      range: 'percent',
    },

    'A14': {
      input: null,
      type: ModulationTypes.ConstantSource,
      destination: 'B14',
      range: 'percent',
    },

    'A15': {
      type: ModulationTypes.BrownNoise,
      destination: 'B15',
      range: [ -60, 0 ],
      label: 'dB',
    },

    'A16': {
      type: ModulationTypes.ConstantSource,
      destination: 'B16',
      range: [ -60, 0 ],
      label: 'dB',
    },
  },

  destinations: {
    'B1': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.Bpm,
      extern: () => {},
    },

    'B2': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Attack,
    },

    'B3': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Release,
    },

    'B4': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.GlobalFilter,
    },

    'B5': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.ReverbGain,
    },

    'B6': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.ReverbMorph,
      extern: () => {},
    },

    'B7': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.WaveformMorph,
      extern: () => {},
    },

    'B8': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.DelayTime,
      extern: () => {},
    },

    'B9': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.DelayFeedback,
    },

    'B10': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.DelayGain,
    },

    'B11': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.Distortion,
      extern: () => {},
    },

    'B12': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Compressor,
    },

    'B13': {
      type: ModulationOutputTypes.Sound,
      output: ModulationOutputs.LocalGain,
    },

    'B14': {
      type: ModulationOutputTypes.ParameterModulation,
      output: null,
    },

    'B15': {
      type: ModulationOutputTypes.ParameterModulation,
      output: null,
    },

    'B16': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.GlobalGain,
    },
  },
};
