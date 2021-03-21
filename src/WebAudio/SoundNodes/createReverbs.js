import impulseResponses from '../../../impulse-response-manifest.js';

export const createReverbs = (audioContext, sources = impulseResponses) => (
  Promise.all(Object.entries(sources).slice(0, 8).map(([ name, src ]) => {
    const convolver = audioContext.createConvolver();
    convolver.normalize = true;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', src);
    xhr.send(null);
  
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        response.arrayBuffer().then((arrayBuffer) => {
          audioContext.decodeAudioData(arrayBuffer).then((buf) => {
            convolver.buffer = buf;
            return resolve(convolver);
          });
        });
      };
  
      xhr.onerror = reject;
    });
  }))
);
