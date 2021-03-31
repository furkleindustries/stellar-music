import {
  getTonnetzNode,
  tonnetz,
  pTransform,
  lTransform,
  rTransform,
  nTransform,
  sTransform,
  hTransform,
  getMajorTriad,
  getMinorTriad,
} from './tonnetz';

export const getFirstTonic = (
  type = 'major',
  octave = 3,
  x = Math.floor(Math.random() * 6),
  y = Math.floor(Math.random() * 7),
) => {
  const tonnetzNode = getTonnetzNode([ x, y ], octave);
  if (type === 'major') {
    return getMajorTriad(tonnetzNode);
  }

  return getMinorTriad(tonnetzNode);
};

export const getNextTonic = (
  arg,
  octave = 3,
  transformations = [ '+0+1' ],
) => {
  let nextChord = arg;
  let currentX = nextChord.notes[0].x;
  let currentY = nextChord.notes[0].y;
  for (const trans of transformations) {
    if (new RegExp(/^[+-]\d[+-]\d$/i).test(trans)) {
      const split = trans.split('');
      const xMod = split.slice(0, 2);
      const yMod = split.slice(2);
      if (xMod[0] === '+') {
        currentX += Number(xMod[1]);
        if (currentX >= tonnetz[currentY].length) {
          currentX = tonnetz[currentY].length % currentX;
        }
      } else {
        currentX -= Number(xMod[1]);
        if (currentX < 0) {
          currentX = Math.abs(currentX);
        }
      }

      if (yMod[0] === '+') {
        currentY += Number(yMod[1]);
        if (currentY >= tonnetz.length) {
          currentY = tonnetz.length % currentX;
        }
      } else {
        currentY -= Number(yMod[1]);
        if (currentY < 0) {
          currentY = Math.abs(currentY);
        }
      }

      const node = getTonnetzNode([ currentX, currentY ], octave);
      if (nextChord.type === 'major') {
        nextChord = getMajorTriad(node);
      } else {
        nextChord = getMinorTriad(node);
      }
    } else if (trans === 'p') {
      nextChord = pTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else if (trans === 'l') {
      nextChord = lTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else if (trans === 'r') {
      nextChord = rTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else if (trans === 'n') {
      nextChord = nTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else if (trans === 's') {
      nextChord = sTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else if (trans === 'h') {
      nextChord = hTransform(nextChord);
      currentX = nextChord.notes[0].x;
      currentY = nextChord.notes[0].y;
    } else {
      throw new Error('Invalid input to getNextTonic.');
    }
  }

  if (!nextChord) {
    throw new Error('Invalid input to getNextTonic.');
  }

  return nextChord;
};
