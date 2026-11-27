const FORWARD_KEY = 'KeyW';
const BACK_KEY = 'KeyS';
const LEFT_KEY = 'KeyA';
const RIGHT_KEY = 'KeyD';
const LEFT_SHIFT_KEY = 'ShiftLeft';
const RIGHT_SHIFT_KEY = 'ShiftRight';
const SWITCH_VIEW_KEY = 'KeyV';
const JUMP_KEY = 'Space';
const LEFT_COMMAND_KEY = 'MetaLeft';
const RIGHT_COMMAND_KEY = 'MetaRight';

export class Input {
  /** @param {HTMLElement} element */
  constructor(element) {
    // filled in place: the player and the camera keep a reference to this object
    this.intent = {
      moveX: 0,
      moveY: 0,
      run: false,
      camDX: 0,
      camDY: 0,
      switchView: false,
      jump: false,
    };
    /** @type {Set<string>} */
    this.heldKeys = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;
    this.jumpPressed = false;

    element.addEventListener('click', async () => {
      try {
        await element.requestPointerLock();
      } catch {
        // the browser can say no, like right after esc: the next click tries again
      }
    });

    element.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === element) {
        this.mouseDX += event.movementX;
        this.mouseDY += event.movementY;
      }
    });

    window.addEventListener('keydown', (event) => {
      // with cmd down it's a shortcut, not a move
      if (!event.metaKey) {
        this.heldKeys.add(event.code);
      }
      // a held key fires keydown again and again, one press is one switch
      if (event.code === SWITCH_VIEW_KEY && !event.repeat) {
        this.switchViewPressed = true;
      }
      if (event.code === JUMP_KEY && !event.repeat && !event.metaKey) {
        this.jumpPressed = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      this.heldKeys.delete(event.code);
      // on macos a key let go while cmd is down sends no keyup
      if (event.code === LEFT_COMMAND_KEY || event.code === RIGHT_COMMAND_KEY) {
        this.heldKeys.clear();
      }
    });

    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => this.clear());
  }

  update() {
    this.intent.moveX = this.readAxis(LEFT_KEY, RIGHT_KEY);
    this.intent.moveY = this.readAxis(BACK_KEY, FORWARD_KEY);
    this.intent.run =
      this.heldKeys.has(LEFT_SHIFT_KEY) || this.heldKeys.has(RIGHT_SHIFT_KEY);
    // several moves can land in one frame, they add up until here
    this.intent.camDX = this.mouseDX;
    this.intent.camDY = this.mouseDY;
    this.intent.switchView = this.switchViewPressed;
    this.intent.jump = this.jumpPressed;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;
    this.jumpPressed = false;
  }

  /**
   * @param {string} minusKey
   * @param {string} plusKey
   */
  readAxis(minusKey, plusKey) {
    const plus = this.heldKeys.has(plusKey) ? 1 : 0;
    const minus = this.heldKeys.has(minusKey) ? 1 : 0;
    return plus - minus;
  }

  clear() {
    // a key let go in another window never sends keyup here
    this.heldKeys.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;
    this.jumpPressed = false;
  }
}
