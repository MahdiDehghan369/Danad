export const slugify = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "") 
    .replace(/\-\-+/g, "-") 
    .replace(/^-+|-+$/g, ""); 
};
