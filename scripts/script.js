const basket = [];
let lockedScrollY = 0;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

function lockPageScroll() {
  if (document.body.classList.contains("modal-open")) return;
  lockedScrollY = window.scrollY;
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.classList.add("modal-open");
}

function unlockPageScroll() {
  if (!document.body.classList.contains("modal-open")) return;
  document.body.classList.remove("modal-open");
  document.body.style.top = "";
  window.scrollTo(0, lockedScrollY);
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}

function getAllMeals() {
  return categories.flatMap((category) => category.meals);
}

function getMeal(mealId) {
  return getAllMeals().find((meal) => meal.id === mealId);
}

function getBasketItem(mealId) {
  return basket.find((item) => item.id === mealId);
}

function renderMenu() {
  const menuContent = document.getElementById("menuContent");
  menuContent.innerHTML = categories.map(createCategoryTemplate).join("");
}

function addToBasket(mealId) {
  const item = getBasketItem(mealId);
  item ? item.quantity++ : basket.push({ id: mealId, quantity: 1 });
  updateView();
  openBasketDialog();
}

function increaseQuantity(mealId) {
  getBasketItem(mealId).quantity++;
  updateView();
}

function decreaseQuantity(mealId) {
  const item = getBasketItem(mealId);
  item.quantity > 1 ? item.quantity-- : removeFromBasket(mealId);
  updateView();
}

function removeFromBasket(mealId) {
  const index = basket.findIndex((item) => item.id === mealId);
  basket.splice(index, 1);
  updateView();
  if (!basket.length && window.matchMedia("(max-width: 1270px)").matches) closeBasketDialog();
}

function getSubtotal() {
  return basket.reduce((sum, item) => sum + getMeal(item.id).price * item.quantity, 0);
}

function getTotal() {
  return basket.length ? getSubtotal() + deliveryFee : 0;
}

function renderBaskets() {
  const template = createBasketTemplate();
  document.getElementById("desktopBasket").innerHTML = template;
  document.getElementById("mobileBasket").innerHTML = template;
  setupBasketScrollbars();
}

function setupBasketScrollbars() {
  document.querySelectorAll(".basket-scroll").forEach(setupBasketScrollbar);
}

function setupBasketScrollbar(scrollArea) {
  const list = scrollArea.querySelector(".basket-items");
  const thumb = scrollArea.querySelector(".basket-scrollbar__thumb");
  if (!list || !thumb) return;
  updateScrollbarThumb(list, thumb);
  list.onscroll = () => updateScrollbarThumb(list, thumb);
  thumb.onpointerdown = (event) => startScrollbarDrag(event, list, thumb);
}

function updateScrollbarThumb(list, thumb) {
  const maxScroll = list.scrollHeight - list.clientHeight;
  const track = thumb.parentElement.clientHeight - thumb.offsetHeight;
  const top = maxScroll ? (list.scrollTop / maxScroll) * track : 0;
  thumb.style.transform = `translateY(${top}px)`;
  thumb.parentElement.classList.toggle("hidden", maxScroll <= 0);
}

function startScrollbarDrag(event, list, thumb) {
  event.preventDefault();
  const startY = event.clientY;
  const startTop = list.scrollTop;
  thumb.setPointerCapture(event.pointerId);
  thumb.onpointermove = (move) => dragScrollbar(move, list, thumb, startY, startTop);
  thumb.onpointerup = () => stopScrollbarDrag(thumb);
}

function dragScrollbar(event, list, thumb, startY, startTop) {
  const maxScroll = list.scrollHeight - list.clientHeight;
  const track = thumb.parentElement.clientHeight - thumb.offsetHeight;
  list.scrollTop = startTop + (event.clientY - startY) * (maxScroll / track);
}

function stopScrollbarDrag(thumb) {
  thumb.onpointermove = null;
  thumb.onpointerup = null;
}

function buyNow() {
  if (!basket.length) return;
  basket.length = 0;
  updateView();
  showConfirmation();
}

function showConfirmation() {
  document.getElementById("basketDialog").classList.add("hidden");
  lockPageScroll();
  document.getElementById("confirmationDialog").classList.remove("hidden");
  window.setTimeout(closeConfirmation, 3000);
}

function updateMobileTotal() {
  const amount = basket.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("mobileBasketTotal").textContent = amount ? amount : "";
  document.getElementById("openBasketButton").classList.toggle("is-filled", amount > 0);
}

function updateView() {
  renderMenu();
  renderBaskets();
  updateMobileTotal();
  updateDesktopBasketPosition();
}

function updateDesktopBasketPosition() {
  const basketPanel = document.getElementById("basketPanel");
  const pageLayout = document.querySelector(".page-layout");
  if (!basketPanel || !pageLayout) return;
  if (document.getElementById("basketDialog").classList.contains("hidden") &&
    document.getElementById("confirmationDialog").classList.contains("hidden")) {
    unlockPageScroll();
  }
  if (window.matchMedia("(max-width: 1270px)").matches) {
    basketPanel.classList.remove("desktop-basket--stuck");
    return;
  }
  const stickyTop = 24;
  const layoutTop = pageLayout.getBoundingClientRect().top + window.scrollY;
  basketPanel.classList.toggle("desktop-basket--stuck", window.scrollY >= layoutTop - stickyTop);
}

function bindDialogs() {
  document.getElementById("openBasketButton").onclick = openBasketDialog;
  document.getElementById("closeBasketButton").onclick = closeBasketDialog;
  document.getElementById("basketDialog").onclick = closeBasketFromBackdrop;
  document.getElementById("closeConfirmationButton").onclick = closeConfirmation;
  window.addEventListener("scroll", updateDesktopBasketPosition);
  window.addEventListener("resize", updateDesktopBasketPosition);
}

function closeBasketFromBackdrop(event) {
  if (event.target.id === "basketDialog") closeBasketDialog();
}

function openBasketDialog() {
  if (window.matchMedia("(max-width: 1270px)").matches) {
    document.getElementById("basketDialog").classList.remove("hidden");
    document.getElementById("basketPanel").classList.add("hidden");
    lockPageScroll();
    return;
  }
  document.getElementById("basketPanel").classList.remove("hidden");
}

function closeBasketDialog() {
  document.getElementById("basketDialog").classList.add("hidden");
  unlockPageScroll();
}

function closeConfirmation() {
  document.getElementById("confirmationDialog").classList.add("hidden");
  unlockPageScroll();
}

renderMenu();
renderBaskets();
bindDialogs();
updateMobileTotal();
updateDesktopBasketPosition();
