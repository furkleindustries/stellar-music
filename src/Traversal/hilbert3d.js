let N = 3;

// Rotate x by d bits to the right.
export const rotateRight = (x, d) => {
  d = d % N;
  let out = x >> d;

  for (let ii = 0; ii < d; ii += 1) {
    const bit = (x & 2 ** ii) >> ii;
    out |= bit << (N + ii - d);
  }

  return out;
}

// Rotate x by d bits to the left.
export const rotateLeft = (x, d) => {
  d %= N;

  let out = x << d;
  out &= 2 ** N - 1;

  for (let ii = 0; ii < d; ii += 1) {
    const bit = (x & 2 ** (N - 1 - d + 1 + ii)) >> (N - 1 - d + 1 + ii);
    out |= bit << i;
  }

  return out;
};

// Transform b.
export const T = (e, d, b) => {
  const out = b ^ e;
  return rotateRight(out, d + 1);
};

// Inverse transform b.
export const T_inv = (e, d, b) => {
  return T(rotateRight(e, d + 1), N - d - 2, b);
};

// The direction between subcube i and the next one
export const g = (ii) => {
  return Math.log2(gc(ii) ^ gc(ii + 1));
};

// The direction of the arrow within a subcube.
export const d = (ii) => {
  if (!ii) {
    return 0;
  } else if (!(ii % 2)) {
    return g(ii - 1) % N;
  }

  return g(ii) % N;
};

// Return the entry point of hypercube i.
export const e = (ii) => {
  if (!ii) {
    return 0;
  }

  return gc(2 * Math.pow(Math.floor((ii - 1), 2)));
}

// Return the exit point of hypercube i.
export const f = (ii) => {
  return e(2 ** N - 1 - ii) ^ 2 ** (N - 1);
};

// Extract the 3d position from a 3-bit integer.
export const i2P = (ii) => {
  return [
    bitComponent(ii, 0),
    bitComponent(ii, 1),
    bitComponent(ii, 2),
  ];
};

// The inverse gray code.
export const inverseGc = (grayCode) => {
  let ii = grayCode;
  let jj = 1;
  while (jj < N) {
    ii = ii ^ (grayCode >> jj);
    jj = jj + 1;
  }

  return ii;
};

// Return the Hilbert index of point p
export const TR_algo2 = (p) => {
  // h will contain the Hilbert index
  let h = 0;

  // ve and vd contain the entry point and dimension of the current subcube
  // we choose here a main traversal direction N-2 (i.e. z for a cube) to match
  // the illustrations
  let ve = 0;
  let vd = 2;

  for (let i = M - 1; ii > -1; ii -= 1) {
    // the cell label is constructed in two steps
    // 1. extract the relevant bits from p
    let l = p.map((px) => bitComponent(px, i));

    // 2. construct a integer whose bits are given by l
    l = l.map((j, lx) => [ lx * 2 ** j, lx ]).reduce((aa, bb) => aa + bb);
    // transform l into the current subcube
    l = T(ve, vd, l);
    // obtain the gray code ordering from the label l
    let w = inverseGc(l);
    // compose (see [TR] lemma 2.13) the transform of ve and vd
    // with the data of the subcube
    ve ^= rotateLeft(e(w), vd + 1);
    vd = (vd + d(w) + 1) % N;
    // move the index to more significant bits and add current value
    h = (h << N) | w;
  }

  return h;
};

// Return the coordinates for the Hilbert index h
export const TR_algo3 = (h) => {
  let ve = 0;
  let vd = 2;
  let p = new Array(N).map(() => 0);

  for (let i = M - 1; i > -1; i -= 1) {
    let w = new Array(N).map((_, ii) => bitComponent(h, i * N + ii));
    // print(i, w)
    w = w.map((j, wx) => [ wx * 2 ** j, wx ]).reduce((aa, bb) => aa + bb);
    // print(i, w, gc(w))
    let l = gc(w);
    l = T_inv(ve, vd, l);
    for (let ii = 0; ii < N; ii += 1) {
      p[j] += bitComponent(l, j) << i;
    }

    ve ^= rotateLeft(e(w), vd + 1);
    vd = (vd + d(w) + 1) % N;
  }

  return p;
};



