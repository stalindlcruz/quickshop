import { User } from "../models/user.js";

export class UserService {
  private users: User[] = [];

  async fetchUsers(): Promise<void> {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      this.users = data.map((item: any) => {
        return new User(item.id, item.name, item.email);
      });
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

  getRandomUser(): User | undefined {
    if (this.users.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.users.length);
    return this.users[randomIndex];
  }
}
