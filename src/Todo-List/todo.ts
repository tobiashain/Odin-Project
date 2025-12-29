import type { Priority, State, Task } from './types';

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
    if (payload.description !== undefined) {
      this._description = payload.description;
    }
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
