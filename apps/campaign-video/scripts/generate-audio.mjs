/** biome-ignore-all lint/suspicious/noBitwiseOperators: ignore */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: ignore */
/** biome-ignore-all lint/style/useShorthandAssign: ignore */
import fs from "node:fs";
import path from "node:path";

const SR = 44_100;
const OUT = path.join(process.cwd(), "public", "audio");
fs.mkdirSync(OUT, { recursive: true });

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

class Mix {
  constructor(duration, channels = 2) {
    this.n = Math.ceil(duration * SR);
    this.channels = channels;
    this.data = Array.from(
      { length: channels },
      () => new Float32Array(this.n),
    );
  }

  add(index, value, pan = 0.5) {
    if (index < 0 || index >= this.n) return;
    if (this.channels === 1) {
      this.data[0][index] += value;
      return;
    }
    const angle = clamp(pan, 0, 1) * Math.PI * 0.5;
    this.data[0][index] += value * Math.cos(angle);
    this.data[1][index] += value * Math.sin(angle);
  }

  write(name, peak = 0.9, fadeIn = 0, fadeOut = 0) {
    let max = 0;
    for (let c = 0; c < this.channels; c++) {
      for (let i = 0; i < this.n; i++) {
        const v = Math.abs(this.data[c][i]);
        if (v > max) max = v;
      }
    }
    const scale = max > 0 ? peak / max : 1;
    const fadeInN = Math.floor(fadeIn * SR);
    const fadeOutN = Math.floor(fadeOut * SR);
    const bytes = 44 + this.n * this.channels * 2;
    const buffer = Buffer.alloc(bytes);

    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(bytes - 8, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(this.channels, 22);
    buffer.writeUInt32LE(SR, 24);
    buffer.writeUInt32LE(SR * this.channels * 2, 28);
    buffer.writeUInt16LE(this.channels * 2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(this.n * this.channels * 2, 40);

    let offset = 44;
    for (let i = 0; i < this.n; i++) {
      let fade = 1;
      if (fadeInN > 0 && i < fadeInN) fade *= i / fadeInN;
      if (fadeOutN > 0 && i > this.n - fadeOutN) {
        fade *= (this.n - i) / fadeOutN;
      }
      for (let c = 0; c < this.channels; c++) {
        let v = this.data[c][i] * scale * fade;
        v = Math.tanh(v * 1.08);
        v = Math.round(clamp(v, -1, 1) * 32_767);
        buffer.writeInt16LE(v, offset);
        offset += 2;
      }
    }

    fs.writeFileSync(path.join(OUT, name), buffer);
    const seconds = (this.n / SR).toFixed(2);
    console.log(
      `${name.padEnd(18)} ${seconds}s  ${(bytes / 1024 / 1024).toFixed(2)} MB`,
    );
  }
}

function adsr(t, dur, a = 0.008, d = 0.04, s = 0.72, r = 0.06) {
  if (t < 0 || t > dur) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r) return s;
  return Math.max(0, s * (1 - (t - (dur - r)) / r));
}

const waves = {
  square: (phase, duty) => (phase % 1 < duty ? 1 : -1),
  triangle: (phase) => 4 * Math.abs((phase % 1) - 0.5) - 1,
  sine: (phase) => Math.sin(phase * Math.PI * 2),
  saw: (phase) => 2 * (phase % 1) - 1,
};

function addTone(
  mix,
  start,
  dur,
  freq,
  {
    endFreq = freq,
    wave = "square",
    duty = 0.5,
    gain = 0.1,
    attack = 0.008,
    decay = 0.04,
    sustain = 0.72,
    release = 0.06,
    pan = 0.5,
    vibrato = 0,
    vibratoRate = 5.2,
    lowpass = 0,
    phaseOffset = 0,
  } = {},
) {
  const startN = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  let phase = phaseOffset;
  let lp = 0;
  const osc = waves[wave];

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const progress = i / Math.max(1, n - 1);
    const f = freq * (endFreq / freq) ** progress;
    const wobble = vibrato
      ? 1 + Math.sin(t * Math.PI * 2 * vibratoRate) * vibrato
      : 1;
    phase += (f * wobble) / SR;
    let value = osc(phase, duty);
    if (lowpass > 0) {
      lp += lowpass * (value - lp);
      value = lp;
    }
    value *= gain * adsr(t, dur, attack, decay, sustain, release);
    mix.add(startN + i, value, pan);
  }
}

