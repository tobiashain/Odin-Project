import { ObservableTodoMap } from './observable-todo-map';
import { Todo } from './todo';
import { type StoredProject } from './types';
export class ProjectStore {
  private storageKey: string = 'projects';
  private projectMap = new Map<string, ObservableTodoMap>();
  private _currentProjectId: string | null = null;

  constructor() {
    this.loadProjects();
    if (this.projectMap.size === 0) {
      this.addProject('default');
      this.selectProject('default');
      return;
    }
    this.addProject('Arbeit');
    this.addProject('Schule');
    this.addProject('Freizeit');
  }

  get current(): ObservableTodoMap | undefined {
    return this._currentProjectId
      ? this.projectMap.get(this._currentProjectId)
      : undefined;
  }

  public addProject(projectId: string) {
    if (!this.projectMap.has(projectId)) {
      this.projectMap.set(projectId, new ObservableTodoMap());
      return;
    }
    alert('Project already exists!');
  }

  public deleteProject(projectId: string) {
    if (this.projectMap.delete(projectId)) {
      if (this._currentProjectId === projectId)
        this._currentProjectId = this.projectMap.keys().next().value ?? null;
    }
  }

  public selectProject(projectId: string): ObservableTodoMap | undefined {
    if (!this.projectMap.has(projectId)) {
      alert('No Project found!');
      return;
    }
    this._currentProjectId = projectId;
    return this.current;
  }

  public listProjects(): string[] {
    return Array.from(this.projectMap.keys());
  }

  public saveProject(todoId: string) {
    const projectId = this._currentProjectId;
    if (!projectId) return;
    const todoMap = this.current;
    if (!todoMap) return;
    const raw = localStorage.getItem(this.storageKey);
    const parsed: StoredProject[] = raw ? JSON.parse(raw) : [];

    const idx = parsed.findIndex((p) => p.projectId === projectId);

    if (idx === -1) {
      const allTodos = Array.from(todoMap.entries()).map(([id, todo]) => ({
        id,
        data: todo.toJSON(),
      }));
      parsed.push({ projectId, todos: allTodos });
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      return;
    }

    if (todoId) {
      const storedProject = parsed[idx];
      const liveTodo = todoMap.get(todoId); // Check if it got deleted

      if (!storedProject) return;

      if (liveTodo) {
        const serialized = { id: todoId, data: liveTodo.toJSON() };
        const todoIdx = storedProject.todos.findIndex((t) => t.id === todoId);
        if (todoIdx >= 0) storedProject.todos[todoIdx] = serialized;
        else storedProject.todos.push(serialized);
      } else {
        storedProject.todos = storedProject.todos.filter(
          (t) => t.id !== todoId,
        );
      }

      parsed[idx] = storedProject;
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      return;
    }
  }

  public saveProjects() {
    const data: StoredProject[] = [];
    for (const [projectId, todoMap] of this.projectMap) {
      const serializedTodos = Array.from(todoMap.entries()).map(
        ([id, todo]) => ({
          id,
          data: todo.toJSON(),
        }),
      );
      data.push({ projectId, todos: serializedTodos });
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private loadProjects() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    const parsed: StoredProject[] = JSON.parse(raw);

    for (const { projectId, todos } of parsed) {
      const todoMap = new ObservableTodoMap();

      for (const { id, data } of todos) {
        todoMap.set(
          id,
          new Todo(
            data.id,
            data.title,
            data.description,
            new Date(data.dueDate),
            data.priority,
            data.state,
            data.task,
          ),
        );
      }
      this.projectMap.set(projectId, todoMap);
      this._currentProjectId = projectId;
    }
  }
}
