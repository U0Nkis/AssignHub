export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, letters, numbers, underscores, hyphens
  const re = /^[a-zA-Z0-9_-]{3,20}$/;
  return re.test(username);
};

export const validateName = (name) => {
  // 2-50 characters, letters, spaces, hyphens
  const re = /^[a-zA-Z\s-]{2,50}$/;
  return re.test(name);
};

export const validateAssignmentTitle = (title) => {
  return title.length >= 3 && title.length <= 100;
};

export const validateAssignmentDescription = (description) => {
  return description.length >= 10 && description.length <= 1000;
};

export const validateAssignmentInstructions = (instructions) => {
  return instructions.length >= 10 && instructions.length <= 2000;
};

export const validateAssignmentDueDate = (dueDate) => {
  const date = new Date(dueDate);
  const now = new Date();
  return date > now;
};

export const validateAssignmentMaxScore = (maxScore) => {
  return maxScore >= 0 && maxScore <= 100;
};

export const validateSubmissionContent = (content) => {
  return content.length >= 10 && content.length <= 5000;
};

export const validateFileSize = (file, maxSizeMB = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file, allowedTypes = ['.pdf', '.doc', '.docx', '.txt']) => {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
}; 