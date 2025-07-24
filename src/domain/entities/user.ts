export class User {
  constructor(
    public _id: string,
    public email: string,
    public phone: string,
    public username: string,
    private password: string,
    public role: "USER" | "TEACHER" | "ADMIN" = "USER",
    public isVerified: boolean = false,
    public isBlocked: boolean = false,
    public avatar?: string | null,
    public fullname?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  isAdmin(): boolean {
    return this.role === "ADMIN";
  }

  isTeacher(): boolean {
    return this.role === "TEACHER";
  }

  verifyUser(): void {
    this.isVerified = true;
  }

  block(): void {
    this.isBlocked = true;
  }

  unblock(): void {
    this.isBlocked = false;
  }

  changeAvatar(newAvatar: string): void {
    this.avatar = newAvatar;
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
  }

  getPassword(): string {
    return this.password;
  }

  withoutPassword() {
    return new User(
      this._id,
      this.email,
      this.phone,
      this.username,
      "", 
      this.role,
      this.isVerified,
      this.isBlocked,
      this.avatar,
      this.fullname
    );
  }
}
