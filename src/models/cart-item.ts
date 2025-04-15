import { Product } from "./product.js";

export class CartItem {
  constructor(public product: Product, public quantity: number = 1) {}

  get subtotal(): number {
    return this.product.price * this.quantity;
  }
}
