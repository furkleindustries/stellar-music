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
  type = Math.random() > 0.75 ? 'minor' : 'major',
  x = Math.floor(Math.random() * 6),
  y = Math.floor(Math.random() * 7),
) => {
  const tonnetzNode = getTonnetzNode([ x, y ]);
  if (type === 'major') {
    return getMajorTriad(tonnetzNode);
  }

  return getMinorTriad(tonnetzNode);
};

export const getNextTonic = (
  arg,
  transformations = [ '+1+0' ],
) => {
  let nextChord = arg;
  let currentX = nextChord.rootNote.x;
  let currentY = nextChord.rootNote.y;
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

      const node = getTonnetzNode([ currentX, currentY ]);
      if (nextChord.type === 'major') {
        nextChord = getMajorTriad(node);
      } else {
        nextChord = getMinorTriad(node);
      }
    } else if (trans === 'p') {
      nextChord = pTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else if (trans === 'l') {
      nextChord = lTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else if (trans === 'r') {
      nextChord = rTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else if (trans === 'n') {
      nextChord = nTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else if (trans === 's') {
      nextChord = sTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else if (trans === 'h') {
      nextChord = hTransform(nextChord);
      currentX = nextChord.rootNote.x;
      currentY = nextChord.rootNote.y;
    } else {
      throw new Error('Invalid input to getNextTonic.');
    }
  }

  if (!nextChord) {
    throw new Error('Invalid input to getNextTonic.');
  }

  return nextChord;
};
