export const generateSoundOscillators = (
  audioContext,
  waveforms,
  compressor,
  delay,
) => {
  return waveforms.map((waveform, idx) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = 1;
    oscillator.start();

    const filter = audioContext.createBiquadFilter();
    filter.frequency.automationRate = 'k-rate';
    filter.type = idx ? 'highpass' : 'lowpass';
    filter.frequency.value = 1;

    oscillator.connect(filter);

    const envelope = audioContext.createGain();

    filter.connect(envelope);

    const amplifier = audioContext.createGain();
    // do not delete!
    amplifier.gain.value = 0;
    amplifier.connect(compressor);
    amplifier.connect(delay);

    envelope.connect(amplifier);
    
    return {
      amplifier,
      envelope,
      filter,
      oscillator,
    };
  });
};
