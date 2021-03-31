import {
  ModulationOutputs,
} from '../ModulationNodes/ModulationOutputs';
import {
  Note,
} from '@tonaljs/tonal';

export const updateOscillator = ({
  audioContext,
  beatLength,
  chord,
  chordLog,
  dataSelector,
  modIdx,
  mod,
  parameterDestinations,
  parameterModulators,
  attackGain,
  decayGain,
  sustainGain,
  releaseGain,
  wiggleRoom,
}) => {
  const currentTime = audioContext.currentTime;
  const oscIdx = Number(modIdx[modIdx.length - 1]) - 1;
  const ampMod = mod.amplitudeModulator;
  const freqMod = mod.frequencyModulator;
  const arg = chord.notes[oscIdx];
  const envelope = mod.carrier.envelope;
  if (arg) {
    const note = typeof arg === 'string' ? arg : arg.note;
    chordLog.push(note);
    const freq = Note.freq(note);
    freqMod.offset.value = freq;

    const [ attackDestIdx ] = Object.entries(parameterDestinations).find(([ , { output } ]) => (
      output === ModulationOutputs.Attack
    ));

    const attackModContainer = Object.values(parameterModulators).find(({ definition }) => (
      definition.destination === attackDestIdx
    ));

    const attackMod = attackModContainer ? attackModContainer.modulator : null;

    const attackVal = attackMod && attackMod.offset ? attackMod.offset.value : null;
    const timeToStartAttack = currentTime;
    const timeToStopAttack = currentTime + beatLength * attackVal;

    const [ decayDestIdx ] = Object.entries(parameterDestinations).find(([ , { output } ]) => (
      output === ModulationOutputs.Decay
    ));

    const decayModContainer = Object.values(parameterModulators).find(({ definition }) => (
      definition.destination === decayDestIdx
    ));

    const decayMod = decayModContainer ? decayModContainer.modulator : null;

    const decayVal = decayMod && decayMod.offset ? decayMod.offset.value : null;
    const timeToStopDecay = currentTime + decayVal * beatLength;

    const [ sustainDestIdx ] = Object.entries(parameterDestinations).find(([ , { output } ]) => (
      output === ModulationOutputs.Sustain
    ));

    const sustainModContainer = Object.values(parameterModulators).find(({ definition }) => (
      definition.destination === sustainDestIdx
    ));

    const sustainMod = sustainModContainer ? sustainModContainer.modulator : null;

    const sustainVal = sustainMod && sustainMod.offset ? sustainMod.offset.value : null;
    const timeToStopSustain = timeToStopAttack + sustainVal * beatLength;

    const [ releaseDestIdx ] = Object.entries(parameterDestinations).find(([ , { output } ]) => (
      output === ModulationOutputs.Release
    ));

    const releaseModContainer = Object.values(parameterModulators).find(({ definition }) => (
      definition.destination === releaseDestIdx
    ));

    const releaseMod = releaseModContainer ? releaseModContainer.modulator : null;

    const releaseVal = releaseMod && releaseMod.offset ? releaseMod.offset.value : null;
    const timeToStopRelease = timeToStopSustain + releaseVal * beatLength;

    const gateTime = Math.min(timeToStopRelease, currentTime + beatLength);

    const anyNull = [
      attackVal,
      decayVal,
      sustainVal,
      releaseVal,
      gateTime,
    ].find((aa) => aa === null || aa === undefined || Number.isNaN(aa));

    if (anyNull) {
      throw new Error('One or more of the envelope calculations returned an erroneous value.');
    } else if (timeToStopAttack >= gateTime) {
      const portionOfAttack = gateTime / (timeToStopAttack - timeToStartAttack);
      envelope.gain.exponentialRampToValueAtTime(portionOfAttack, timeToStartAttack, gateTime - wiggleRoom);
      envelope.gain.exponentialRampToValueAtTime(releaseGain, gateTime - wiggleRoom, gateTime);
    } else if (timeToStopDecay >= gateTime) {
      envelope.gain.exponentialRampToValueAtTime(attackGain, timeToStartAttack, timeToStopAttack);
      const portionOfDecay = gateTime / timeToStopDecay * decayGain;
      envelope.gain.exponentialRampToValueAtTime(portionOfDecay, timeToStopAttack, gateTime - wiggleRoom);
      envelope.gain.exponentialRampToValueAtTime(releaseGain, gateTime - wiggleRoom, gateTime);
    } else if (timeToStopSustain > gateTime) {
      envelope.gain.exponentialRampToValueAtTime(attackGain, timeToStartAttack, timeToStopAttack);
      envelope.gain.exponentialRampToValueAtTime(decayGain, timeToStopAttack, timeToStopDecay);
      const portionOfSustain = gateTime / timeToStopSustain * sustainGain;
      envelope.gain.exponentialRampToValueAtTime(portionOfSustain, timeToStopDecay, gateTime - wiggleRoom);
      envelope.gain.exponentialRampToValueAtTime(releaseGain, gateTime - wiggleRoom, gateTime);
    } else {
      envelope.gain.exponentialRampToValueAtTime(attackGain, timeToStartAttack, timeToStopAttack);
      envelope.gain.exponentialRampToValueAtTime(decayGain, timeToStopAttack, timeToStopDecay);
      envelope.gain.exponentialRampToValueAtTime(sustainGain, timeToStopDecay, timeToStopSustain);
      envelope.gain.exponentialRampToValueAtTime(releaseGain, timeToStopSustain, gateTime);
    }

    ampMod.offset.value = 1;
  } else {
    ampMod.offset.value = 0;
  }

  return chordLog;
};
