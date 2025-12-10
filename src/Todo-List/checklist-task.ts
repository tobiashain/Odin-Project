export class ChecklistTask {
  private _items: [string, boolean][];
  constructor(items: [string, boolean][]) {
    this._items = items;
  }

  get items() {
    return this._items;
  }
}
