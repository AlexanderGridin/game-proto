import { KeyboardKeyCode } from "../enums";
import { KeyboardKey } from "../models";

type Registry = Record<KeyboardKeyCode, KeyboardKey>;

export const initKeysRegistry = () => {
  const registry: Registry = {} as Registry;
  const keyCodes = Object.values(KeyboardKeyCode);

  keyCodes.forEach((code: KeyboardKeyCode) => {
    registry[code] = new KeyboardKey();
  });

  return registry;
};
