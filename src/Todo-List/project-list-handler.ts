import { adjustHeight, getElement } from './helper';
import { switchTodoMap, projectMap } from './index';

const projectListDiv = getElement('#projectList');
const addProject = getElement<HTMLButtonElement>('#addProject');
const settingsTitle = getElement<HTMLElement>('#settingsTitle');

function bindEvents() {
  settingsTitle.innerText = projectMap.projectId ?? '';

  addProject?.addEventListener('click', () => {
    let counter = 0;
    const projects = projectMap.listProjects();

    function newProject() {
      const name = counter === 0 ? 'New Project' : `New Project (${counter})`;

      if (!projects.some((project) => project === name)) {
        projectMap.addProject(name);
        switchTodoMap(projectMap.current);
      } else {
        counter++;
        newProject();
      }
    }

    newProject();
    projectList();
  });

  projectList();
}

function projectList() {
  const projects = projectMap.listProjects();
  projectListDiv.innerHTML = '';
  projects.forEach(createProject);
}

function createProject(project: string) {
  const el = document.createElement('div');
  el.className = 'item';

  const textarea = document.createElement('textarea');
  textarea.readOnly = true;
  textarea.className = 'project';
  textarea.value = project;
  textarea.rows = 1;

  let currentName = project;

  const btnEdit = document.createElement('button');
  btnEdit.innerHTML = `
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

  const btnDelete = document.createElement('button');
  btnDelete.innerHTML = `
          <svg width="800px" height="800px" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8489 22.6922C11.5862 22.7201 11.3509 22.5283 11.3232 22.2638L10.4668 14.0733C10.4392 13.8089 10.6297 13.5719 10.8924 13.5441L11.368 13.4937C11.6307 13.4659 11.8661 13.6577 11.8937 13.9221L12.7501 22.1126C12.7778 22.3771 12.5873 22.614 12.3246 22.6418L11.8489 22.6922Z" fill="#000000"/>
            <path d="M16.1533 22.6418C15.8906 22.614 15.7001 22.3771 15.7277 22.1126L16.5841 13.9221C16.6118 13.6577 16.8471 13.4659 17.1098 13.4937L17.5854 13.5441C17.8481 13.5719 18.0387 13.8089 18.011 14.0733L17.1546 22.2638C17.127 22.5283 16.8916 22.7201 16.6289 22.6922L16.1533 22.6418Z" fill="#000000"/>
            <path clip-rule="evenodd" d="M11.9233 1C11.3494 1 10.8306 1.34435 10.6045 1.87545L9.54244 4.37037H4.91304C3.8565 4.37037 3 5.23264 3 6.2963V8.7037C3 9.68523 3.72934 10.4953 4.67218 10.6145L7.62934 26.2259C7.71876 26.676 8.11133 27 8.56729 27H20.3507C20.8242 27 21.2264 26.6513 21.2966 26.1799L23.4467 10.5956C24.3313 10.4262 25 9.64356 25 8.7037V6.2963C25 5.23264 24.1435 4.37037 23.087 4.37037H18.4561L17.394 1.87545C17.1679 1.34435 16.6492 1 16.0752 1H11.9233ZM16.3747 4.37037L16.0083 3.50956C15.8576 3.15549 15.5117 2.92593 15.1291 2.92593H12.8694C12.4868 2.92593 12.141 3.15549 11.9902 3.50956L11.6238 4.37037H16.3747ZM21.4694 11.0516C21.5028 10.8108 21.3154 10.5961 21.0723 10.5967L7.1143 10.6285C6.86411 10.6291 6.67585 10.8566 6.72212 11.1025L9.19806 24.259C9.28701 24.7317 9.69985 25.0741 10.1808 25.0741H18.6559C19.1552 25.0741 19.578 24.7058 19.6465 24.2113L21.4694 11.0516ZM22.1304 8.7037C22.6587 8.7037 23.087 8.27257 23.087 7.74074V7.25926C23.087 6.72743 22.6587 6.2963 22.1304 6.2963H5.86957C5.34129 6.2963 4.91304 6.72743 4.91304 7.25926V7.74074C4.91304 8.27257 5.34129 8.7037 5.86956 8.7037H22.1304Z" fill="#000000" fill-rule="evenodd"/>
          </svg>`;

  textarea.addEventListener('input', () => adjustHeight(textarea));
  setTimeout(() => adjustHeight(textarea), 0);

  textarea.addEventListener('click', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.readOnly) {
      switchTodoMap(projectMap.selectProject(currentName));
      settingsTitle.innerText = projectMap.projectId ?? '';
    }
  });

  textarea.addEventListener('blur', () => {
    if (textarea.value.trim() === '') {
      alert('The project name should not be empty!');
      textarea.focus();
      return;
    } else if (textarea.value.trim() === currentName) {
      textarea.style.caretColor = 'transparent';
      textarea.style.background = 'initial';
      textarea.readOnly = true;
      textarea.value = textarea.value.trim();
      adjustHeight(textarea);
      return;
    } else if (
      projectMap.listProjects().some((p) => p === textarea.value.trim()) &&
      !textarea.readOnly
    ) {
      alert('The project name already exists!');
      textarea.focus();
      return;
    }

    textarea.style.caretColor = 'transparent';
    textarea.style.background = 'transparent';
    textarea.readOnly = true;
    textarea.value = textarea.value.trim();
    adjustHeight(textarea);

    projectMap.renameProject(currentName, textarea.value);
    if (settingsTitle.innerText === currentName) {
      settingsTitle.innerText = textarea.value;
    }
    currentName = textarea.value;
  });

  btnEdit.addEventListener('click', () => {
    textarea.readOnly = false;
    textarea.style.caretColor = 'auto';
    textarea.style.background = '#5a5a85';
    textarea.focus();
  });

  btnDelete.addEventListener('click', () => {
    projectMap.deleteProject(project);
    settingsTitle.innerText = projectMap.projectId ?? '';
    projectList();
  });

  el.appendChild(textarea);
  el.appendChild(btnEdit);
  el.appendChild(btnDelete);
  projectListDiv.appendChild(el);
}

export { settingsTitle, bindEvents };
