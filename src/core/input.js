const FORWARD_KEY = 'KeyW';
const SWITCH_VIEW_KEY = 'KeyV';

export class Input {
  /** @param {HTMLElement} element */
  constructor(element) {
    // filled in place: the player and the camera keep a reference to this object
    this.intent = { moveY: 0, camDX: 0, camDY: 0, switchView: false };
    this.forwardHeld = false;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;

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
      if (event.code === FORWARD_KEY) {
        this.forwardHeld = true;
      }
      // a held key fires keydown again and again, one press is one switch
      if (event.code === SWITCH_VIEW_KEY && !event.repeat) {
        this.switchViewPressed = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.code === FORWARD_KEY) {
        this.forwardHeld = false;
      }
    });

    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => this.clear());
  }

  update() {
    this.intent.moveY = this.forwardHeld ? 1 : 0;
    // several moves can land in one frame, they add up until here
    this.intent.camDX = this.mouseDX;
    this.intent.camDY = this.mouseDY;
    this.intent.switchView = this.switchViewPressed;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;
  }

  clear() {
    // a key let go in another window never sends keyup here
    this.forwardHeld = false;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.switchViewPressed = false;
  }
}
