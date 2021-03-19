export const generateSoundOscillators = (
  audioContext,
  waveforms,
  compressor,
  delay,
) => {
  return waveforms.map((waveform, idx) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.start();

    const filter = audioContext.createBiquadFilter();
    filter.type = idx ? 'highpass' : 'lowpass';

    oscillator.connect(filter);

    const envelope = audioContext.createGain();

    filter.connect(envelope);

    envelope.connect(compressor);
    envelope.connect(delay);

    return {
      oscillator,
      filter,
      envelope,
    };
  })
};
