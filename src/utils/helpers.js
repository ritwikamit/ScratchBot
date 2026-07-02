export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const day = 86400000;

  if (diff < day) return 'Today';
  if (diff < 2 * day) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function truncate(str, len = 40) {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}
