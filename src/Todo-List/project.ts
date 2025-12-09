import { ObservableTodoMap } from './todo';
export class ProjectStore {
  private projects = new Map<string, ObservableTodoMap>();
  private _currentProjectId: string | undefined = undefined;

  constructor() {
    if (this.projects.size === 0) {
      this.addProject('default');
      this.selectProject('default');
      return;
    }
    this.selectProject(this.projects.keys().next().value ?? '');
  }

  get current(): ObservableTodoMap | undefined {
    return this._currentProjectId
      ? this.projects.get(this._currentProjectId)
      : undefined;
  }

  public addProject(projectId: string) {
    if (!this.projects.has(projectId)) {
      this.projects.set(projectId, new ObservableTodoMap());
      return;
    }
    alert('Project already exists!');
  }

  public deleteProject(projectId: string) {
    if (this.projects.delete(projectId)) {
      if (this._currentProjectId === projectId)
        this._currentProjectId = this.projects.keys().next().value;
    }
  }

  public selectProject(projectId: string): ObservableTodoMap | undefined {
    if (!this.projects.has(projectId)) {
      alert('No Project found!');
      return;
    }
    this._currentProjectId = projectId;
    return this.current;
  }

  public listProjects(): string[] {
    return Array.from(this.projects.keys());
  }

  public saveProjects() {}

  public loadProjects() {}
}
