import type { ChecklistTask } from './checklist-task';
import type { Todo } from './todo';

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

export enum TodoStateColor {
  NotStarted = '#afaee5',
  Pending = '#e68b00',
  Done = '#00e65f',
  Overdue = '#e60f01',
}

export enum TodoPriorityColor {
  Low = '#ffffffff',
  Medium = '#ffdfa0ff',
  High = '#ffc6c6ff',
}
export type Task = string | ChecklistTask;
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

export interface StoredProject {
  projectId: string;
  todos: {
    id: string;
    data: {
      id: string;
      title: string;
      description?: string;
      dueDate: string;
      priority: Priority;
      state: State;
      task?: Task;
    };
  }[];
}

type Unsubscribe = () => void;

export interface Subscriptions {
  listener: TodoMapListener;
  unsubscribe: Unsubscribe;
}
