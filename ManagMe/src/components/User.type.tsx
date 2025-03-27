export type Role = "DevOps" | "Developer" | "Admin";

export default interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  Role: Role;
}