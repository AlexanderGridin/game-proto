import { KeyboardKeyCode } from "./enums";
import { initKeysRegistry } from "./utils";

class _Keyboard {
  private registry = initKeysRegistry();

  constructor() {
    window.addEventListener("keydown", (e) => {
      const key = e.key as KeyboardKeyCode;
      // console.log(key);

      if (!this.registry[key]) {
        return;
      }

      this.registry[key].isPressed = true;
      this.registry[key].isClicked = true;
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key as KeyboardKeyCode;

      if (!this.registry[key]) {
        return;
      }

      this.registry[key].isPressed = false;
      this.registry[key].prevIsClicked = false;
    });
  }

  public isKeyPressed(key: KeyboardKeyCode): boolean {
    return this.registry[key].isPressed;
  }

  // TODO: made this callable more than one time per key
  public isKeyClicked(key: KeyboardKeyCode): boolean {
    const isKeyClicked = this.registry[key].isClicked;
    const isKeyClickedPreviously = this.registry[key].prevIsClicked;

    if (isKeyClicked && !isKeyClickedPreviously) {
      this.registry[key].prevIsClicked = true;
      return this.registry[key].prevIsClicked;
    }

    this.registry[key].isClicked = false;
    return this.registry[key].isClicked;
  }
}

export const Keyboard = new _Keyboard();
