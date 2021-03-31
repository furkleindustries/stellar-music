export const routeModulationToSound = ({
  carrier,
  amplitudeModulator: am,
  frequencyModulator: fm,
}) => {
  if (am) {
    if (carrier.oscillator) {
      am.connect(carrier.amplifier.gain);
    } else {
      am.connect(carrier.gain);
    }

    am.start();
  }

  if (fm) {
    if (carrier.oscillator) {
      fm.connect(carrier.oscillator.frequency);
    } else {
      fm.connect(carrier.frequency);
    }

    fm.start();
  }
};
