import Phaser from "phaser";
import stories from "../stories";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y, story=null) {
    super(
      scene,
      x,
      y,
      "player",
      // "Front/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png"
    );
    this.scene = scene;
    this.speed = 1;
    this.steps = 0;
    this.createAnimations();
    this.play("player-face-front");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    if (story) {
      this.story = stories[story]
      this.story.currentMovementIndex = 0;
      // this.scene.physics.add.collider(this)
    }
  }

  playStory() {
    if (this.story) {
      if (!this.currentMovement || this.steps >= this.currentMovement.steps) {
        this.steps = 0;
        this.story.currentMovementIndex = (this.story.currentMovementIndex + 1) % this.story.movements.length;
        this.currentMovement = this.story.movements[this.story.currentMovementIndex]
      }
      this[this.currentMovement.action]();
      this.steps += 1;
    }
  }

  moveToX(x) {
    let direction = x - this.x > 0 ? "right" : "left";
    this.setX(x);
    this.anims.play(`player-walk-${direction}`, true);
  }

  moveToY(y) {
    let direction = y - this.y > 0 ? "down" : "up";
    this.setY(y);
    this.anims.play(`player-walk-${direction}`, true);
  }

  moveRight() {
    this.setX(this.x + this.speed);
    this.anims.play("player-walk-right", true);
  }

  moveLeft() {
    this.setX(this.x - this.speed);
    this.anims.play("player-walk-left", true);
  }

  moveUp() {
    this.setY(this.y - this.speed);
    this.anims.play("player-walk-up", true);
  }

  moveDown() {
    this.setY(this.y + this.speed);
    this.anims.play("player-walk-down", true);
  }

  moveRandom() {
    if (this.steps % (this.randomStepCount || 100) === 0) {
      this.nextMove = [this.moveDown, this.moveUp, this.moveRight, this.moveLeft][Math.floor(Math.random() * 4)].bind(this)
      this.steps = 0;
      this.randomStepCount = [120, 90, 50, 60][Math.floor(Math.random() * 4)]
    }
    this.nextMove()
    this.steps += 1;
  }

  faceFront() {
    this.anims.play("player-face-front", true);
  }

  stop() {
    let middleFrameIndex = Math.ceil(this.anims.currentAnim.frames.length / 2);
    let currentFrameIndex = this.anims.currentFrame.index;
    if (currentFrameIndex === 1 || middleFrameIndex < currentFrameIndex) {
      this.anims.stopOnFrame(this.anims.currentAnim.frames[0]);
    } else {
      this.anims.stopOnFrame(this.anims.currentAnim.frames[middleFrameIndex]);
    }
  }

  createAnimations() {
    ["up", "down", "left", "right"].forEach((dir) => {
      let direction = {
        up: "Back",
        down: "Front",
        left: "Left_Side",
        right: "Right_Side",
      }[dir];
      this.scene.anims.create({
        key: `player-walk-${dir}`,
        frames: this.scene.anims.generateFrameNames("player", {
          start: 1,
          end: 29,
          zeroPad: 3,
          prefix: `${direction}/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_`,
          suffix: ".png",
        }),
        frameRate: 29,
        repeat: -1,
      });
    });

    this.scene.anims.create({
      key: "player-face-front",
      frames: [
        {
          key: "player",
          frame:
            "Front/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png",
        },
      ],
      repeat: -1,
      frameRate: 29,
    });
  }
}
