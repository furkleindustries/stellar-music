import {
  Vector,
} from './Vector';

export const sigma = 10;
export const rho = 28;
export const beta = 8 / 3;

export const lorenzSystem = (pos, sigma, rho, beta) => {
  const x = sigma * (pos.y - pos.x);
  const y = pos.x * (rho - pos.z) - pos.y;
  const z = pos.x * pos.y - (beta * pos.z);

  return new Vector(x, y, z);
};

export const lorenzValueAt = (x) => {
  return lorenzSystem(x, sigma, rho, beta);
};
