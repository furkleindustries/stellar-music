export const generateGlobalFilter = (
  audioContext,
  globalGain,
  type = 'lowpass',
) => {
  const globalFilter = audioContext.createBiquadFilter();
  globalFilter.type = type;
  globalFilter.connect(globalGain);

  return globalFilter;
};
