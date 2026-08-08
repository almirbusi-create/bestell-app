const basket = [];

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
  if (!basket.length) closeBasketDialog();
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
  closeBasketDialog();
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
}

function bindDialogs() {
  document.getElementById("openBasketButton").onclick = openBasketDialog;
  document.getElementById("closeBasketButton").onclick = closeBasketDialog;
  document.getElementById("basketDialog").onclick = closeBasketFromBackdrop;
  document.getElementById("closeConfirmationButton").onclick = closeConfirmation;
}

function closeBasketFromBackdrop(event) {
  if (event.target.id === "basketDialog") closeBasketDialog();
}

function openBasketDialog() {
  if (window.matchMedia("(max-width: 900px)").matches) {
    document.getElementById("basketDialog").classList.remove("hidden");
    document.getElementById("basketPanel").classList.add("hidden");
    return;
  }
  document.getElementById("basketPanel").classList.remove("hidden");
}

function closeBasketDialog() {
  document.getElementById("basketPanel").classList.add("hidden");
  document.getElementById("basketDialog").classList.add("hidden");
}

function closeConfirmation() {
  document.getElementById("confirmationDialog").classList.add("hidden");
}

renderMenu();
renderBaskets();
bindDialogs();
updateMobileTotal();
