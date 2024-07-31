export function convertSecondsToTimeText(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds % 1) * 100);

  return `
    ${hours ? `${hours}h` : ''}
    ${minutes ? `${minutes}m` : ''}
    ${remainingSeconds ? `${remainingSeconds}${milliseconds ? `.${milliseconds}` : ''}s` : ''}
  `
}

export function padZero(num: number, length = 2) {
  return num.toString().padStart(length, '0');
}