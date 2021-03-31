export const generateGlobalFilter = (
  audioContext,
  globalGain,
  type = 'lowpass',
) => {
  const globalFilter = audioContext.createBiquadFilter();
  globalFilter.frequency.automationRate = 'k-rate';
  globalFilter.frequency.value = 1;
  globalFilter.type = type;
  globalFilter.connect(globalGain);

  return globalFilter;
};
