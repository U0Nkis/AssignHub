export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

export const getTimeRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;

  if (diff <= 0) {
    return 'Overdue';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} remaining`;
  } else {
    return `${minutes} minute${minutes === 1 ? '' : 's'} remaining`;
  }
}; 