function addNoise(
  mix,
  start,
  dur,
  {
    gain = 0.1,
    pan = 0.5,
    decay = 2,
    highpass = true,
    seed = Math.floor(start * 10_000) + 1,
    attack = 0.001,
    release = 0.02,
  } = {},
) {
  const startN = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  const random = mulberry32(seed);
  let previous = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let white = random() * 2 - 1;
    if (highpass) {
      const current = white;
      white = current - previous;
      previous = current;
    }
    const env =
      Math.min(1, t / Math.max(0.0001, attack)) *
      (1 - t / dur) ** decay *
      (t > dur - release ? Math.max(0, (dur - t) / release) : 1);
    mix.add(startN + i, white * gain * env, pan);
  }
}

function addKick(mix, start, gain = 0.5, pan = 0.5) {
  addTone(mix, start, 0.16, 148, {
    endFreq: 45,
    wave: "sine",
    gain,
    attack: 0.001,
    decay: 0.03,
    sustain: 0.6,
    release: 0.05,
    pan,
  });
  addNoise(mix, start, 0.012, { gain: gain * 0.4, decay: 4, pan });
}

function addSnare(mix, start, gain = 0.2, pan = 0.5, seed = 7) {
  addNoise(mix, start, 0.13, { gain, decay: 2.4, pan, seed });
  addTone(mix, start, 0.07, 190, {
    endFreq: 120,
    wave: "triangle",
    gain: gain * 0.7,
    decay: 0.03,
    sustain: 0.4,
    pan,
  });
}

function addHat(mix, start, gain = 0.06, pan = 0.6, open = false) {
  addNoise(mix, start, open ? 0.13 : 0.035, {
    gain,
    decay: open ? 1.6 : 2.8,
    pan,
    seed: Math.floor(start * 3000) + 13,
  });
}

function addCrash(mix, start, gain = 0.12, pan = 0.5) {
  addNoise(mix, start, 0.85, { gain, decay: 2.1, pan, seed: 991 });
  addNoise(mix, start, 0.5, {
    gain: gain * 0.6,
    decay: 2.8,
    pan: 0.25,
    seed: 992,
  });
  addNoise(mix, start, 0.5, {
    gain: gain * 0.6,
    decay: 2.8,
    pan: 0.75,
    seed: 993,
  });
}

function addNote(mix, barStart, beat, midiNote, beats, options = {}) {
  addTone(mix, barStart + beat * 0.5, beats * 0.5, midi(midiNote), options);
}

/* ------------------------------------------------------------------ */
/*  BACKGROUND MUSIC                                                    */
/* ------------------------------------------------------------------ */

const BPM = 120;
const BEAT = 60 / BPM; // 0.5s
const BAR = BEAT * 4; // 2s
const TOTAL_BARS = 50;
const BGM_DURATION = TOTAL_BARS * BAR; // 100s

const CHORDS = {
  Am: { root: 45, triad: [57, 60, 64] },
  F: { root: 41, triad: [53, 57, 60] },
  C: { root: 48, triad: [52, 55, 60] },
  G: { root: 43, triad: [55, 59, 62] },
  Dm: { root: 50, triad: [53, 57, 62] },
  E: { root: 40, triad: [52, 56, 59] },
};

const progression = [
  "Am",
  "F",
  "C",
  "Am",
  "Dm",
  "E",
  "Am",
  "F",
  "G",
  "Am",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "Dm",
  "Am",
  "F",
  "E",
  "Am",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "Am",
  "F",
  "C",
  "G",
  "E",
  "F",
  "G",
  "Am",
];

