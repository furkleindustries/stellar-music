import { ModulationOutputs } from "./ModulationOutputs";

export const getModulatorTarget = ({
  destination,
  nodes,
}) => {
  if (destination.type in nodes) {
    return nodes[destination.type];
  }

  if (destination.type === ModulationOutputs.Bpm ||
    destination.type === ModulationOutputs.Attack ||
    destination.type === ModulationOutputs.Release)
  {
    return nodes.soundOscillators.map(({ envelope }) => envelope);
  } else if (destination.type === ModulationOutputs.Distortion) {
    return nodes.waveShaper;
  } else if (destination.type === ModulationOutputs.LocalGain) {
    return null;
  } else if (destination.type === ModulationOutputs.ReverbGain ||
    destination.type === ModulationOutputs.ReverbMorph)
  {
    return [ ...nodes.reverbs ];
  } else if (destination.type === ModulationOutputs.WaveformMorph) {
    return nodes.soundOscillators.map(({ oscillator }) => oscillator);
  }

  throw new Error(); 
};
