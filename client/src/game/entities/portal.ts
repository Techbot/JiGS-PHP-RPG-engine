import Phaser from "phaser";

export default class Portal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ship');
    this.pathIndex = 0;

  }

  preUpdate(time, delta) {
    this.setDepth(6);
  }
}
