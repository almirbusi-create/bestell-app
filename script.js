const deliveryFee = 4.99;
const basket = [];

const categories = [
  {
    id: "burger",
    name: "Burger",
    icon: "./assets/logo/category-burger.png",
    meals: [
      createMeal("veggieBurger", "Vegetarischer Pilz-Burger", "Pilze, Edamame, Tomaten, vegane Sauce", 16.9, "./assets/img/veggie-mushroom black burger.jpg"),
      createMeal("meatBurger", "Fleisch-Burger", "Rindfleisch, Bacon, Gewürzgurken, geräucherter Käse", 15.9, "./assets/img/ali meat burger.jpg"),
      createMeal("redBurger", "Roter Rindfleisch-Burger", "Rindfleisch, Käse, Tomaten, Salat, Zwiebeln", 14.9, "./assets/img/beef red burger.jpg"),
      createMeal("chickenBurger", "Großer Hähnchen-Burger", "Hähnchen, Käse, Tomaten, Salat, Zwiebeln", 15.9, "./assets/img/tripel sendwich.jpg")
    ]
  },
{
    id: "pizza",
    name: "Pizza (30cm)",
    icon: "./assets/logo/category-pizza.png",
    meals: [
      createMeal("margherita", "Pizza Margherita", "Tomatensauce, Mozzarella", 11.9, "./assets/img/pizza margarita.jpg"),
      createMeal("chorizo", "Pizza Chorizo", "Tomaten, Mozzarella, Chorizo", 13.9, "./assets/img/pizza choriza.jpg"),
      createMeal("funghi", "Pizza Funghi", "Rote Zwiebeln, Oliven, Champignons", 12.9, "./assets/img/funghi.jpg"),
      createMeal("quattro", "Vier-Käse-Pizza mit Hähnchen", "Hähnchen, Mozzarella, Gorgonzola, Fontina", 15.9, "./assets/img/quattro formaggi with chicken.jpg")
    ]
  },
  {
    id: "salad",
    name: "Salat",
    icon: "./assets/logo/category-salad.png",
    meals: [
      createMeal("arugula", "Warmer Rindfleisch-Rucola-Salat", "Rindfleisch, Rucola, Feldsalat, Kirschtomaten", 16.9, "./assets/img/wamm beef angula salad.jpg"),
      createMeal("greenSalad", "Kleiner grüner Salat", "Grüner Salat, Gurken, Karotten, Radieschen", 7.9, "./assets/img/salat mini.jpg"),
      createMeal("saladFood", "Grüner Salat mit Meeresfrüchten", "Gemischter Salat, Kirschtomaten, Meeresfrüchte", 16.9, "./assets/img/nudel salat.jpg"),
      createMeal("tofuSalad", "Veganer grüner Salat mit Tofu", "Grüner Salat, Kirschtomaten, Tofu, Paprika", 14.9, "./assets/img/vegan green salad with.jpg")
    ]
  }
];
function createMeal(id, name, description, price, image) {
  return { id, name, description, price, image };
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

function createCategoryTemplate(category) {
  return `<article class="category" id="${category.id}">
    <div class="category-header category-header--${category.id}"><img src="${category.icon}" alt=""><h2>${createCategoryTitleTemplate(category)}</h2></div>
    <div class="meal-list">${category.meals.map(createMealTemplate).join("")}</div>
  </article>`;
}

function createCategoryTitleTemplate(category) {
  if (category.id !== "pizza") return category.name;
  return `Pizza <span class="category-header__extra">(30cm)</span>`;
}

function createMealTemplate(meal) {
  const item = getBasketItem(meal.id);
  const label = item ? `Hinzugefügt ${item.quantity}` : "Hinzufügen";
  return `<article class="meal-card">
    <img src="${meal.image}" alt="${meal.name}">
    <div class="meal-info">
      <div class="meal-text"><h3>${meal.name}</h3><p>${meal.description}</p></div>
      <div class="meal-actions"><span class="price">${formatPrice(meal.price)}</span>
      <button class="add-button ${item ? "is-added" : ""}" onclick="addToBasket('${meal.id}')">${label}</button></div>
    </div>
  </article>`;
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

function createBasketTemplate() {
  if (!basket.length) return createEmptyBasketTemplate();
  return `<h2>Dein Warenkorb</h2><div class="basket-scroll">
    <div class="basket-items">${basket.map(createBasketItemTemplate).join("")}</div>
    <div class="basket-scrollbar"><div class="basket-scrollbar__thumb"></div></div>
    </div>${createBasketSumTemplate()}`;
}

function createEmptyBasketTemplate() {
  return `<h2>Dein Warenkorb</h2><div class="basket-empty">
    <p>Noch ist dein Warenkorb leer.<br>Such dir etwas Leckeres aus!</p>
    <img src="./assets/logo/basket.png" alt=""></div>`;
}

function createBasketItemTemplate(item) {
  const meal = getMeal(item.id);
  return `<article class="basket-card"><div class="basket-card__top">
    <h3>${item.quantity} x ${meal.name}</h3></div>
    <div class="basket-card__bottom">${createQuantityTemplate(item)}
    <strong>${formatPrice(meal.price * item.quantity)}</strong></div></article>`;
}

function createQuantityTemplate(item) {
  const decreaseButton = item.quantity === 1
    ? `<button class="quantity-button quantity-button--delete" aria-label="Gericht entfernen" onclick="removeFromBasket('${item.id}')">🗑</button>`
    : `<button class="quantity-button" aria-label="Menge verringern" onclick="decreaseQuantity('${item.id}')">−</button>`;
  return `<div class="quantity-controls">
    ${decreaseButton}
    <span>${item.quantity}</span>
    <button class="quantity-button" aria-label="Menge erhöhen" onclick="increaseQuantity('${item.id}')">+</button>
  </div>`;
}

function createBasketSumTemplate() {
  return `<div class="basket-sums">
    <div class="sum-row"><span>Zwischensumme</span><span>${formatPrice(getSubtotal())}</span></div>
    <div class="sum-row"><span>Lieferkosten</span><span>${formatPrice(deliveryFee)}</span></div>
    <div class="sum-row total"><span>Gesamt</span><span>${formatPrice(getTotal())}</span></div>
    <button class="buy-button ${getTotal() >= 100 ? "buy-button--compact" : ""}" onclick="buyNow()">
      <span class="buy-button__label">Jetzt bestellen</span>
      <span class="buy-button__price">(${formatPrice(getTotal())})</span>
    </button></div>`;
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
