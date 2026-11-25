export class Input {
  /** @param {HTMLElement} element */
  constructor(element) {
    // filled in place: the camera keeps a reference to this object
    this.intent = { camDX: 0 };
    this.mouseDX = 0;

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
      }
    });

    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => this.clear());
  }

  update() {
    // several moves can land in one frame, they add up until here
    this.intent.camDX = this.mouseDX;
    this.mouseDX = 0;
  }

  clear() {
    this.mouseDX = 0;
  }
}