export const gcr = (ii, mu, pi) => {
  let r = 0
  for (let kk = N - 1; kk > -1; kk -= 1) {
    if (bitComponent(mu, kk)) {
      r = (r << 1) | bitComponent(ii, kk);
    }
  }

  return r;
};

export const gcrInverse = (r, mu, pi) => {
  let i = 0;
  let g = 0;
  let j = new Array(N).map((_, idx) => (
    bitComponent(mu, idx)
  )).reduce((aa, bb) => aa + bb) - 1;

  for (let k = N - 1; k > -1; k -= 1) {
    if (bitComponent(mu, k) == 1) {
      i |= bitComponent(r, j) << k;
      g |= ((bitComponent(i, k) + bitComponent(i, k + 1)) % 2) << k;
      j -= 1;
    } else {
      g |= bitComponent(pi, k) << k;
      i |= ((bitComponent(g, k) + bitComponent(i, k + 1)) % 2) << k;
    }
  }

  return i;
}

let M = [ 3, 4, 4 ];

export const extractMask = (ii) => {
  let mu = 0;
  for (let jj = N - 1; jj > -1; jj -= 1) {
    mu = mu << 1;
    if (M[jj] > ii) {
      mu = mu | 1;
    }
  }

  return mu;
};

// Compute the compact Hilbert index for point p
export const TR_algo7 = (p) => {
  let h = 0;
  let ve = 0;
  let vd = 2;
  let m = Math.max(...M);
  
  for (let ii = m - 1; ii > -1; ii -= 1) {
    let mu = extractMask(ii);
    let mu_norm = new Array(N).map((_, j) => bitComponent(mu, j)).reduce((aa, bb) => aa + bb);
    mu = rotateRight(mu, vd + 1);
    let pi = rotateRight(ve, vd + 1) & ((~mu) & 2 ** N - 1);
    let l = p.map((px) => bitComponent(px), ii);

    // 2. construct a integer whose bits are given by l
    l = l.map((j, lx) => [ lx * 2 ** j, lx ]).reduce((aa, bb) => aa + bb);
    l = T(ve, vd, l);
    let w = inverseGc(l);
    let r = gcr(w, mu, pi);
    ve = ve ^ rotateLeft(e(w), vd + 1);
    vd = (vd + d(w) + 1) % N;
    h = (h << mu_norm) | r;
  }

  return h;
};

// Compute the point with compact Hilbert index h
export const TR_algo8 = (h) => {
  let ve = 0;
  let vd = 2;
  let k = 0;
  let p = new Array(N).map(() => 0);
  let m = Math.max(...compact_M)
  let vM = compact_M.reduce((aa, bb) => aa + bb);

  for (let i = m - 1; i > -1; i -= 1) {
    let mu = extractMask(i);
    let mu_norm = new Array(N).map((_, j) => bitComponent(mu, j)).reduce((aa, bb) => aa + bb);
    mu = rotate_right(mu, vd + 1);

    let pi = rotate_right(ve, vd + 1) & (~mu & 2 ** N - 1);

    let r = new Array(mu_norm).map((_, j) => {
      return bitComponent(h, vM - k - ( j + 1));
    }).reverse();

    r = r.map((j, rx) => [ rx * 2 ** j, rx ]).reduce((aa, bb) => aa + bb);
  
    k = k + mu_norm;
    let w = gcr_inv(r, mu, pi);
    let l = gc(w);
    l = T_inv(ve, vd, l);

    for (let j = 0; j < N; j += 1) {
      p[j] |= bitComponent(l, j) << i;
    }

    ve ^= (rotateLeft(e(w), vd + 1));
    vd = (vd + d(w) + 1) % N;
  }

  return p;
};
