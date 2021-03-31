import {
  ModulationOutputs,
} from './ModulationOutputs';

export const carrierIgnores = [
  ModulationOutputs.Bpm,
  ModulationOutputs.Attack,
  ModulationOutputs.Decay,
  ModulationOutputs.Sustain,
  ModulationOutputs.Release,
  ModulationOutputs.Distortion,
  ModulationOutputs.ReverbMorph,
  ModulationOutputs.WaveformMorph,
  ModulationOutputs.LocalGain,
  ModulationOutputs.Osc1Frequency,
  ModulationOutputs.Osc2Frequency,
  ModulationOutputs.Osc3Frequency,
  ModulationOutputs.Osc4Frequency,
  ModulationOutputs.Osc5Frequency,
  ModulationOutputs.Osc6Frequency,
  ModulationOutputs.Osc7Frequency,
];

export const getCarrier = ({
  modContainer,
  parameterDestinations,
  nodes,
}) => {
  const dest = parameterDestinations[modContainer.definition.destination];
  if (!dest) {
    return null;
  }

  const { output } = dest;
  if (carrierIgnores.indexOf(output) !== -1 || !(output in nodes)) {
    return null;
  }

  if (output === ModulationOutputs.Compressor) {
    modContainer.modulator.offset.automationRate = 'k-rate';
    return nodes[output].ratio;
  } else if (output === ModulationOutputs.DelayTime) {
    modContainer.modulator.offset.automationRate = 'k-rate';
    return nodes[output].delayTime;
  } else if (output === ModulationOutputs.DelayGain) {
    return nodes[output].gain;
  } else if (output === ModulationOutputs.DelayFeedback) {
    return nodes[output].gain;
  } else if (output === ModulationOutputs.DelayFilter) {
    modContainer.modulator.offset.automationRate = 'k-rate';
    return nodes[output].frequency;
  } else if (output === ModulationOutputs.GlobalFilter) {
    modContainer.modulator.offset.automationRate = 'k-rate';
    return nodes[output].frequency;
  } else if (output === ModulationOutputs.GlobalGain) {
    return nodes[output].gain;
  } else if (output === ModulationOutputs.ReverbGain) {
    return nodes[output].gain;
  }

  // Should probably throw here instead.
  return nodes[output];
};
