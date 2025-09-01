import { categoryRepo } from "../modules/category/category.repo";

export const checkCircularReference = async (
  parentId: string,
  currentId: string
): Promise<boolean> => {
  let parent = await categoryRepo.findById(parentId);
  while (parent) {
    if (parent._id.toString() === currentId.toString()) {
      return true; 
    }
    if (!parent.parent) break; 
    parent = await categoryRepo.findById(parent.parent.toString());
  }
  return false;
};