const sectionOf = (bar) => {
  if (bar < 3) return "intro";
  if (bar < 7) return "problem";
  if (bar < 10) return "solution";
  if (bar < 23) return "main";
  if (bar < 28) return "variation";
  if (bar < 36) return "manage";
  if (bar < 42) return "chorus";
  if (bar < 47) return "build";
  return "outro";
};

const bgm = new Mix(BGM_DURATION, 2);

const mainPhrase = [
  [
    [0, 76, 0.5],
    [0.5, 79, 0.5],
    [1, 81, 1],
    [2, 79, 0.5],
    [2.5, 76, 0.5],
    [3, 74, 1],
  ],
  [
    [4, 76, 0.5],
    [4.5, 72, 0.5],
    [5, 74, 1],
    [6, 76, 0.5],
    [6.5, 79, 0.5],
    [7, 81, 1],
  ],
  [
    [8, 84, 1],
    [9, 81, 0.5],
    [9.5, 79, 0.5],
    [10, 76, 1],
    [11, 74, 0.5],
    [11.5, 76, 0.5],
  ],
  [
    [12, 79, 1],
    [13, 76, 1],
    [14, 74, 0.5],
    [14.5, 72, 0.5],
    [15, 69, 1],
  ],
];

const chorusPhrase = [
  [
    [0, 81, 0.5],
    [0.5, 84, 0.5],
    [1, 88, 1],
    [2, 84, 0.5],
    [2.5, 81, 0.5],
    [3, 79, 1],
  ],
  [
    [4, 81, 0.5],
    [4.5, 79, 0.5],
    [5, 76, 1],
    [6, 79, 1],
    [7, 81, 0.5],
    [7.5, 84, 0.5],
  ],
  [
    [8, 86, 1],
    [9, 84, 0.5],
    [9.5, 81, 0.5],
    [10, 79, 1],
    [11, 76, 1],
  ],
  [
    [12, 79, 1],
    [13, 81, 0.5],
    [13.5, 79, 0.5],
    [14, 76, 1],
    [15, 72, 1],
  ],
];

const managePhrase = [
  [
    [0, 72, 1],
    [1, 76, 1],
    [2, 79, 1],
    [3, 76, 1],
  ],
  [
    [4, 74, 1],
    [5, 72, 1],
    [6, 69, 1.5],
  ],
  [
    [8, 72, 1],
    [9, 76, 1],
    [10, 81, 1],
    [11, 79, 1],
  ],
  [
    [12, 76, 2],
    [14, 74, 1],
    [15, 72, 1],
  ],
];

const problemPhrase = [
  [
    [0, 69, 0.5],
    [0.5, 69, 0.5],
    [1, 68, 0.5],
    [1.5, 69, 0.5],
    [2, 71, 1],
    [3, 69, 1],
  ],
  [
    [4, 69, 0.5],
    [4.5, 69, 0.5],
    [5, 68, 0.5],
    [5.5, 69, 0.5],
    [6, 72, 1],
    [7, 68, 1],
  ],
];

const solutionPhrase = [
  [
    [0, 69, 0.5],
    [0.5, 72, 0.5],
    [1, 76, 0.5],
    [1.5, 81, 0.5],
    [2, 84, 1],
    [3, 79, 1],
  ],
  [
    [4, 81, 0.5],
    [4.5, 84, 0.5],
    [5, 88, 1],
    [6, 84, 1],
    [7, 81, 1],
  ],
  [
    [8, 84, 1],
    [9, 81, 0.5],
    [9.5, 84, 0.5],
    [10, 88, 2],
  ],
];

