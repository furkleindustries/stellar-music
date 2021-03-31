export const generateWaveShaper = (
  audioContext,
  globalFilter,
) => {
  const waveShaper = audioContext.createWaveShaper();
  waveShaper.oversample = '4x';
  waveShaper.connect(globalFilter);

  return waveShaper;
};
