import {
  getFirstBlockChord,
  getNextMajorBlockChord,
} from '../Traversal/chordProgressions';
import {
  getFirstTonic,
  getNextTonic,
} from '../Tonics/getTonics';
import { getBpm } from './ModulationNodes/getBpm';

const oneSecondInMs = 1000;
const oneMinuteInMs = oneSecondInMs * 60;

export const getSoundLoop = ({
  update,
  startingTonic = null,
  getData,
  getBeatsInBar,
  getOctaveBarLength,
  getTonicBarLength,
  getOctaveChangeChance,
  getRootOctaveMax,
  getRootOctaveMin,
  getScaleType,
  getOctave,
}) => {
  let tonicChord = startingTonic || getFirstTonic(getScaleType(), getOctave());

  let blockChord = null;

  let barsCounter = 0;
  let beatsCounter = 0;
  return setInterval(() => {
    let octave = getOctave();
    const scaleType = getScaleType();
    const octaveBarLength = getOctaveBarLength();
    const tonicBarLength = getTonicBarLength();
    const octaveChangeChance = getOctaveChangeChance();
    const rootOctaveMin = getRootOctaveMin();
    const rootOctaveMax = getRootOctaveMax();
    const beatsInBar = getBeatsInBar();

    if (barsCounter || beatsCounter) {
      if (!beatsCounter && barsCounter && barsCounter % octaveBarLength === 0 && barsCounter % tonicBarLength > 0) {
        // Don't allow octave and key changes on the same bar/beat -- too distracting
        if (Math.random() < octaveChangeChance) {
          octave += Math.random() > 0.5 ? 1 : -1;
          octave = Math.max(rootOctaveMin, Math.min(rootOctaveMax, octave));
          tonicChord.notes[0].note = tonicChord.notes[0].note.slice(0, -1) + octave;

          if (blockChord) {
            blockChord.notes[0] = blockChord.notes[0].slice(0, -1) + octave;
          }
        }
      }

      if (!beatsCounter && barsCounter && barsCounter % tonicBarLength === 0) {
        // Change keys on the first beat of every 16 bars.
        tonicChord = getNextTonic(tonicChord, octave);
        blockChord = null;
      } else if (!blockChord) {
        blockChord = getFirstBlockChord(tonicChord.notes[0].note, scaleType);
      } else {
        let lastBlockChord = blockChord;
        if (scaleType === 'major') {
          blockChord = getNextMajorBlockChord(blockChord);
        } else {
          blockChord = getNextMinorBlockChord(blockChord);
        }

        if (!blockChord.notes.length) {
          console.log(lastBlockChord);
          debugger;
        }
      }
    }

    update({
      barsCounter,
      beatsCounter,
      chord: blockChord || tonicChord,
      getData,
    });

    beatsCounter += 1;
    if (beatsCounter >= beatsInBar) {
      barsCounter += 1;
      beatsCounter = 0;
    }
  }, oneMinuteInMs / getBpm(getData()));
};
