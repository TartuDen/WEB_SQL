import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from "./settings.js";
import { AppError } from "./classes.js";


function validateTitleAndContent(title, content) {
  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 4000;

  // Check title length
  if (title.length === 0 || title.length > MAX_TITLE_LENGTH) {
    throw new AppError("Title must be between 1 and 100 characters.", 400);
  }

  // Check content length
  if (content.length === 0 || content.length > MAX_CONTENT_LENGTH) {
    throw new AppError("Content must be between 1 and 4000 characters.", 400);
  }

  // Check for spaces in title
  if (!title.includes(' ')) {
    throw new AppError("Title must contain at least one space.", 400);
  }

  // Check for spaces in content
  if (!content.includes(' ')) {
    throw new AppError("Content must contain at least one space.", 400);
  }

  return { valid: true, message: "Title and content are valid." };
}

export { validateTitleAndContent };