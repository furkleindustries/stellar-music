export const generateCompressor = (
  audioContext,
  waveShaper,
) => {
  const compressor = audioContext.createDynamicsCompressor();
  compressor.connect(waveShaper);
  compressor.knee.value = 6;
  compressor.threshold.value = -18;

  return compressor;
};
