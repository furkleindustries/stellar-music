import {
  ModulationOutputs,
} from './ModulationOutputs';

export const getModulatorTarget = ({
  destination,
  nodes,
}) => {
  if (destination.output === ModulationOutputs.Bpm ||
    destination.output === ModulationOutputs.Attack ||
    destination.output === ModulationOutputs.Release)
  {
    return nodes.SoundOscillators.map(({ envelope }) => envelope.gain);
  } else if (destination.output === ModulationOutputs.Distortion) {
    return nodes.waveShaper;
  } else if (destination.output === ModulationOutputs.LocalGain) {
    return null;
  } else if (destination.output === ModulationOutputs.ReverbGain ||
    destination.output === ModulationOutputs.ReverbMorph)
  {
    return [ ...nodes.Reverbs ];
  } else if (destination.output === ModulationOutputs.WaveformMorph) {
    return nodes.SoundOscillators.map(({ oscillator }) => oscillator);
  } else if (destination.output in nodes) {
    return nodes[destination.output];
  }

  throw new Error(); 
};