const buildPhrase = [
  [
    [0, 69, 0.5],
    [0.5, 72, 0.5],
    [1, 76, 0.5],
    [1.5, 79, 0.5],
    [2, 81, 0.5],
    [2.5, 84, 0.5],
    [3, 88, 1],
  ],
  [
    [4, 84, 0.5],
    [4.5, 81, 0.5],
    [5, 79, 0.5],
    [5.5, 76, 0.5],
    [6, 79, 0.5],
    [6.5, 81, 0.5],
    [7, 84, 1],
  ],
  [
    [8, 81, 0.5],
    [8.5, 84, 0.5],
    [9, 88, 0.5],
    [9.5, 91, 0.5],
    [10, 88, 1],
    [11, 84, 1],
  ],
  [
    [12, 81, 0.5],
    [12.5, 84, 0.5],
    [13, 88, 0.5],
    [13.5, 91, 0.5],
    [14, 93, 2],
  ],
];

const arpPattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 1];

for (let bar = 0; bar < TOTAL_BARS; bar++) {
  const chordName = progression[bar];
  const chord = CHORDS[chordName];
  const barStart = bar * BAR;
  const section = sectionOf(bar);
  const localBar = bar % 4;

  const fullGroove = [
    "solution",
    "main",
    "variation",
    "chorus",
    "build",
  ].includes(section);
  const lightGroove = ["manage", "outro"].includes(section);

  /* Pad ------------------------------------------------------------- */
  if (["intro", "solution", "manage", "chorus", "outro"].includes(section)) {
    const padGain =
      section === "intro" ? 0.035 : section === "outro" ? 0.045 : 0.028;
    chord.triad.forEach((note, index) => {
      addTone(bgm, barStart, BAR * 0.98, midi(note), {
        wave: "triangle",
        gain: padGain,
        attack: 0.22,
        decay: 0.15,
        sustain: 0.75,
        release: 0.3,
        pan: 0.35 + index * 0.15,
        lowpass: 0.16,
      });
      addTone(bgm, barStart, BAR * 0.98, midi(note + 12), {
        wave: "sine",
        gain: padGain * 0.5,
        attack: 0.3,
        decay: 0.18,
        sustain: 0.6,
        release: 0.35,
        pan: 0.65 - index * 0.12,
      });
    });
  }

  /* Bass ------------------------------------------------------------ */
  if (section === "intro") {
    if (bar % 2 === 0) {
      addTone(bgm, barStart, BAR * 0.9, midi(chord.root), {
        wave: "triangle",
        gain: 0.16,
        attack: 0.02,
        decay: 0.08,
        sustain: 0.65,
        release: 0.25,
        lowpass: 0.1,
      });
    }
  } else if (section === "problem") {
    for (let step = 0; step < 8; step++) {
      const note = chord.root + (step % 4 === 2 ? 12 : step % 4 === 3 ? 7 : 0);
      addNote(bgm, barStart, step * 0.5, note, 0.42, {
        wave: "triangle",
        gain: 0.17,
        attack: 0.004,
        decay: 0.03,
        sustain: 0.55,
        release: 0.03,
        lowpass: 0.18,
      });
    }
  } else if (section === "outro") {
    addTone(bgm, barStart, BAR * 0.95, midi(chord.root), {
      wave: "triangle",
      gain: 0.18,
      attack: 0.02,
      decay: 0.1,
      sustain: 0.8,
      release: 0.4,
      lowpass: 0.12,
    });
  } else if (section === "manage") {
    addNote(bgm, barStart, 0, chord.root, 1.7, {
      wave: "triangle",
      gain: 0.14,
      attack: 0.01,
      decay: 0.08,
      sustain: 0.6,
      release: 0.12,
      lowpass: 0.14,
    });
    addNote(bgm, barStart, 2.5, chord.root + 7, 1.2, {
      wave: "triangle",
      gain: 0.11,
      attack: 0.01,
      decay: 0.06,
      sustain: 0.5,
      release: 0.1,
      lowpass: 0.14,
    });
  } else {
    const pattern = [0, 0, 12, 0, 7, 0, 12, 7];
    for (let step = 0; step < 8; step++) {
      const octave = pattern[step];
      addNote(bgm, barStart, step * 0.5, chord.root + octave, 0.44, {
        wave: "triangle",
        gain: section === "chorus" ? 0.19 : 0.165,
        attack: 0.004,
        decay: 0.035,
        sustain: 0.55,
        release: 0.035,
        lowpass: 0.2,
        pan: 0.45,
      });
    }
  }

  /* Arpeggio -------------------------------------------------------- */
  if (section !== "problem" || bar >= 5) {
    const arpGain =
      section === "intro"
        ? 0.042
        : section === "chorus"
          ? 0.055
          : section === "build"
            ? 0.06
            : 0.045;
    const stepDur = section === "intro" ? 0.25 : 0.125;
    const steps = Math.round(BAR / stepDur);
    for (let step = 0; step < steps; step++) {
      const index = arpPattern[step % arpPattern.length];
      const note = chord.triad[index % 3] + 12 + (index >= 3 ? 12 : 0);
      addTone(bgm, barStart + step * stepDur, stepDur * 0.82, midi(note), {
        wave: "square",
        duty: 0.125,
        gain: arpGain * (step % 4 === 0 ? 1 : 0.72),
        attack: 0.003,
        decay: 0.02,
        sustain: 0.45,
        release: 0.02,
        pan: step % 2 === 0 ? 0.35 : 0.65,
        lowpass: 0.32,
      });
    }
  }

  /* Sparkle/counter line ------------------------------------------- */
  if (["chorus", "build", "outro"].includes(section) && bar % 2 === 0) {
    const sparkleNotes = [84, 88, 91, 96];
    sparkleNotes.forEach((note, index) => {
      addTone(bgm, barStart + 0.5 + index * 0.5, 0.22, midi(note), {
        wave: "sine",
        gain: 0.022,
        attack: 0.002,
        decay: 0.04,
        sustain: 0.3,
        release: 0.12,
        pan: index % 2 === 0 ? 0.2 : 0.8,
      });
    });
  }

  /* Lead melody ----------------------------------------------------- */
  let phrase = null;
  if (section === "problem" && bar >= 4)
    phrase = problemPhrase[localBar % problemPhrase.length];
  if (section === "solution")
    phrase = solutionPhrase[localBar % solutionPhrase.length];
  if (section === "main" || section === "variation")
    phrase = mainPhrase[localBar];
  if (section === "manage") phrase = managePhrase[localBar];
  if (section === "chorus") phrase = chorusPhrase[localBar];
  if (section === "build") phrase = buildPhrase[localBar];
  if (section === "outro" && bar === 49)
    phrase = [
      [0, 81, 3],
      [3, 88, 2],
    ];

  if (phrase) {
    for (const [beat, note, beats] of phrase) {
      const leadGain =
        section === "problem"
          ? 0.055
          : section === "chorus"
            ? 0.105
            : section === "build"
              ? 0.09
              : 0.085;
      addNote(bgm, barStart, beat, note, beats * 0.92, {
        wave: "square",
        duty: 0.25,
        gain: leadGain,
        attack: 0.006,
        decay: 0.05,
        sustain: 0.66,
        release: 0.06,
        vibrato: 0.004,
        vibratoRate: 5.6,
        lowpass: 0.28,
        pan: 0.5,
      });
      // Echo taps
      addNote(bgm, barStart + 0.25, beat, note, beats * 0.85, {
        wave: "square",
        duty: 0.25,
        gain: leadGain * 0.22,
        attack: 0.006,
        decay: 0.05,
        sustain: 0.5,
        release: 0.08,
        lowpass: 0.24,
        pan: 0.28,
      });
      addNote(bgm, barStart + 0.5, beat, note, beats * 0.8, {
        wave: "square",
        duty: 0.25,
        gain: leadGain * 0.1,
        attack: 0.006,
        decay: 0.05,
        sustain: 0.45,
        release: 0.1,
        lowpass: 0.22,
        pan: 0.72,
      });
    }
  }

  /* Drums ----------------------------------------------------------- */
  if (section === "intro") {
    if (bar % 2 === 0) addKick(bgm, barStart, 0.18);
    if (bar >= 2) {
      [1, 2, 3].forEach((beat) =>
        addHat(bgm, barStart + beat * 0.5, 0.025, 0.6),
      );
    }
    if (bar === 2) {
      addSnare(bgm, barStart + 1.5, 0.05);
      addSnare(bgm, barStart + 3.5, 0.08);
    }
  } else if (section === "problem") {
    addKick(bgm, barStart, 0.34);
    addKick(bgm, barStart + 1, 0.26);
    if (bar >= 5) {
      addSnare(bgm, barStart + 0.5, 0.11);
      addSnare(bgm, barStart + 2.5, 0.11);
    }
    for (let step = 0; step < 8; step++) {
      addHat(bgm, barStart + step * 0.25, 0.022, step % 2 === 0 ? 0.35 : 0.68);
    }
  } else if (section === "build") {
    for (let beat = 0; beat < 4; beat++) addKick(bgm, barStart + beat, 0.36);
    addSnare(bgm, barStart + 0.5, 0.13);
    addSnare(bgm, barStart + 2.5, 0.13);
    for (let step = 0; step < 16; step++) {
      addHat(bgm, barStart + step * 0.125, 0.022, step % 4 === 2 ? 0.7 : 0.35);
    }
    if (bar >= 45) {
      for (let step = 0; step < 16; step++) {
        addSnare(
          bgm,
          barStart + step * 0.125,
          0.035 + step * 0.004,
          0.5,
          200 + bar * 10 + step,
        );
      }
    }
  } else if (section === "outro") {
    if (bar === 47) {
      addCrash(bgm, barStart, 0.14);
      addKick(bgm, barStart, 0.3);
      addKick(bgm, barStart + 2, 0.22);
      addSnare(bgm, barStart + 0.5, 0.09);
      addSnare(bgm, barStart + 2.5, 0.09);
    }
    if (bar === 48) addCrash(bgm, barStart, 0.1);
  } else if (fullGroove) {
    addKick(bgm, barStart, 0.33);
    addKick(bgm, barStart + 1, 0.3);
    addKick(bgm, barStart + (section === "variation" ? 1.75 : 2), 0.24);
    addSnare(bgm, barStart + 0.5, 0.12);
    addSnare(bgm, barStart + 2.5, 0.12);
    for (let step = 0; step < 8; step++) {
      addHat(
        bgm,
        barStart + step * 0.25,
        step % 2 === 0 ? 0.028 : 0.04,
        step % 2 === 0 ? 0.32 : 0.7,
        step === 7,
      );
    }
    if (section === "chorus" && bar % 2 === 0) addCrash(bgm, barStart, 0.08);
    if (bar % 8 === 7) {
      addSnare(bgm, barStart + 3.25, 0.09, 0.5, 501);
      addSnare(bgm, barStart + 3.5, 0.11, 0.5, 502);
      addSnare(bgm, barStart + 3.75, 0.13, 0.5, 503);
    }
  } else if (lightGroove) {
    addKick(bgm, barStart, 0.22);
    addKick(bgm, barStart + 2, 0.18);
    if (bar % 2 === 0) addSnare(bgm, barStart + 2.5, 0.07);
    for (let step = 0; step < 4; step++) {
      addHat(bgm, barStart + step * 0.5, 0.018, 0.55);
    }
  }
}

