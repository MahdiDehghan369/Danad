export class Ban {
  constructor(
    public readonly _id: string,
    private readonly user: string,
    private readonly bannedBy: string,
    public readonly reason: string,
    public readonly expiresAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  getUserId(): string {
    return this.user;
  }

  getBannedBy(): string {
    return this.bannedBy;
  }

  isExpired(): boolean {
    return !!this.expiresAt && new Date() > this.expiresAt; // !!this.expiresAt => if (this.expiresAt !== null && this.expiresAt !== undefined)
  }

  isPermanent(): boolean {
    return !this.expiresAt;
  }


}
