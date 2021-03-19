// Major key chord transformations:

// 1. Start at the bottom (I, the tonic chord)
// 2. Play a triad.
// 3. Roll to stay in the tonic. If yes, play one of the following chords, and return to 3.
//     3a1. Major triad
//     3a2. Major second (2st)
//     3a3. Sixth
//     3a4. Major seventh
//     3a5. Major ninth
//     3a6. Suspended
// 4. After leaving the tonic, further actions are one of the following:
//   4a. Switch to another blue box, and return to 4.
//     4a1. Go down or up.
//     4a2. Play a triad or one of the chords in the corresponding array.
//   4b. (If the tonic was left more than 1 frame prior) Keep playing the same chord.
//   4c. Switch to a green box.
//       4c1. Pick one green box corresponding to the X/Y position of the current blue box.
//       4c2. Play one of the chords in the corresponding array.
//       4c3. Return to the previous blue box on the next frame and continue from 4.
//   4d. If and only if a number of measures divisible by to the key modulation duration has been reached, change tonics and begin from 1.

const majorKeyBlueBoxes = [
  [
    'iim',
    [ '7', '9', 'b9' ]
  ],

  [
    [
      'iiim',
      [ 'm7' ]
    ],
    
    [
      'V',
      [ '7', '9', '11', '13', 'sus' ],
    ],
  ],

  [
    [
      'IV',
      [ '6', 'M7', 'm', 'm6' ],
    ],
    
    [
      'vim',
      [ 'm7', 'm9' ],
    ],
  ],

  [
    [
      'V',
      [ '7', '9', '11', '13', 'sus' ],
    ],
    
    [
      'iim',
      [ 'm7', 'm9' ],
    ],
  ],

  [
    [
      'I',
      [ '2', '6', 'M7', 'M9', 'sus' ],
    ],
  ],
];


const majorKeyGreenBoxes = [
  [
    [
      [
        'VI',
        [ '7', '9', 'b9' ],
      ],

      [
        '#I',
        [ 'dim7' ],
      ],
    ],
  ],

  [
    [
      [
        'VII',
        [ '7', '9', 'b9' ],
      ],

      [
        '#II',
        [ 'dim7' ],
      ],
    ],

    [
      [
        'III',
        [ '7', '9', 'b9' ],
      ],

      [
        '#V',
        [ 'dim7' ],
      ],
    ],
  ],

  [
    [
      [
        'I',
        [ '7', '9', 'b9' ],
      ],

      [
        'III',
        [ 'm7b5' ],
      ],
    ],

    [
      [
        'III',
        [ '7', '9', 'b9' ],
      ],

      [
        '#V',
        [ 'dim7' ],
      ],
    ],
  ],

  [
    [
      [
        'II',
        [ '7', '9', 'b9' ],
      ],

      [
        '#IV',
        [ 'm7b5' ],
      ],
    ],

    [
      [
        'VI',
        [ '7', '9', 'b9' ],
      ],

      [
        '#I',
        [ 'dim7' ],
      ],
    ],
  ],

  [
    [
      [
        'bVII',
        [ '9' ],
      ],

      [
        'IV',
        [ '/1' ],
      ],

      [
        'V',
        [ '/1' ],
      ],
    ],
  ],
];