/* Riser transition 84s -> 88s and 94s */
function addRiser(mix, start, duration, gain = 0.08) {
  const startN = Math.floor(start * SR);
  const n = Math.floor(duration * SR);
  const random = mulberry32(Math.floor(start * 77));
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const white = random() * 2 - 1;
    lp += (0.05 + t * 0.5) * (white - lp);
    const env = t ** 1.8;
    const tone = Math.sin(2 * Math.PI * (180 + t * 900) * (i / SR)) * 0.2;
    mix.add(startN + i, (lp * 0.7 + tone) * gain * env, 0.5);
  }
}

addRiser(bgm, 84.0, 3.6, 0.06);
addRiser(bgm, 14.0, 0.9, 0.04);

bgm.write("bgm.wav", 0.82, 0.8, 2.4);

/* ------------------------------------------------------------------ */
/*  SOUND EFFECTS                                                       */
/* ------------------------------------------------------------------ */

function sfx(name, duration, build, { peak = 0.9, fadeIn = 0 } = {}) {
  const mix = new Mix(duration, 1);
  build(mix);
  mix.write(`sfx-${name}.wav`, peak, fadeIn, 0.02);
}

sfx("boot", 1.1, (m) => {
  addTone(m, 0, 0.85, 70, {
    endFreq: 620,
    wave: "sine",
    gain: 0.24,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.65,
    release: 0.15,
  });
  addNoise(m, 0, 0.85, { gain: 0.05, decay: 1.4, seed: 44 });
  [0.18, 0.32, 0.46, 0.6].forEach((t, i) => {
    addTone(m, t, 0.08, midi(72 + i * 4), {
      wave: "square",
      duty: 0.25,
      gain: 0.09,
      attack: 0.002,
      decay: 0.02,
      sustain: 0.4,
      release: 0.03,
    });
  });
});

