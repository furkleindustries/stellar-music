import {
  getFirstBlockChord,
  getNextMajorBlockChord,
} from '../Traversal/chordProgressions';
import {
  getFirstTonic,
  getNextTonic,
} from '../Tonics/getTonics';
import {
  Note,
} from '@tonaljs/tonal';

const oneSecondInMs = 1000;
const oneMinuteInMs = oneSecondInMs * 60;

export const beginSoundLoop = ({
  update,
  getBpm,
}) => {
  let type = 'major';
  let tonicChord = getFirstTonic(type);
  let blockChord = null;

  const intervalId = setInterval(() => {
    // Change keys on the first beat of every 16 bars.
    if (bars && !beats && bars % 16 === 0) {
      // TODO: octave and/or tonic changes
      tonicChord = getNextTonic(tonicChord);
      blockChord = null;
    } else if (bars && bars % 4 > 0) {
      blockChord = null;
    } else if (beats === 0) {
      blockChord = getFirstBlockChord(tonicChord.rootNote.note, type);
    } else {
      if (!blockChord) {
        throw new Error('Unexpected state in sound loop. blockChord was null.');
      }

      if (type === 'major') {
        blockChord = getNextMajorBlockChord(blockChord);
      } else {
        console.log('TODO: minor block chords');
        // blockChord = getNextMinorBlockChord(blockChord);
      }
    }

    update({ chord: blockChord || tonicChord });
  }, oneMinuteInMs / getBpm());

  return intervalId;
};
