import backButton from '../shared';
import type { Subscriptions, TodoMapListener } from './types';
import { ObservableTodoMap } from './observable-todo-map';
import { ProjectStore } from './project-store';
import { TodoHandler } from './todo-handler';
import { ProjectListHandler } from './project-list-handler';

export const projectMap = new ProjectStore();
export let todoMap = projectMap.current;
export const projectListHandler = new ProjectListHandler();

const domHandler = new TodoHandler();

const subscriptions: Subscriptions[] = [];

if (todoMap) {
  const saveDataListener: TodoMapListener = (event) => {
    if (
      event.type !== 'bulk' &&
      event.type !== 'clear' &&
      event.type !== 'filter'
    )
      projectMap.saveProject(event.id);
    if (event.type === 'clear') projectMap.saveProjects();
  };
  subscriptions.push({
    listener: saveDataListener,
    unsubscribe: todoMap.subscribe(saveDataListener),
  });

  /*const loggingListener: TodoMapListener = (event, map) => {
    console.log(map);
    console.log(projectMap);
  }; 
  subscriptions.push({
    listener: loggingListener,
    unsubscribe: todoMap.subscribe(loggingListener),
  });
  */

  const domListener: TodoMapListener = (event) => {
    domHandler.handleTodoMapEvent(event);
  };
  subscriptions.push({
    listener: domListener,
    unsubscribe: todoMap.subscribe(domListener),
  });
}

export function switchTodoMap(map: ObservableTodoMap | undefined) {
  if (todoMap !== map) {
    subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    todoMap = map;
    if (todoMap) {
      subscriptions.forEach((sub) => {
        sub.unsubscribe = todoMap!.subscribe(sub.listener);
      });
    } else {
      domHandler.handleTodoMapEvent({ type: 'clear' });
    }
  }
}

export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string,
): T {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return el as T;
}

export function adjustHeight(input: HTMLTextAreaElement) {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight + 'px';

  if (input.scrollHeight > parseInt(getComputedStyle(input).maxHeight)) {
    input.style.overflowY = 'auto';
  } else {
    input.style.overflowY = 'hidden';
  }
}
