import { User } from "../models/user";

export class UserService {
  private users: User[] = [];

  async fetchUsers(): Promise<void> {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      this.users = data.map(
        (item: any) => new User(item.id, item.name, item.email)
      );
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
