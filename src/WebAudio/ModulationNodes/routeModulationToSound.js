import {
  getModulatorTarget,
} from './getModulatorTarget';

export const routeModulationToSound = ({
  destination,
  modulator,
  nodes,
}) => {
  if (modulator && modulator.node ) {
    const target = getModulatorTarget({
      destination,
      nodes,
    });

    if (target) {
      modulator.node.connect(target);
    }
  }
};
