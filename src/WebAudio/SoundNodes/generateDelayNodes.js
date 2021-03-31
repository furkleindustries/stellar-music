import {
  beatFractions,
} from '../beatFractions';

export const generateDelayNodes = (
  audioContext,
  globalFilter,
  feedbackAmount = 0.25,
  minimumBpm = 45,
) => {
  // Connect the delay gain node to the global gain node.
  const delayGain = audioContext.createGain();
  delayGain.connect(globalFilter);

  // Connect the delay filter node to the delay mix node.
  const delayFilter = audioContext.createBiquadFilter();
  delayFilter.frequency.automationRate = 'k-rate';
  delayFilter.type = 'bandpass';
  delayFilter.frequency.value = 1;
  delayFilter.connect(delayGain);

  // Connect the delay line node to the delay filter node.
  const maximumDelayTime = minimumBpm / 60 * beatFractions['4_bars'];
  const delay = audioContext.createDelay(maximumDelayTime);
  delay.delayTime.automationRate = 'k-rate';
  delay.connect(delayFilter);

  // Send the output from the delay filter to the feedback gain node.
  const delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = feedbackAmount;
  delayFilter.connect(delayFeedback);

  // Connect the feedback loop back to the delay line node in a cycle
  // attenuated by the feedback gain setting.
  delayFeedback.connect(delay);

  return {
    delay,
    delayGain,
    delayFilter,
    delayFeedback,
  };
};
