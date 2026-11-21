// Engine and horn sounds for the car, built on the Web Audio API.
// The engine loops a recorded sample and bends its pitch and volume with speed;
// the horn is synthesised as a classic two-tone car horn.

const ENGINE_SAMPLE = "/fun/car-engine.mp3";
const ENGINE_LOOP_TRIM = 0.235; // Seconds trimmed from each end for a seamless loop
const ENGINE_IDLE_RATE = 0.75;
const ENGINE_REV_RANGE = 1.1; // Extra playback rate at top speed
const ENGINE_IDLE_VOLUME = 0.12;
const ENGINE_SPEED_VOLUME = 0.3;
const THROTTLE_BOOST = 0.15; // Extra pitch while the accelerator is held
const ENGINE_STOP_DELAY = 1.5; // Seconds the engine idles after the car stops
const SUSPEND_DELAY = 3; // Seconds of silence before the audio context sleeps

const HORN_FREQUENCIES = [370, 466]; // Roughly F#4 and A#4, a major third apart
const HORN_VOLUME = 0.18;

export class CarSounds {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private engineSource: AudioBufferSourceNode | null = null;
  private hornGain: GainNode | null = null;
  private hornOscillators: OscillatorNode[] = [];
  private lastActiveTime = 0;
  private quietSince: number | null = null;

  // Must be called from a user gesture (e.g. a keydown) so the browser allows audio
  start() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }

    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(ctx.destination);

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0;
    this.engineGain.connect(this.master);

    // Soften the horn's square waves so it honks rather than buzzes
    const hornFilter = ctx.createBiquadFilter();
    hornFilter.type = "lowpass";
    hornFilter.frequency.value = 2200;
    this.hornGain = ctx.createGain();
    this.hornGain.gain.value = 0;
    this.hornGain.connect(hornFilter);
    hornFilter.connect(this.master);

    fetch(ENGINE_SAMPLE)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        if (this.ctx !== ctx || !this.engineGain) return;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = ENGINE_LOOP_TRIM;
        source.loopEnd = buffer.duration - ENGINE_LOOP_TRIM;
        source.playbackRate.value = ENGINE_IDLE_RATE;
        source.connect(this.engineGain);
        source.start(0, ENGINE_LOOP_TRIM);
        this.engineSource = source;
      })
      .catch(() => {});
  }

  // Called every frame with the car's speed as a fraction of top speed
  update(speedFraction: number, throttle: boolean, isDriving: boolean) {
    const ctx = this.ctx;
    if (!ctx || !this.engineGain) return;
    const now = ctx.currentTime;

    if (isDriving) this.lastActiveTime = now;
    const engineOn = now - this.lastActiveTime < ENGINE_STOP_DELAY;

    const volume = engineOn
      ? ENGINE_IDLE_VOLUME +
        ENGINE_SPEED_VOLUME * speedFraction +
        (throttle ? 0.08 : 0)
      : 0;
    this.engineGain.gain.setTargetAtTime(volume, now, engineOn ? 0.08 : 0.4);

    if (this.engineSource) {
      const rate =
        ENGINE_IDLE_RATE +
        ENGINE_REV_RANGE * speedFraction +
        (throttle ? THROTTLE_BOOST : 0);
      this.engineSource.playbackRate.setTargetAtTime(rate, now, 0.12);
    }

    // Let the audio hardware sleep once everything has been quiet for a while
    const isQuiet = !engineOn && this.hornOscillators.length === 0;
    if (!isQuiet) {
      this.quietSince = null;
    } else if (this.quietSince === null) {
      this.quietSince = now;
    } else if (
      now - this.quietSince > SUSPEND_DELAY &&
      ctx.state === "running"
    ) {
      ctx.suspend();
    }
  }

  hornOn() {
    const ctx = this.ctx;
    if (!ctx || !this.hornGain || this.hornOscillators.length > 0) return;
    const now = ctx.currentTime;

    this.hornOscillators = HORN_FREQUENCIES.map((frequency) => {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = frequency;
      osc.connect(this.hornGain!);
      osc.start(now);
      return osc;
    });
    this.hornGain.gain.cancelScheduledValues(now);
    this.hornGain.gain.setValueAtTime(0, now);
    this.hornGain.gain.linearRampToValueAtTime(HORN_VOLUME, now + 0.015);
  }

  hornOff() {
    const ctx = this.ctx;
    if (!ctx || !this.hornGain || this.hornOscillators.length === 0) return;
    const now = ctx.currentTime;

    this.hornGain.gain.cancelScheduledValues(now);
    this.hornGain.gain.setValueAtTime(this.hornGain.gain.value, now);
    this.hornGain.gain.linearRampToValueAtTime(0, now + 0.06);
    this.hornOscillators.forEach((osc) => osc.stop(now + 0.07));
    this.hornOscillators = [];
  }

  dispose() {
    this.hornOff();
    this.ctx?.close();
    this.ctx = null;
    this.engineSource = null;
  }
}
