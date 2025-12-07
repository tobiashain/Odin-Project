import backButton from '../shared';
import type { TodoMapEvent } from './types';
import { ObservableTodoMap, Todo } from './todo';
import { DOMHandler } from './dom-handler';

const domHandler = new DOMHandler();
export const todoMap = new ObservableTodoMap();

todoMap.loadData();

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  if (event.type !== 'bulk') todoMap.saveData();
});

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  console.log(map);
});

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  domHandler.handleTodoMapEvent(event);
});
