export const generateGlobalFilter = (
  audioContext,
  globalGain,
  type = 'lowpass',
) => {
  audioContext.createBiquadFilter();
  globalFilter.type = type;
  globalFilter.connect(globalGain);
};
