import {
  getModulatorTarget,
} from './getModulatorTarget';
import {
  ModulationTypes,
} from './ModulationTypes';

export const routeModulationToParam = ({
  data,
  dataSelector = ({ data }) => data,
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

  if (destination.type === ModulationTypes.Extern) {
    destination.extern({
      data,
      destination,
      modulator,
      nodes,
      value,
    });

    return;
  } else if (modulator.type === ModulationTypes.LFO) {
    modulator.node.frequency.value = value;
  } else if (modulator.type === ModulationTypes.ConstantSource) {
    modulator.node.offset.value = value;
  }

  const targets = Array.isArray(targetNode) ? targetNode : [ targetNode ];
  targets.forEach((target) => {
    if (target) {
      modulator.node.connect(target);
    } 
  });
};
