export const generateWaveShaper = (
  audioContext,
  globalFilter,
  distortion = 1,
) => {
  const waveShaper = audioContext.createWaveShaper();
  waveShaper.oversample = '4x';
  waveShaper.curve = makeDistortionCurve(distortion);
  waveShaper.connect(globalFilter);

  return waveShaper;
};