sfx("click", 0.09, (m) => {
  addTone(m, 0, 0.045, 1180, {
    endFreq: 620,
    wave: "square",
    duty: 0.4,
    gain: 0.35,
    attack: 0.001,
    decay: 0.01,
    sustain: 0.4,
    release: 0.02,
  });
  addNoise(m, 0, 0.03, { gain: 0.12, decay: 3, seed: 61 });
});

sfx("pop", 0.14, (m) => {
  addTone(m, 0, 0.11, 420, {
    endFreq: 980,
    wave: "sine",
    gain: 0.32,
    attack: 0.002,
    decay: 0.03,
    sustain: 0.5,
    release: 0.04,
  });
  addTone(m, 0, 0.08, 840, {
    endFreq: 1680,
    wave: "triangle",
    gain: 0.09,
    attack: 0.002,
    decay: 0.02,
    sustain: 0.35,
    release: 0.03,
  });
});

sfx("whoosh", 0.55, (m) => {
  const startN = 0;
  const n = Math.floor(0.55 * SR);
  const random = mulberry32(808);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const white = random() * 2 - 1;
    lp += (0.03 + t * 0.35) * (white - lp);
    const env = Math.sin(Math.PI * t ** 0.7);
    m.add(startN + i, (lp * 0.8 + white * 0.15) * 0.3 * env, 0.5);
  }
  addTone(m, 0.04, 0.45, 220, {
    endFreq: 780,
    wave: "sine",
    gain: 0.05,
    attack: 0.05,
    decay: 0.04,
    sustain: 0.5,
    release: 0.15,
  });
});

