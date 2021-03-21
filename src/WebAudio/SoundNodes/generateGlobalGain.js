export const generateGlobalGain = (audioContext, volume = 1) => {
  const globalGain = audioContext.createGain();
  globalGain.gain.value = volume;
  globalGain.connect(audioContext.destination);

  return globalGain;
};
