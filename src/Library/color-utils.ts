export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function changeColor(hex: string, percent: number, dark: boolean) {
  percent = Math.min(100, Math.max(0, percent));

  hex = hex.replace(/^#/, '');

  // Parse R, G, B
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (dark) {
    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));
  } else {
    r = Math.floor(r + (255 - r) * (percent / 100));
    g = Math.floor(g + (255 - g) * (percent / 100));
    b = Math.floor(b + (255 - b) * (percent / 100));
  }

  // Recombine to hex
  const newHex =
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

  return newHex;
}

export function getReadableTextColor(bgColor: string) {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);

  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  let textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  if (Math.random() < 0.2) {
    if (luminance < 0.7) {
      textColor = 'gold';
    }
  }

  return textColor;
}
