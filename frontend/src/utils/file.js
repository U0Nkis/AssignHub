export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();

  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📋';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    case 'zip':
    case 'rar':
    case '7z':
      return '📦';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '🎵';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬';
    case 'py':
      return '🐍';
    case 'js':
      return '📜';
    case 'html':
    case 'css':
      return '🌐';
    default:
      return '📎';
  }
};

export const isImageFile = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
};

export const isDocumentFile = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension);
};

export const isCodeFile = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['py', 'js', 'java', 'cpp', 'c', 'h', 'html', 'css', 'php', 'rb'].includes(extension);
};

export const isArchiveFile = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension);
};

export const isMediaFile = (filename) => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['mp3', 'wav', 'ogg', 'mp4', 'avi', 'mov', 'wmv'].includes(extension);
};

export const getFileType = (filename) => {
  if (isImageFile(filename)) return 'image';
  if (isDocumentFile(filename)) return 'document';
  if (isCodeFile(filename)) return 'code';
  if (isArchiveFile(filename)) return 'archive';
  if (isMediaFile(filename)) return 'media';
  return 'other';
}; 