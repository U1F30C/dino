/**
 * Player input manager
 * @class InputManager
 */
class InputManager {
  /**
   * Creates an instance of InputManager
   * @param {Player} player - The Player to which this InputManager belongs
   */
  constructor(player, brain) {
    this.player = player;
    this.brain = brain;
    this.scene = player.scene;
    this.cursors = player.scene.input.keyboard.createCursorKeys();
    [this._shouldGoUp, this.shouldGoDown] = [0, 0];
  }

  /**
   * Update inputManager
   */
  update() {
    const { player } = this;

    [this._shouldGoUp, this.shouldGoDown] = this.brain
      .forward(this.player.perception)
      .map(Math.round);

    if (player.isDead) {
      return;
    }

    if (player.isOnFloor) {
      if (this.isDuckKeyPressed) {
        player.duck();
      } else if (this.isJumpKeyPressed) {
        player.jump();
      } else {
        player.run();
      }
      return;
    }

    if (!player.isOnFloor) {
      if (this.isDuckKeyPressed) {
        player.speedFall();
      } else if (this.isJumpKeyPressed) {
        player.jump();
      } else {
        player.idle();
      }
    }
  }

  /**
   * Check if duck key is pressed
   * @readonly
   * @returns {boolean}
   */
  get isDuckKeyPressed() {
    return this._shouldGoDown;
  }

  /**
   * Check if jump key is pressed
   * @readonly
   * @returns {boolean}
   */
  get isJumpKeyPressed() {
    return this._shouldGoUp;
  }
}

export default InputManager;
