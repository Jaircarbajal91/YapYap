// Allowed image file types
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

// Allowed file extensions (for accept attribute)
export const ALLOWED_IMAGE_EXTENSIONS = '.png,.jpg,.jpeg,.webp';

// MIME types string (for accept attribute)
export const ALLOWED_IMAGE_MIME_TYPES = 'image/png,image/jpeg,image/jpg,image/webp';

// Maximum file size (10MB in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validates if a file is an allowed image type
 * @param {File} file - The file to validate
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateImageFile = (file, maxSize = MAX_FILE_SIZE) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    const allowedTypes = ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ');
    return {
      isValid: false,
      error: `Invalid file type. Please select a ${allowedTypes} image file.`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB. Please select a smaller image.`
    };
  }

  return { isValid: true, error: null };
};

