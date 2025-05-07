export type Role = "DevOps" | "Developer" | "Admin";

export default interface IUser {
  id: number;
  username: string;
  email: string;
  Role: Role;
}