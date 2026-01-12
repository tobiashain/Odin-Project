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
