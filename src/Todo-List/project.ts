import { ObservableTodoMap } from './todo';
class ProjectStore {
  private projects = new Map<string, ObservableTodoMap>();
  private currentProjectId: string | null = null;

  constructor() {
    if (this.projects.size === 0) {
      this.addProject('default');
      this.selectProject('default');
    }
  }

  public addProject(projectId: string) {
    if (!this.projects.has(projectId)) {
      this.projects.set(projectId, new ObservableTodoMap()); // or new TodoMap()
    }
  }

  public deleteProject(projectId: string) {
    if (this.projects.delete(projectId)) {
      if (this.currentProjectId === projectId) this.currentProjectId = null;
    }
  }

  public selectProject(projectId: string) {
    if (!this.projects.has(projectId)) alert('No Project found!');
    this.currentProjectId = projectId;
  }

  public listProjects() {
    return Array.from(this.projects.keys());
  }

  public saveProjects() {}

  public loadProjects() {}
}
