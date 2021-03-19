class Lorenz {
  /* Chaotic attractor for the Lorenz system.
  The Lorenz attractor is a system of three non-linear ordinary differential
  equations. These differential equations define a continuous-time dynamical
  system that exhibits chaotic dynamics associated with the fractal properties
  of the attractor.
  :Parent: :py:class:`PyoObject`
  :Args:
      pitch: float or PyoObject, optional
          Controls the speed, in the range 0 -> 1, of the variations. With values
          below 0.2, this object can be used as a low frequency oscillator (LFO)
          and above 0.2, it will generate a broad spectrum noise with harmonic peaks.
          Defaults to 0.25.
      chaos: float or PyoObject, optional
          Controls the chaotic behavior, in the range 0 -> 1, of the oscillator.
          0 means nearly periodic while 1 is totally chaotic. Defaults to 0.5
      stereo, boolean, optional
          If True, 2 streams will be generated, one with the X variable signal of
          the algorithm and a second composed of the Y variable signal of the algorithm.
          These two signal are strongly related in their frequency spectrum but
          the Y signal is out-of-phase by approximatly 180 degrees. Useful to create
          alternating LFOs. Available at initialization only. Defaults to False.
  .. seealso::
      :py:class:`Rossler`, :py:class:`ChenLee`
  >>> s = Server().boot()
  >>> s.start()
  >>> a = Lorenz(pitch=.003, stereo=True, mul=.2, add=.2)
  >>> b = Lorenz(pitch=[.4,.38], mul=a).out()
  */

  constructor(pitch=0.25, chaos=0.5, stereo=False, mul=1, add=0) {
    pyoArgsAssert(this, "OObOO", pitch, chaos, stereo, mul, add)
    this._pitch = pitch
    this._chaos = chaos
    this._stereo = stereo
    pitch, chaos, mul, add, lmax = convertArgsToLists(pitch, chaos, mul, add)
    this._base_objs = []
    this._alt_objs = []
    for (let i of range(lmax)) {
        this._base_objs.append(Lorenz_base(wrap(pitch, i), wrap(chaos, i), wrap(mul, i), wrap(add, i)))
        if (this._stereo) {
            this._base_objs.append(LorenzAlt_base(this._base_objs[-1], wrap(mul, i), wrap(add, i)))
        }
    }
    this._init_play();
  }

  setPitch = (x) => {
      /*
      Replace the `pitch` attribute.
      :Args:
          x: float or PyoObject
              new `pitch` attribute. {0. -> 1.}
      */
      pyoArgsAssert(this, "O", x)
      this._pitch = x
      x, lmax = convertArgsToLists(x)
      if this._stereo:
          [obj.setPitch(wrap(x, i)) for i, obj in enumerate(this._base_objs) if (i % 2) == 0]
      else:
          [obj.setPitch(wrap(x, i)) for i, obj in enumerate(this._base_objs)]
  };

  def setChaos(this, x):
      /*
      Replace the `chaos` attribute.
      :Args:
          x: float or PyoObject
              new `chaos` attribute. {0. -> 1.}
      */
      pyoArgsAssert(this, "O", x)
      this._chaos = x
      x, lmax = convertArgsToLists(x)
      if this._stereo:
          [obj.setChaos(wrap(x, i)) for i, obj in enumerate(this._base_objs) if (i % 2) == 0]
      else:
          [obj.setChaos(wrap(x, i)) for i, obj in enumerate(this._base_objs)]

  def ctrl(this, map_list=None, title=None, wxnoserver=False):
      this._map_list = [
          SLMap(0.0, 1.0, "lin", "pitch", this._pitch),
          SLMap(0.0, 1.0, "lin", "chaos", this._chaos),
          SLMapMul(this._mul),
      ]
      PyoObject.ctrl(this, map_list, title, wxnoserver)

  @property
  def pitch(this):
      """float or PyoObject. Speed of the variations."""
      return this._pitch

  @pitch.setter
  def pitch(this, x):
      this.setPitch(x)

  @property
  def chaos(this):
      """float or PyoObject. Chaotic behavior."""
      return this._chaos

  @chaos.setter
  def chaos(this, x):
      this.setChaos(x)