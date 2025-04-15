import { ProductService } from "../services/product-service.js";
import { Product } from "../models/product.js";
import { UserService } from "../services/user-service.js";
import { User } from "../models/user.js";
import { CartService } from "../services/cart-service.js";

const invoiceModal = document.querySelector(
  "#invoiceModal"
) as HTMLElement | null;
const openBtn = document.querySelector(
  "#openModalBtn"
) as HTMLButtonElement | null;
const closeBtn = document.querySelector(
  "#btnCloseModal"
) as HTMLButtonElement | null;

if (openBtn && closeBtn && invoiceModal) {
  openBtn.addEventListener("click", () => {
    invoiceModal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    invoiceModal.style.display = "none";
  });
}

const productService = new ProductService();
const userService = new UserService();
const cartService = new CartService();

(window as any).cart = cartService;

async function initializeApp(): Promise<void> {
  await productService.fetchProducts();
  await userService.fetchUsers();

  const user = userService.getRandomUser();
  const products = productService.getProducts();

  if (user) {
    renderUserInfo(user);
  } else {
    console.error("No user found");
  }

  renderProducts(products);
}

function renderProducts(products: Product[]): void {
  const template = document.querySelector("#productCard") as HTMLElement | null;
  if (!template) return;

  const row = template.parentElement as HTMLElement;

  products.forEach((product) => {
    const clone = template.cloneNode(true) as HTMLElement;
    const img = clone.querySelector(".img-product") as HTMLImageElement;
    const title = clone.querySelector(
      ".product-card-details-h4"
    ) as HTMLElement;
    const price = clone.querySelector(".product-card-details p") as HTMLElement;
    const button = clone.querySelector(
      ".product-card-btn"
    ) as HTMLButtonElement;

    img.src = product.image;
    img.alt = product.title;
    title.textContent = product.title;
    price.textContent = `$${product.price}`;
    button.setAttribute("data-id", product.id.toString());

    button.addEventListener("click", () => {
      cartService.addToCart(product);
      console.log(`Producto agregado al carrito:`, product);
    });

    clone.classList.remove("d-none");
    row.appendChild(clone);
  });

  template.remove();
}

function renderUserInfo(user: User): void {
  const name = document.querySelector(
    ".modal-p strong:nth-of-type(1)"
  )?.nextSibling;
  const email = document.querySelector(
    ".modal-p strong:nth-of-type(2)"
  )?.nextSibling;

  if (name) name.textContent = ` ${user.name}`;
  if (email) email.textContent = ` ${user.email}`;
}

initializeApp();
