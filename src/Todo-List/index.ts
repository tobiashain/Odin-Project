import backButton from '../shared';
import type { TodoMapEvent, Subscriptions, TodoMapListener } from './types';
import { ObservableTodoMap, type Todo } from './todo';
import { ProjectStore } from './project';
import { DOMHandler } from './dom-handler';

export const projectMap = new ProjectStore();
export let todoMap = projectMap.current;

const domHandler = new DOMHandler();
const subscriptions: Subscriptions[] = [];

if (todoMap) {
  console.log(projectMap);

  const saveDataListener: TodoMapListener = (event, map) => {
    if (event.type !== 'bulk' && event.type !== 'clear')
      projectMap.saveProject(event.id, event.type);
    if (event.type === 'clear') projectMap.saveProjects();
  };
  subscriptions.push({
    listener: saveDataListener,
    unsubscribe: todoMap.subscribe(saveDataListener),
  });

  const loggingListener: TodoMapListener = (event, map) => {
    console.log(map);
  };
  subscriptions.push({
    listener: loggingListener,
    unsubscribe: todoMap.subscribe(loggingListener),
  });

  const domListener: TodoMapListener = (event, map) => {
    domHandler.handleTodoMapEvent(event);
  };
  subscriptions.push({
    listener: domListener,
    unsubscribe: todoMap.subscribe(domListener),
  });
}

export function switchTodoMap(map: ObservableTodoMap | undefined) {
  if (map && todoMap !== map) {
    subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    todoMap = map;
    subscriptions.forEach((sub) => {
      sub.unsubscribe = todoMap!.subscribe(sub.listener);
    });
  }
}
