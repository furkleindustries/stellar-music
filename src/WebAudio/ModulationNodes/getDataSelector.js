import {
  delayFractions,
} from '../SoundNodes/delayFractions';
import {
  ModulationOutputs,
 } from './ModulationOutputs';
import {
  ModulationOutputTypes,
} from './ModulationOutputTypes';

 /* data:
 {
  dewpointC,
  feelslikeC,
  humidity,
  isDay,
  precipMM,
  spressureMB,
  windGustKPH,
  windSpeedKPH,
  windDir,
}
*/

const bpmDefault = 120;

export const getDataSelector = ({
  destination: {
    output,
    type,
  },
}) => {
  if (type === ModulationOutputTypes.Sound) {
    return () => null;
  }

  let dataSelector = ({ data }) => data;

  /* 60 / getDataSelector({
        data,
        destination: {
          output: ModulationOutputs.Bpm,
          type: ModulationOutputTypes.ParameterModulation,
        },
      })({ data }) * 0.125 */
  if (output === ModulationOutputs.Attack) {
    dataSelector = ({ data }) => {
      return 1;
    };
  } else if (output === ModulationOutputs.Bpm) {
    // Offset for lowest recorded temperature in human history to ensure log(x)
    // won't produce NaN
    dataSelector = ({ data: { feelslikeC } }) => {
      let bpm = Math.floor(Math.log((feelslikeC + 90) / 2) * 20);
      if (bpm) {
        bpm = Math.min(180, Math.max(bpm, 45));
      } else {
        bpm = bpmDefault;
      }

      return bpm;
    };
  } else if (output === ModulationOutputs.Compressor) {
    dataSelector = ({ data }) => {
      return 1;
    };
  } else if (output === ModulationOutputs.DelayTime) {
    dataSelector = ({ data }) => {
      return delayFractions['1/16'] * 3;
    };
  } else if (output === ModulationOutputs.DelayFeedback) {
    dataSelector = ({ data }) => {
      return 0.125;
    };
  } else if (output === ModulationOutputs.DelayFilter) {
    dataSelector = ({ data }) => {
      return 0.5;
    };
  } else if (output === ModulationOutputs.DelayGain) {
    dataSelector = ({ data }) => {
      return 0.25;
    };
  } else if (output === ModulationOutputs.Distortion) {
    dataSelector = ({ data: { humidity } }) => {
      return Math.min(1, Math.max(Number(humidity) || 0));
    };
  } else if (output === ModulationOutputs.GlobalFilter) {
    dataSelector = ({ data: { windSpeedKPH } }) => {
      return Math.max(220, 21000 - Math.log(Math.pow(windSpeedKPH + 2, 1.75)) * 2650);
    };
  } else if (output === ModulationOutputs.GlobalGain) {
    dataSelector = ({ data }) => {
      return 0.25;
    };
  } else if (output === ModulationOutputs.LocalGain) {
    dataSelector = ({ data }) => {
      return 1;
    };
  } else if (output === ModulationOutputs.Release) {
    dataSelector = ({ data }) => {
      return 1;
    };
  } else if (output === ModulationOutputs.ReverbGain) {
    dataSelector = ({ data: { precipMM } }) => {
      return Math.min(1, Math.max(0.125 * Math.log(precipMM + 1), 0.0613)) || 0.5;
    };
  } else if (output === ModulationOutputs.ReverbMorph) {
    dataSelector = ({ data }) => {
      return 0;
    };
  } else if (output === ModulationOutputs.WaveformMorph) {
    dataSelector = ({ data }) => {
      return 0;
    };
  } else  {
    throw new Error('Invalid input provided to getDataSelector.');
  }

  return dataSelector;
};
