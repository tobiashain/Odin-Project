export class ChecklistTask {
  public items: [string, boolean][];
  constructor(items: [string, boolean][]) {
    this.items = items;
  }
}
