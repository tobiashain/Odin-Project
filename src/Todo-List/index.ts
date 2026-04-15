import type { Subscriptions, TodoMapListener } from './types';
import { ObservableTodoMap } from './observable-todo-map';
import { ProjectStore } from './project-store';
import { handleTodoMapEvent } from './todo-handler';
import { bindEvents as initProjectListHandler } from './project-list-handler';

export const projectMap = new ProjectStore();
export let todoMap = projectMap.current;

initProjectListHandler();
const subscriptions: Subscriptions[] = [];

if (todoMap) {
  const saveDataListener: TodoMapListener = (event) => {
    if (
      event.type !== 'bulk' &&
      event.type !== 'clear' &&
      event.type !== 'filter'
    ) {
      projectMap.saveProject(event.id);
    }
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
    handleTodoMapEvent(event);
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
      handleTodoMapEvent({ type: 'clear' });
    }
  }
}
