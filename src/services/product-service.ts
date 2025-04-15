import { Product } from "../models/product.js";

export class ProductService {
  private products: Product[] = [];

  async fetchProducts(): Promise<void> {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();

      this.products = data.map(
        (item: any) => new Product(item.id, item.title, item.price, item.image)
      );
    } catch (error) {
      console.error("Error fetching products", error);
    }
  }

  getProducts(): Product[] {
    return this.products;
  }
}
