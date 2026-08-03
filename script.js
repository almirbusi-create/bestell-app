const deliveryFee = 4.99;
const basket = [];

const categories = [
  {
    id: "burger",
    name: "Burger und Sandwiches",
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
    name: "Salate",
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
    <div class="category-header category-header--${category.id}"><img src="${category.icon}" alt=""><h2>${category.name}</h2></div>
    <div class="meal-list">${category.meals.map(createMealTemplate).join("")}</div>
  </article>`;
}

function createMealTemplate(meal) {
  const item = getBasketItem(meal.id);
  const label = item ? "Hinzugefügt" : "Hinzufügen";
  return `<article class="meal-card">
    <img src="${meal.image}" alt="${meal.name}">
    <div class="meal-info"><h3>${meal.name}</h3><p>${meal.description}</p></div>
    <div class="meal-actions"><span class="price">${formatPrice(meal.price)}</span>
    <button class="add-button ${item ? "is-added" : ""}" onclick="addToBasket('${meal.id}')">${label}</button></div>
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
}

function createBasketTemplate() {
  if (!basket.length) return createEmptyBasketTemplate();
  return `<h2>Dein Warenkorb</h2><div class="basket-items">
    ${basket.map(createBasketItemTemplate).join("")}</div>${createBasketSumTemplate()}`;
}

function createEmptyBasketTemplate() {
  return `<h2>Dein Warenkorb</h2><div class="basket-empty">
    <p>Noch ist dein Warenkorb leer.<br>Such dir etwas Leckeres aus!</p>
    <img src="./assets/logo/basket.png" alt=""></div>`;
}

function createBasketItemTemplate(item) {
  const meal = getMeal(item.id);
  return `<article class="basket-card"><div class="basket-card__top">
    <h3>${item.quantity} x ${meal.name}</h3>
    <button class="delete-button" onclick="removeFromBasket('${item.id}')">×</button></div>
    <div class="basket-card__bottom">${createQuantityTemplate(item)}
    <strong>${formatPrice(meal.price * item.quantity)}</strong></div></article>`;
}

function createQuantityTemplate(item) {
  return `<div class="quantity-controls">
    <button class="quantity-button" onclick="decreaseQuantity('${item.id}')">−</button>
    <span>${item.quantity}</span>
    <button class="quantity-button" onclick="increaseQuantity('${item.id}')">+</button>
  </div>`;
}

function createBasketSumTemplate() {
  return `<div class="basket-sums">
    <div class="sum-row"><span>Zwischensumme</span><span>${formatPrice(getSubtotal())}</span></div>
    <div class="sum-row"><span>Lieferkosten</span><span>${formatPrice(deliveryFee)}</span></div>
    <div class="sum-row total"><span>Gesamt</span><span>${formatPrice(getTotal())}</span></div>
    <button class="buy-button" onclick="buyNow()">Jetzt bestellen (${formatPrice(getTotal())})</button></div>`;
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
  document.getElementById("mobileBasketTotal").textContent = formatPrice(getTotal());
}

function updateView() {
  renderMenu();
  renderBaskets();
  updateMobileTotal();
}

function bindDialogs() {
  document.getElementById("openBasketButton").onclick = openBasketDialog;
  document.getElementById("closeBasketButton").onclick = closeBasketDialog;
  document.getElementById("closeConfirmationButton").onclick = closeConfirmation;
}

function openBasketDialog() {
  if (!basket.length) return;
  document.getElementById("basketPanel").classList.remove("hidden");
  document.getElementById("basketDialog").classList.add("hidden");
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