sfx("switch", 0.32, (m) => {
  addTone(m, 0, 0.16, 520, {
    endFreq: 1040,
    wave: "square",
    duty: 0.3,
    gain: 0.16,
    attack: 0.002,
    decay: 0.02,
    sustain: 0.5,
    release: 0.04,
  });
  addTone(m, 0.1, 0.14, 780, {
    endFreq: 1560,
    wave: "triangle",
    gain: 0.2,
    attack: 0.002,
    decay: 0.02,
    sustain: 0.5,
    release: 0.05,
  });
  addNoise(m, 0, 0.22, { gain: 0.06, decay: 2, seed: 77 });
});

sfx("success", 0.62, (m) => {
  [72, 76, 79, 84].forEach((note, index) => {
    addTone(m, index * 0.075, 0.34, midi(note), {
      wave: "square",
      duty: 0.25,
      gain: 0.14,
      attack: 0.002,
      decay: 0.03,
      sustain: 0.55,
      release: 0.12,
    });
    addTone(m, index * 0.075, 0.26, midi(note + 12), {
      wave: "sine",
      gain: 0.05,
      attack: 0.002,
      decay: 0.02,
      sustain: 0.35,
      release: 0.1,
    });
  });
});

sfx("error", 0.34, (m) => {
  for (let step = 0; step < 4; step++) {
    addTone(m, step * 0.07, 0.07, 150 - step * 8, {
      wave: "square",
      duty: 0.5,
      gain: 0.18,
      attack: 0.001,
      decay: 0.01,
      sustain: 0.7,
      release: 0.02,
    });
  }
  addNoise(m, 0.02, 0.26, { gain: 0.05, decay: 1.5, seed: 33 });
});

