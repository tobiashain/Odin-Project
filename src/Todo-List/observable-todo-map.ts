import type { Todo } from './todo';
import { type TodoMapEvent, type TodoMapListener } from './types';

export class ObservableTodoMap {
  private todoMap = new Map<string, Todo>();
  private listeners: Set<TodoMapListener> = new Set();

  public set(id: string, todo: Todo) {
    this.todoMap.set(id, todo);
    this.notify({ type: 'set', id, todo });
  }

  public delete(id: string) {
    const existed = this.todoMap.delete(id);
    if (existed) this.notify({ type: 'delete', id });
  }

  public clear() {
    this.todoMap.clear();
    this.notify({ type: 'clear' });
  }

  public get(id: string) {
    return this.todoMap.get(id);
  }

  public entries(): IterableIterator<[string, Todo]> {
    return this.todoMap.entries();
  }

  public filter(predicate: (todo: Todo) => boolean): Map<string, Todo> {
    const result = new Map<string, Todo>();
    for (const [id, todo] of this.todoMap) {
      if (predicate(todo)) result.set(id, todo);
    }
    return result;
  }

  public subscribe(listener: TodoMapListener) {
    this.listeners.add(listener);

    listener(
      { type: 'bulk', items: Array.from(this.todoMap.entries()) },
      this.todoMap,
    );

    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(event: TodoMapEvent) {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(event, this.todoMap);
      } catch (err) {
        console.error('TodoMap listener error', err);
      }
    }
  }
}
