let audioCtx = null;

export const getAudioContext = (args) => {
  if (!audioCtx) {
    audioCtx = new AudioContext(args);
  }

  return audioCtx;
};
