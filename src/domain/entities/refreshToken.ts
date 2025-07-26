export class RefreshToken {
  constructor(
    public readonly _id: string,
    public token: string,
    public user: string,
    public ip: string,
    public userAgent: string,
    public expireIn: Date
  ) {}

  isValid(): boolean {
    return this.expireIn > new Date();
  }
}