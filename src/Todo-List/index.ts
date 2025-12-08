import backButton from '../shared';
import type { TodoMapEvent } from './types';
import { ObservableTodoMap, type Todo } from './todo';
import { DOMHandler } from './dom-handler';

const domHandler = new DOMHandler();
export const todoMap = new ObservableTodoMap();

todoMap.loadData();

const saveData = todoMap.subscribe(
  (event: TodoMapEvent, map: Map<string, Todo>) => {
    if (event.type !== 'bulk') todoMap.saveData();
  },
);

const logging = todoMap.subscribe(
  (event: TodoMapEvent, map: Map<string, Todo>) => {
    console.log(map);
  },
);

const handleTodoMap = todoMap.subscribe(
  (event: TodoMapEvent, map: Map<string, Todo>) => {
    domHandler.handleTodoMapEvent(event);
  },
);
