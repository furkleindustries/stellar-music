export const generateCompressor = (
  audioContext,
  waveShaper,
) => {
  const compressor = audioContext.createDynamicsCompressor();
  compressor.connect(waveShaper);

  return compressor;
};
