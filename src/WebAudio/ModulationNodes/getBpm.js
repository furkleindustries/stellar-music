const bpmDefault = 90;

export const getBpm = ({ feelslikeC }) => {
  // Offset for lowest recorded temperature in human history to ensure log(x)
  // won't produce NaN
  let bpm = Math.floor(Math.log((feelslikeC + 90) / 2) * 20);
  if (bpm) {
    bpm = Math.min(180, Math.max(bpm, 45));
  } else {
    bpm = bpmDefault;
  }

  return bpm;
};
