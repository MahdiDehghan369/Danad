import { Category } from "../domain/entities/category";

export function buildCategoryTree(categories: Category[]) {
  const categoryMap: Record<string, any> = {};
  const tree: any[] = [];

  categories.forEach((cat) => {
    categoryMap[cat._id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parent && categoryMap[cat.parent]) {
      categoryMap[cat.parent].children.push(categoryMap[cat._id]);
    } else {
      tree.push(categoryMap[cat._id]); 
    }
  });

  return tree;
}
