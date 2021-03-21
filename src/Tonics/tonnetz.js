module.exports = {};

// structure is 7x6
const tonnetz = [
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
const getTonnetzNode = (arg) => {
  let safeX;
  let safeY;
  if (typeof arg === 'string') {
    const found = findTonnetzNodeByNote(arg);
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

  const note = tonnetz[safeY][safeX] || null;
  if (!note) {
    throw new Error(`Invalid argument to getTonnetzNode. ${arg}`);
  }

  return {
    note,
    x: safeX,
    y: safeY,
  };
};

const findTonnetzNodeByNote = (note) => {
  for (let y = tonnetz.length - 1; y >= 0; y -= 1) {
    const found = tonnetz[y].findIndex((val) => val === note);
    if (found !== -1) {
      return getTonnetzNode([ found, y ]);
    }
  }

  return null;
};

const getMajorTriad = (arg) => {
  const node = convertArgToNode(arg);
  return {
    type: 'major',
    rootNote: node,
    nonRootNotes: [
      getTonnetzNode([ node.x, node.y + 1 ]),
      getTonnetzNode([ node.x + 1, node.y ]),
    ],
  };
};


const getMinorTriad = (arg) => {
  const node = convertArgToNode(arg);
  return {
    type: 'minor',
    rootNote: node,
    nonRootNotes: [
      getTonnetzNode([ node.x + 1, node.y - 1 ]),
      getTonnetzNode([ node.x + 1, node.y ]),
    ],
  };
};

const convertArgToNode = (node) => {
  if (Array.isArray(node)) {
    return getTonnetzNode(node);
  }

  return node;
};

const pTransform = ({
  type,
  rootNote,
}) => {
  if (type === 'major') {
    return getMinorTriad(rootNote);
  }

  return getMajorTriad(rootNote);
};


const lTransform = ({
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

const rTransform = ({
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

const nTransform = ({
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

const sTransform = ({
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

const hTransform = (
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

module.exports.tonnetz = tonnetz;
module.exports.getTonnetzNode = getTonnetzNode;
module.exports.findTonnetzNodeByNote = findTonnetzNodeByNote;
module.exports.getMajorTriad = getMajorTriad;
module.exports.getMinorTriad = getMinorTriad;
module.exports.pTransform = pTransform;
module.exports.lTransform = lTransform;
module.exports.rTransform = rTransform;
module.exports.nTransform = nTransform;
module.exports.sTransform = sTransform;
module.exports.hTransform = hTransform;
