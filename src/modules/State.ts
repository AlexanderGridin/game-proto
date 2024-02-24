export class State<StateType = Record<string, any>> {
  private _state: StateType;

  constructor(initialState: StateType) {
    this._state = initialState;
  }

  public get<K extends keyof StateType>(key: K): StateType[K] {
    return this._state[key];
  }

  public set<K extends keyof StateType>(key: K, value: StateType[K]): void {
    this._state[key] = value;
  }
}
