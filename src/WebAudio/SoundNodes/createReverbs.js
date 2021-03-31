import impulseResponses from '../../../impulse-response-manifest.js';

export const createReverbs = (audioContext, sources = impulseResponses) => {
  return Promise.all(Object.entries(sources).slice(0, 1).map(([ name, src ]) => {
    const convolver = audioContext.createConvolver();
    convolver.normalize = true;
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';

    xhr.open('GET', src);
    xhr.send(null);
  
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        audioContext.decodeAudioData(xhr.response).then((buf) => {
          convolver.buffer = buf;
          return resolve(convolver);
        });
      };
  
      xhr.onerror = reject;
    });
  }))
};
