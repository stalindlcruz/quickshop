// src/scripts/cart.ts
import { CartService } from "../services/cart-service.js";
import { CartItem } from "../models/cart-item.js";
import { UserService } from "../services/user-service.js";

const cartService = new CartService();
const userService = new UserService();

const tbody = document.querySelector(".table-tbody") as HTMLTableSectionElement;
const tfootTotal = document.querySelector(
  "tfoot td.text-center"
) as HTMLElement;

const invoiceModal = document.querySelector("#invoiceModal") as HTMLElement;
const openModalBtn = document.querySelector(
  "#openModalBtn"
) as HTMLButtonElement;
const closeModalBtn = document.querySelector(
  "#btnCloseModal"
) as HTMLButtonElement;

const modalBody = document.querySelector(
  ".modal-table-tbody"
) as HTMLTableSectionElement;
const modalTotal = document.querySelector("#modalTotal") as HTMLElement;

// ✅ Corregido: ahora usamos el ID de cada <span>
const userNameEl = document.querySelector("#modalUser") as HTMLElement;
const userEmailEl = document.querySelector("#modalEmail") as HTMLElement;
const userDateEl = document.querySelector("#modalDate") as HTMLElement;

function renderCart(): void {
  tbody.innerHTML = "";

  const items = cartService.getItems();
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Cart is empty</td></tr>`;
    tfootTotal.textContent = "$0.00";
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img class="table-img-product" src="${
        item.product.image
      }" alt="product" width="70px" /></td>
      <td>${item.product.title}</td>
      <td>$${item.product.price.toFixed(2)}</td>
      <td><input class="tbody-input" type="number" value="${
        item.quantity
      }" min="1" data-id="${item.product.id}" /></td>
      <td>$${item.subtotal.toFixed(2)}</td>
      <td><button class="table-tbody-btn" data-id="${
        item.product.id
      }">🗑️</button></td>
    `;
    tbody.appendChild(row);
  });

  tfootTotal.textContent = `$${cartService.getTotal().toFixed(2)}`;

  document.querySelectorAll(".tbody-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const id = Number(target.getAttribute("data-id"));
      const qty = Number(target.value);
      cartService.updateQuantity(id, qty);
      renderCart();
    });
  });

  document.querySelectorAll(".table-tbody-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).getAttribute("data-id"));
      cartService.removeFromCart(id);
      renderCart();
    });
  });
}

async function renderInvoice(): Promise<void> {
  modalBody.innerHTML = "";

  const items = cartService.getItems();
  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img class="modal-table-img" src="${
        item.product.image
      }" width="70px" /></td>
      <td>${item.product.title}</td>
      <td>${item.quantity}</td>
      <td>$${item.product.price.toFixed(2)}</td>
      <td>${item.subtotal.toFixed(2)}</td>
    `;
    modalBody.appendChild(tr);
  });

  modalTotal.textContent = `$${cartService.getTotal().toFixed(2)}`;

  // ✅ Mostrar nombre, email y fecha
  await userService.fetchUsers();
  const user = userService.getRandomUser();

  if (user) {
    userNameEl.textContent = user.name;
    userEmailEl.textContent = user.email;
    userDateEl.textContent = new Date().toLocaleDateString();
  }
}

openModalBtn.addEventListener("click", () => {
  renderInvoice();
  invoiceModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  invoiceModal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
