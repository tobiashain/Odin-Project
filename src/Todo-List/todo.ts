import {
  type TodoMapEvent,
  type TodoMapListener,
  type Task,
  State,
  Priority,
} from './types';

export class ObservableTodoMap {
  private map = new Map<string, Todo>();
  private listeners: Set<TodoMapListener> = new Set();

  public set(id: string, todo: Todo) {
    this.map.set(id, todo);
    this.notify({ type: 'set', id, todo });
  }

  public delete(id: string) {
    const existed = this.map.delete(id);
    if (existed) this.notify({ type: 'delete', id });
  }

  public clear() {
    this.map.clear();
    this.notify({ type: 'clear' });
  }

  public get(id: string) {
    return this.map.get(id);
  }

  public entries(): IterableIterator<[string, Todo]> {
    return this.map.entries();
  }

  public filter(predicate: (todo: Todo) => boolean): Map<string, Todo> {
    const result = new Map<string, Todo>();
    for (const [id, todo] of this.map) {
      if (predicate(todo)) result.set(id, todo);
    }
    return result;
  }

  public loadData(items: [string, Todo][]) {
    this.map.clear();
    for (const [id, todo] of items) {
      this.map.set(id, todo);
    }
  }

  public subscribe(listener: TodoMapListener) {
    this.listeners.add(listener);

    listener({ type: 'bulk', items: Array.from(this.map.entries()) }, this.map);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(event: TodoMapEvent) {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(event, this.map);
      } catch (err) {
        console.error('TodoMap listener error', err);
      }
    }
  }
}

export class Todo {
  constructor(
    private _id: string,
    private _title: string,
    private _description: string | undefined,
    private _dueDate: Date,
    private _priority: Priority,
    private _state: State,
    private _task: Task | undefined,
  ) {}

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get dueDate() {
    return this._dueDate;
  }
  get priority() {
    return this._priority;
  }
  get state() {
    return this._state;
  }
  get task() {
    return this._task;
  }

  public editTask(payload: {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: Priority;
    state?: State;
    task?: Task | undefined;
  }) {
    if (payload.title !== undefined) this._title = payload.title;
    if (payload.description !== undefined)
      this._description = payload.description;
    if (payload.dueDate) this._dueDate = payload.dueDate;
    if (payload.priority) this._priority = payload.priority;
    if (payload.state) this._state = payload.state;
    if (payload.task !== undefined) this._task = payload.task;
  }

  public toJSON() {
    return {
      id: this._id,
      title: this._title,
      ...(this._description != null ? { description: this._description } : {}),
      dueDate: this._dueDate.toISOString(),
      priority: this._priority,
      state: this._state,
      ...(this._task != null ? { task: this._task } : {}),
    };
  }
}

export class ChecklistTask {
  private _items: [string, boolean][];
  constructor(items: [string, boolean][]) {
    this._items = items;
  }

  get items() {
    return this._items;
  }
}