sfx("type", 0.65, (m) => {
  const random = mulberry32(2026);
  for (let i = 0; i < 8; i++) {
    const t = i * 0.07 + random() * 0.012;
    addNoise(m, t, 0.025, { gain: 0.11, decay: 4, seed: 100 + i });
    addTone(m, t, 0.02, 1400 + random() * 900, {
      wave: "square",
      duty: 0.3,
      gain: 0.035,
      attack: 0.001,
      decay: 0.005,
      sustain: 0.4,
      release: 0.01,
    });
  }
});

sfx("ding", 0.9, (m) => {
  addTone(m, 0, 0.85, 1568, {
    wave: "sine",
    gain: 0.18,
    attack: 0.002,
    decay: 0.12,
    sustain: 0.35,
    release: 0.45,
  });
  addTone(m, 0.01, 0.7, 2093, {
    wave: "sine",
    gain: 0.07,
    attack: 0.002,
    decay: 0.1,
    sustain: 0.25,
    release: 0.4,
  });
  addTone(m, 0, 0.5, 3136, {
    wave: "sine",
    gain: 0.025,
    attack: 0.002,
    decay: 0.08,
    sustain: 0.2,
    release: 0.35,
  });
});

sfx("glitch", 0.5, (m) => {
  const random = mulberry32(999);
  for (let i = 0; i < 20; i++) {
    const start = random() * 0.42;
    const dur = 0.015 + random() * 0.05;
    addNoise(m, start, dur, {
      gain: 0.08 + random() * 0.12,
      decay: 1,
      seed: 400 + i,
    });
    addTone(m, start, dur, 80 + random() * 1800, {
      wave: "square",
      duty: 0.5,
      gain: 0.03 + random() * 0.08,
      attack: 0.001,
      decay: 0.005,
      sustain: 0.5,
      release: 0.01,
    });
  }
});

sfx("tick", 0.08, (m) => {
  addTone(m, 0, 0.035, 1900, {
    wave: "square",
    duty: 0.2,
    gain: 0.12,
    attack: 0.001,
    decay: 0.005,
    sustain: 0.3,
    release: 0.015,
  });
});

sfx("dialog", 0.28, (m) => {
  addTone(m, 0, 0.09, 600, {
    endFreq: 900,
    wave: "sine",
    gain: 0.2,
    attack: 0.002,
    decay: 0.02,
    sustain: 0.5,
    release: 0.04,
  });
  addTone(m, 0.09, 0.1, 900, {
    endFreq: 1200,
    wave: "triangle",
    gain: 0.12,
    attack: 0.002,
    decay: 0.02,
    sustain: 0.45,
    release: 0.05,
  });
});

sfx("badge", 0.34, (m) => {
  addTone(m, 0, 0.07, 1760, {
    wave: "sine",
    gain: 0.14,
    attack: 0.001,
    decay: 0.01,
    sustain: 0.4,
    release: 0.03,
  });
  addTone(m, 0.08, 0.12, 2200, {
    wave: "sine",
    gain: 0.09,
    attack: 0.001,
    decay: 0.02,
    sustain: 0.35,
    release: 0.08,
  });
});

sfx("riser", 1.6, (m) => {
  addRiser(m, 0, 1.55, 0.12);
});

sfx("poweroff", 1.0, (m) => {
  addTone(m, 0, 0.85, 880, {
    endFreq: 55,
    wave: "sine",
    gain: 0.22,
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.2,
  });
  addNoise(m, 0.35, 0.4, { gain: 0.05, decay: 2, seed: 711 });
});
