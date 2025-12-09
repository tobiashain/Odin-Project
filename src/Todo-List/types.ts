import { type ChecklistTask, type Todo } from './todo';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
export enum State {
  NotStarted = 'Not Started',
  Pending = 'Pending',
  Done = 'Done',
}
export type Task = String | ChecklistTask;
export type TodoMapListener = (
  event: TodoMapEvent,
  map: Map<string, Todo>,
) => void;
export type TodoMapEvent =
  | { type: 'set'; id: string; todo: Todo }
  | { type: 'delete'; id: string }
  | { type: 'clear' }
  | { type: 'bulk'; items: [string, Todo][] };

export interface FormValues {
  title: string;
  description: string | undefined;
  dueDate: Date;
  priority: Priority;
  task?: Task;
}

export interface StoredTodo {
  id: string;
  data: {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // ISO string
    priority: Priority;
    state: State;
    task?: Task;
  };
}

type Unsubscribe = () => void;

export interface Subscriptions {
  listener: TodoMapListener;
  unsubscribe: Unsubscribe;
}
