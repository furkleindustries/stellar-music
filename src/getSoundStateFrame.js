export const getSoundStateFrame = ({
  data: {
    ob: {
      dewpointC,
      feelslikeC,
      humidity,
      isDay,
      precipMM,
      spressureMB,
      windGustKPH,
      windSpeedKPH,
      windDir,
    },
  },

  rands: {
    key: keyRand = Math.floor(Math.random() * 12),
    minorMajor: minorMajorRand,
  },
}) => {
  // Offset for lowest recorded temperature in human history to ensure log(x)
  // won't produce NaN
  let bpm = Math.floor(Math.log((feelslikeC + 90) / 2) * 20);

  if (bpm) {
    bpm = Math.min(180, Math.max(bpm, 45));
  } else {
    bpm = bpmDefault;
  }

  let octave = 4;

  const attackTime = atk >= 0 ? atk : 60 / bpm * 0.0625;
  const sustainTime = sustain >= 0 ? sustain : 60 / bpm * 0.125;
  const decayTime = decay >= 0 ? decay : 60 / bpm * 0.125;
  const releaseTime = rel >= 0 ? rel : 60 / bpm * 0.125;

  let distortion = humidity || 0;

  const reverbGain = Math.min(1, Math.max(0.125 * Math.log(precipMM + 1), 0.0613)) || 0.5;

  const filterQ = 1;
  const filterFreq = Math.max(220, 21000 - Math.log(Math.pow(windSpeedKPH + 2, 1.75)) * 2650);

  let key = getKey(data, keyRand);
  // Start in key.
  let note = key;
  let minorMajor = getMinorMajor(isDay, minorMajorRand);
  let chord = getChord({
    root: note,
    octave,
    minorMajor,
    notes,
    data,
  });

  console.log(`bpm: ${bpm}`);
  console.log(`distortion: ${distortion}%`);
  console.log('global reverb gain', `${reverbGain * 100}%`);
  console.log('global filter low-pass frequency', filterFreq);
  console.log(key, minorMajor, note, chord.slice(0, 3));

  const waves = [
    'sine',
    'square',
    'sawtooth',
    'triangle',
  ];

  const reverbMorph = 0.5;
  const reverbMixes = [
    reverbGain,
    reverbGain,
    reverbGain,
  ];

  for (let ii = 0; ii < reverbMixes.length; ii += 1) {
    if (reverbMorph < 0.3333) {
      reverbMixes[0] *= 1 + Math.log(2.7 * reverbMorph + 0.1);
      reverbMixes[2] *= 0;
    } else if (reverbMorph < 0.6667) {
      reverbMixes[0] *= 1 + Math.log(-2.7 * reverbMorph + 0.1);
      reverbMixes[2] *= 1 + Math.log(2.7 * reverbMorph - 0.8);
    } else {
      reverbMixes[0] *= 0;
      reverbMixes[2] *= 1 + Math.log(-2.7 * reverbMorph + 2.8);
    }

    if (reverbMorph < 0.5) {
      reverbMixes[1] *= Math.pow(reverbMorph, 0.3333) + 0.412 * reverbMorph;
    } else {
      reverbMixes[1] *= Math.pow(reverbMorph, -1) - 0.125 * reverbMorph - 0.94;
    }
  }

  return {
    bpm,
    chord,
    filterFreq,
    filterQ,
    waves,
    attackTime,
    attackCurve,
    decayTime,
    decayCurve,
    sustainTime,
    sustainGain,
    releaseTime,
    releaseCurve,
    distortion,
    reverbMixes,
  };
};
