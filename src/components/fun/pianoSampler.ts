// Plays the on-page keyboard with recorded piano notes.
//
// Samples are from the Salamander Grand Piano by Alexander Holm (a Yamaha C5),
// licensed CC-BY 3.0: https://archive.org/details/SalamanderGrandPianoV3
// One note is recorded every three semitones and re-pitched to cover the gaps,
// which is too small a stretch to hear. Each recording carries the real
// piano's attack and decay; releasing a key fades it out like a damper.

const SAMPLES: Record<string, number> = {
  C4: 60,
  Ds4: 63,
  Fs4: 66,
  A4: 69,
  C5: 72,
  Ds5: 75,
}; // File name -> MIDI note number

const NOTE_VOLUME = 0.8;
const DAMPER_TIME = 0.12; // Time constant of the fade after a key is released

interface Voice {
  gain: GainNode;
  source: AudioBufferSourceNode;
}

export class PianoSampler {
  private ctx: AudioContext | null = null;
  private output: AudioNode | null = null;
  private voices = new Map<string, Voice>();
  private rawSamples: Promise<[number, ArrayBuffer][]> | null = null;
  private buffers: Promise<[number, AudioBuffer][]> | null = null;

  // Download the samples ahead of time; decoding waits for the first note
  preload() {
    this.rawSamples ??= Promise.all(
      Object.entries(SAMPLES).map(([name, midi]) =>
        fetch(`/fun/piano/${name}.mp3`)
          .then((res) => res.arrayBuffer())
          .then((data): [number, ArrayBuffer] => [midi, data]),
      ),
    );
    return this.rawSamples;
  }

  private ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    }

    const ctx = new AudioContext();
    this.ctx = ctx;

    // Gentle compression keeps chords from clipping
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.ratio.value = 3;
    compressor.connect(ctx.destination);
    this.output = compressor;

    this.buffers = this.preload().then((samples) =>
      Promise.all(
        samples.map(
          async ([midi, data]): Promise<[number, AudioBuffer]> => [
            midi,
            // decodeAudioData detaches its input, so decode a copy
            await ctx.decodeAudioData(data.slice(0)),
          ],
        ),
      ),
    );
    return ctx;
  }

  noteOn(id: string, frequency: number) {
    const ctx = this.ensureContext();
    const buffers = this.buffers;
    if (!buffers) return;
    this.noteOff(id);

    // Reserve the slot so a quick release before decoding finishes still works
    const pending = {} as Voice;
    this.voices.set(id, pending);

    const midi = 69 + 12 * Math.log2(frequency / 440);
    buffers
      .then((samples) => {
        if (this.voices.get(id) !== pending || !this.output) return;

        const [sampleMidi, buffer] = samples.reduce((closest, sample) =>
          Math.abs(sample[0] - midi) < Math.abs(closest[0] - midi)
            ? sample
            : closest,
        );

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = Math.pow(2, (midi - sampleMidi) / 12);
        const gain = ctx.createGain();
        gain.gain.value = NOTE_VOLUME;
        source.connect(gain);
        gain.connect(this.output);
        source.start();
        source.onended = () => {
          if (this.voices.get(id)?.source === source) this.voices.delete(id);
          gain.disconnect();
        };

        pending.gain = gain;
        pending.source = source;
      })
      .catch(() => this.voices.delete(id));
  }

  noteOff(id: string) {
    const voice = this.voices.get(id);
    if (!voice) return;
    this.voices.delete(id);
    // Released before the samples finished loading: nothing is playing yet
    if (!voice.source || !this.ctx) return;

    const now = this.ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.setTargetAtTime(0, now, DAMPER_TIME);
    voice.source.stop(now + DAMPER_TIME * 8);
  }

  dispose() {
    this.ctx?.close();
    this.ctx = null;
    this.voices.clear();
  }
}
