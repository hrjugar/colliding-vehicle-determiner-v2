export function formatDateTimeToObject(dateTimeText: string) {
  const dateTimeParts = dateTimeText.split('-');
  const [year, month, day, hours, minutes, seconds] = dateTimeParts.map(part => parseInt(part));
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export function convertToRelativeDate(dateTimeText: string) {
  const prevDate = formatDateTimeToObject(dateTimeText);
  const currDate = new Date();

  const diff = currDate.getTime() - prevDate.getTime();

  const secondsAgo = Math.floor(diff / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(monthsAgo / 12);

  if (secondsAgo < 60) {
    return 'just now';
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (monthsAgo < 12) {
    return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
  } else {
    return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
  }
}