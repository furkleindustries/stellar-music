import {
  beatFractions,
} from '../beatFractions';
import {
  getBpm,
} from './getBpm';
import {
  ModulationOutputs,
 } from './ModulationOutputs';

export const getDataSelector = (
  {
    definition: { destination: destIdx },
  },

  destinations,
) => {
  let dataSelector = (data) => data;

  const dest = destinations[destIdx];
  if (!dest || !dest.output) {
    return () => 0;
  }

  const { output } = dest;
  if (output === ModulationOutputs.Attack) {
    dataSelector = ({ }) => {
      return 0.0625;
    };
  } else if (output === ModulationOutputs.Decay) {
    dataSelector = () => {
      return 0.25;
    };
  } else if (output === ModulationOutputs.Sustain) {
    dataSelector = () => {
      return 0.125;
    };
  } else if (output === ModulationOutputs.Release) {
    dataSelector = () => {
      return 0.250;
    };
  } else if (output === ModulationOutputs.Bpm) {
    // Offset for lowest recorded temperature in human history to ensure log(x)
    // won't produce NaN
    dataSelector = (data) => {
      return getBpm(data);
    };
  } else if (output === ModulationOutputs.Compressor) {
    dataSelector = () => {
      return 1;
    };
  } else if (output === ModulationOutputs.DelayTime) {
    // Should vary roughly from [300kWh/m^2, 4000kWh/m^2]
    dataSelector = ({ solradWM2 = 300 }) => {
      return [
        beatFractions['1/3'],
        beatFractions['1/4'],
        beatFractions['1/6'],
        beatFractions['1/8'],
        beatFractions['1/12'],
        beatFractions['1/16'],
        beatFractions['1/24'],
        beatFractions['1/32'],
        beatFractions['1/48'],
        beatFractions['1/64'],
      ][Math.round(Math.log2(Math.min(4000, Math.max(300, solradWM2) - 296)) - 2)];
    };
  } else if (output === ModulationOutputs.DelayFeedback) {
    dataSelector = ({ spressureMB = 1050 }) => {
      // Pressure above 1050mB can be ignored.
      // Should vary roughly from [0, 0.67]
      return Math.pow(1052.75 - spressureMB + 50, 1.25) / 9000;
    };
  } else if (output === ModulationOutputs.DelayFilter) {
    dataSelector = ({ spressureMB = 1050 }) => {
      // Pressure above 1050mB can be ignored.
      // Should vary roughly from [220hz, 8000hz]
      return 8000 - Math.pow(1052.75 - spressureMB, 1.2964777);
    };
  } else if (output === ModulationOutputs.DelayGain) {
    dataSelector = () => {
      return 0.25;
    };
  } else if (output === ModulationOutputs.Distortion) {
    dataSelector = ({ humidity }) => {
      return Math.min(1, Math.max(Number(humidity) || 0, 0));
    };
  } else if (output === ModulationOutputs.GlobalFilter) {
    dataSelector = ({ windSpeedKPH }) => {
      // Normalize against ~250kph. If it's higher, people are dying there,
      // and I'm not tracking that far.
      const windSpeed = Math.min(250, windSpeedKPH);
      return Math.max(220, 21000 - Math.log(Math.pow(windSpeed + 2, 1.75)) * 2650);
    };
  } else if (output === ModulationOutputs.GlobalGain) {
    dataSelector = () => {
      return 0.25;
    };
  } else if (output === ModulationOutputs.LocalGain) {
    dataSelector = () => {
      return 1;
    };
  } else if (output === ModulationOutputs.ReverbGain) {
    dataSelector = ({ precipMM }) => {
      return Math.min(1, Math.max(0.125 * Math.log(precipMM + 1), 0.0613)) || 0.5;
    };
  } else if (output === ModulationOutputs.ReverbMorph) {
    dataSelector = () => {
      return 0;
    };
  } else if (output === ModulationOutputs.WaveformMorph) {
    dataSelector = () => {
      return 0;
    };
  }

  return dataSelector;
};
