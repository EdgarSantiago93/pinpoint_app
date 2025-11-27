/**
 * Generates a username from a name by:
 * 1. Converting to lowercase
 * 2. Removing all spaces
 * 3. Appending 3 random digits (100-999)
 * 
 * @param name - The user's name
 * @returns Generated username
 * @example "John Doe" -> "johndoe247"
 */
export function generateUsernameFromName(name: string): string {
  if (!name || name.trim().length === 0) {
    return '';
  }
  
  const base = name.toLowerCase().replace(/\s+/g, '');
  const randomDigits = Math.floor(100 + Math.random() * 900); // 100-999
  return `${base}${randomDigits}`;
}


