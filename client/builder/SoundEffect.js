import addBrick from "../assets/effects/brick_add.wav";
import removeBrick from "../assets/effects/brick_remove.wav";

const SoundEffect = {
  effects: {
    'add': removeBrick,
    'remove': addBrick,
  },

  enabled: true,

  play(effect) {
    if(!this.enabled) return;
    
    let audio = new Audio(this.effects[effect]);
    audio.play();
  }
}

export default SoundEffect;
