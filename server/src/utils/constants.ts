export const S3BucketErrors = {
  NO_FILE: 'No file provided',
  ERROR_GETTING_IMAGE: 'Error getting image from S3',
  ERROR_UPLOADING_IMAGE: 'Error uploading image to S3',
  ERROR_DELETING_IMAGE: 'Error deleting image from S3',
  UPLOAD_ERROR: 'Failed to upload file to S3',
  DELETE_ERROR: 'Failed to delete file from S3',
  INVALID_FILE_TYPE: 'Invalid file type. Only images are allowed',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB',
  MISSING_ENV_VARS: 'Missing required AWS environment variables',
}; 