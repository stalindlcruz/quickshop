const invoiceModal = document.querySelector("#invoiceModal") as HTMLElement;
const openBtn = document.querySelector("#openModalBtn") as HTMLButtonElement;
const closeBtn = document.querySelector("#btnCloseModal") as HTMLButtonElement;

openBtn.addEventListener("click", () => {
  invoiceModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  invoiceModal.style.display = "none";
});
