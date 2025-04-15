import { CartItem } from "../models/cart-item.js";
import { Product } from "../models/product.js";

export class CartService {
  private items: CartItem[] = [];
  private storageKey = "quickshop-cart";

  constructor() {
    this.loadCart();
    (window as any).cart = this;
  }

  addToCart(product: Product): void {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push(new CartItem(product));
    }
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.removeFromCart(productId);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  private saveCart(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  private loadCart(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.items = parsed.map(
          (item: any) =>
            new CartItem(
              new Product(
                item.product.id,
                item.product.title,
                item.product.price,
                item.product.image
              ),
              item.quantity
            )
        );
      } catch (error) {
        console.error("Error loading cart from localStorage", error);
        this.items = [];
      }
    }
  }
}
