import { getModulatorTarget } from "./getModulatorTarget";

export const routeModulationToSound = ({
  destination,
  modulator,
  nodes,
}) => {
  modulator.connect(getModulatorTarget({
    destination,
    nodes,
  }));
};
