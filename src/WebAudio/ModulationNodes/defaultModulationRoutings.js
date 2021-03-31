import {
  beatFractions,
} from '../beatFractions';
import {
  makeDistortionCurve,
} from '../SoundNodes/makeDistortionCurve';
import {
  ModulationOutputs,
} from './ModulationOutputs';
import {
  ModulationOutputTypes,
} from './ModulationOutputTypes';
import {
  ModulationTypes,
} from './ModulationTypes';
import {
  Note,
} from '@tonaljs/tonal';

export const defaultModulationRoutings = {
  modulators: {
    'A1': {
      input: 'widget',
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
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B4',
      range: 'percent',
    },

    'A5': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B5',
      range: 'percent',
    },

    'A6': {
      input: 'widget',
      type: ModulationTypes.Extern,
      extern: (data) => data,
      destination: 'B6',
      range: 'percent',
    },

    'A7': {
      input: 'widget',
      type: ModulationTypes.Extern,
      extern: (data) => data,
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
      range: beatFractions,
    },

    'A9': {
      input: [ 'widget' ],
      type: ModulationTypes.ConstantSource,
      destination: 'B9',
      range: 'percent',
    },

    'A10': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B10',
      range: 'percent',
    },

    'A11': {
      input: 'widget',
      type: ModulationTypes.Extern,
      extern: (data) => data,
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
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B13',
      range: 'percent',
    },

    'A14': {
      input: 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B14',
      range: 'percent',
    },

    'A15': {
      input : 'widget',
      type: ModulationTypes.BrownNoise,
      destination: 'B15',
      range: [ -60, 0 ],
      label: 'dB',
    },

    'A16': {
      input : 'widget',
      type: ModulationTypes.ConstantSource,
      destination: 'B16',
      range: [ -60, 0 ],
      label: 'dB',
    },

    'OM1': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD1',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM2': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD2',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM3': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD3',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM4': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD4',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM5': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD5',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM6': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD6',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },

    'OM7': {
      type: ModulationTypes.ConstantSource,
      destination: 'OD7',
      range: [ Note.freq('C0'), Note.freq('B8') ],
      label: 'Hz',
    },
  },

  destinations: {
    'B1': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Bpm,
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
      extern: ({
        bpm,
        chord,
        data,
        nodes,
      }) => {
      },
    },

    'B7': {
      type: ModulationOutputTypes.Extern,
      output: ModulationOutputs.WaveformMorph,
      extern: ({
        bpm,
        chord,
        data,
        nodes,
      }) => {

      },
    },

    'B8': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.DelayTime,
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
      extern: ({
        data,
        nodes,
      }) => {
        nodes[ModulationOutputs.Distortion].curve = makeDistortionCurve(data);
      },
    },

    'B12': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Compressor,
    },

    'B13': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Decay,
    },

    'B14': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.Sustain,
    },

    'B15': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.LocalGain,
    },

    'B16': {
      type: ModulationOutputTypes.ParameterModulation,
      output: ModulationOutputs.GlobalGain,
    },

    'OD1': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc1Frequency,
    },

    'OD2': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc2Frequency,
    },

    'OD3': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc3Frequency,
    },

    'OD4': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc4Frequency,
    },

    'OD5': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc5Frequency,
    },

    'OD6': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc6Frequency,
    },

    'OD7': {
      type: ModulationOutputTypes.SoundModulation,
      output: ModulationOutputs.Osc7Frequency,
    },
  },
};
