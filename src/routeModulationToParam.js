import { getModulatorTarget } from './getModulatorTarget';
import { ModulationTypes } from './ModulationTypes';

export const routeModulationToParam = ({
  data,
  destination,
  modulator,
  nodes,
}) => {
  const targetNode = getModulatorTarget({
    destination,
    nodes,
  });

  const value = dataSelector({
    data,
    destination,
    modulator,
    nodes,
  });

  if (modulator.type === ModulationTypes.External) {
    destination.external({
      data,
      destination,
      modulator,
      nodes,
      value,
    });

    return;
  } else if (modulator.type === ModulationTypes.LFO) {
    modulator.frequency.value = value;
  } else if (modulator.type === ModulationTypes.ConstantSource) {
    modulator.offset.value = value;
  }

  modulator.connect(targetNode);
};
