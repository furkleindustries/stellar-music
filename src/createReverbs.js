export const createReverbs = (audioContext, sources) => (
  Promise.all(sources.map((src) => {
    const convolver = audioContext.createConvolver();
    convolver.normalize = true;

    // load impulse response from file
    return new Promise((resolve, reject) => {
      fetch(src).then((response) => {
        response.arrayBuffer().then((arrayBuffer) => {
          audioContext.decodeAudioData(arrayBuffer).then((buf) => {
            convolver.buffer = buf;
            return resolve(convolver);
          });
        });
      });
    })
  }))
);
