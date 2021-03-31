import {
  Note,
} from '@tonaljs/tonal';

// structure is 7x6
export const tonnetz = [
  [
    'G',
    'D',
    'A',
    'E',
    'B',
    'E',
    'C#',
  ],

  [
    'B',
    'F#',
    'C#',
    'G#',
    'D#',
    'A#',
    'F',
  ],

  [
    'D#',
    'A#',
    'F',
    'C',
    'G',
    'D',
    'A',
  ],

  [
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#',
    'C#',
  ],

  [
    'B',
    'F#',
    'C#',
    'G#',
    'D#',
    'A#',
    'F',
  ],

  [
    'D#',
    'A#',
    'F',
    'C',
    'G',
    'D',
    'A',
  ],
];

// When wrapped around itself in both directions, the Tonnetz becomes a torus
// and may be navigated around indefinitely through PLR/NSH transformations.
export const getTonnetzNode = (arg, octave = 3) => {
  let safeX;
  let safeY;
  if (typeof arg === 'string') {
    const found = findTonnetzNodeByNote(arg, octave);
    if (!found) {
      throw new Error(`Invalid argument provided to getTonnetzNode. ${arg}`);
    }

    safeX = found.x;
    safeY = found.y;
  } else if (Array.isArray(arg)) {
    safeX = arg[0];
    safeY = arg[1];
  } else {
    const attempt = convertArgToNode(arg);
    if (!attempt || !('x' in attempt) || !('y' in attempt)) {
      throw new Error(`Invalid argument to getTonnetzNode. ${arg}`);
    }

    safeX = attempt.x;
    safeY = attempt.y;
  }

  safeX = Math.abs(safeX);
  safeY = Math.abs(safeY);

  if (safeY >= tonnetz.length) {
    safeY = safeY % tonnetz.length;
  }

  if (safeX >= tonnetz[safeY].length) {
    safeX = safeX % tonnetz[safeY].length;
  }

  let note = tonnetz[safeY][safeX] || null;
  if (!note) {
    throw new Error(`Invalid argument to getTonnetzNode. ${arg}`);
  }

  note += octave;

  return {
    note,
    x: safeX,
    y: safeY,
  };
};

export const findTonnetzNodeByNote = (note, octave = 3) => {
  for (let y = tonnetz.length - 1; y >= 0; y -= 1) {
    const found = tonnetz[y].findIndex((val) => val === note);
    if (found !== -1) {
      return getTonnetzNode([ found, y ], octave);
    }
  }

  return null;
};

const keys = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const getMajorTriad = (arg) => {
  const root = convertArgToNode(arg);
  root.note = Note.simplify(root.note);
  const octave = Number(root.note[root.note.length - 1]) || 3;

  const overtoneOne = getTonnetzNode([ root.x, root.y + 1 ], octave);
  let ot1Note = overtoneOne.note;
  let ot1Over = false;
  if (keys.indexOf(ot1Note) <= keys.indexOf(root.note)) {
    ot1Over = true;
    overtoneOne.note = Note.simplify(overtoneOne.note.slice(0, -1) + (octave + 1));
  }

  const overtoneTwo = getTonnetzNode([ root.x + 1, root.y ], octave);
  let ot2Note = overtoneTwo.note;
  if (ot1Over || keys.indexOf(ot2Note) <= keys.indexOf(root.note)) {
    overtoneTwo.note = Note.simplify(overtoneTwo.note.slice(0, -1) + (octave + 1));
  }

  const notes = [
    root,
    overtoneOne,
    overtoneTwo
  ];

  const type = 'major';

  return {
    type,
    notes,
  };
};

export const getMinorTriad = (arg) => {
  const root = convertArgToNode(arg);
  root.note = Note.simplify(root.note);

  const octave = Number(root.notes[0][root.notes[0].length - 1]) || 3;

  const overtoneOne = getTonnetzNode([ root.x + 1, root.y - 1 ], octave);
  let ot1Note = overtoneOne.note;
  let ot1Over = false;
  if (keys.indexOf(ot1Note) <= keys.indexOf(root.note)) {
    ot1Over = true;
    overtoneOne.note = Note.simplify(overtoneOne.note.slice(0, -1) + (octave + 1));
  }

  const overtoneTwo = getTonnetzNode([ root.x + 1, root.y ], octave);
  let ot2Note = overtoneTwo.note;
  if (ot1Over || keys.indexOf(ot2Note) <= keys.indexOf(root.note)) {
    overtoneTwo.note = Note.simplify(overtoneTwo.note.slice(0, -1) + (octave + 1));
  }

  const notes = [
    root,
    overtoneOne,
    overtoneTwo,
  ];

  const type = 'minor';

  return {
    type,
    notes,
  };
};

export const convertArgToNode = (node, octave = 3) => {
  if (Array.isArray(node)) {
    return getTonnetzNode(node, octave);
  }

  return node;
};

export const pTransform = ({
  type,
  rootNote,
}) => {
  if (type === 'major') {
    return getMinorTriad(rootNote);
  }

  return getMajorTriad(rootNote);
};


export const lTransform = ({
  type,
  rootNote: {
    x,
    y,
  },
}) => {
  if (type === 'major') {
    return getMinorTriad([ x + 1, y ]);
  }

  return getMajorTriad([ x - 1, y ]);
};

export const rTransform = ({
  type,
  rootNote: {
    x,
    y,
  },
}) => {
  if (type === 'major') {
    return getMinorTriad([ x - 1, y ]);
  }

  return getMajorTriad([ x + 1, y ]);
};

export const nTransform = ({
  type,
  rootNote: {
    x,
    y,
  },
}) => {
  if (type === 'major') {
    return getMinorTriad([ x - 1, y + 1 ]);
  }

  return getMajorTriad([ x + 1, y - 1 ])
};

export const sTransform = ({
  type,
  rootNote: {
    x,
    y,
  },
}) => {
  if (type === 'major') {
    return getMinorTriad([ x, y - 2 ]);
  }

  return getMajorTriad([ x, y + 2 ]);
};

export const hTransform = (
  {
    type,
    rootNote: {
      x,
      y,
    },
  },

  direction = 1,
) => {
  if (type === 'major') {
    return getMajorTriad([ x + 1 * direction, y + 3 * direction ]);
  }

  return getMinorTriad([ x + 1 * direction, y + 3 * direction ]);
};
