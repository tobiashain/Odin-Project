export default function backButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Back To Home';
  btn.style.position = 'fixed';
  btn.style.right = '10px';
  btn.style.bottom = '10px';
  btn.style.padding = '8px 16px';
  btn.style.backgroundColor = '#007bff';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1000';

  btn.addEventListener('mouseenter', () => {
    btn.style.backgroundColor = '#0056b3';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.backgroundColor = '#007bff';
  });

  btn.addEventListener('click', () => {
    window.location.href = '/';
  });

  document.body.appendChild(btn);
}

backButton();
