export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function convertTimeToIST(gpsTime) {
  const utcDate = new Date(gpsTime);
  const year = utcDate.getFullYear();
  const month = utcDate.toLocaleString('en-US', { month: 'short' });
  const day = utcDate.getDate();
  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  const minute = minutes < 10 ? '0' + minutes : minutes;
  return `${month} ${day}, ${year} ${hour}:${minute} ${ampm}`;
}

// Date Format Only
export function convertIntoDateOnly(time) {
  const utcDate = new Date(time);
  const year = utcDate.getFullYear();
  const month = utcDate.toLocaleString('en-US', { month: 'short' });
  const day = utcDate.getDate();
  return `${month} ${day}, ${year} `;
}
