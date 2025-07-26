export class Category {
  constructor(
    public readonly _id: string,
    public title: string,
    public slug: string,
    public description: string,
    public type: "blog" | "course",
    public parent: string | null = null,
    public isActive: boolean = true,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}


  isCategoryActive(){
    return this.isActive
  }
}
