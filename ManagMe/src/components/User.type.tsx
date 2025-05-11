export type Role = "DevOps" | "Developer" | "Admin" | "guest";

export default interface IUser {
  id: number;
  username: string;
  email: string;
  Role: Role;
}