const deliveryFee = 4.99;
const basket = [];
let lockedScrollY = 0;

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

function init() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  renderMenu();
  renderBaskets();
  bindDialogs();
  updateMobileTotal();
  updateDesktopBasketPosition();
}

function createMeal(id, name, description, price, image) {
  return { id: id, name: name, description: description, price: price, image: image };
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}

function getMeal(mealId) {
  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    const meals = categories[categoryIndex].meals;
    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
      if (meals[mealIndex].id === mealId) {
        return meals[mealIndex];
      }
    }
  }
}

function getBasketItem(mealId) {
  for (let index = 0; index < basket.length; index++) {
    if (basket[index].id === mealId) {
      return basket[index];
    }
  }
}

function renderMenu() {
  let menuHtml = "";
  for (let index = 0; index < categories.length; index++) {
    menuHtml += createCategoryHtml(categories[index]);
  }
  document.getElementById("menuContent").innerHTML = menuHtml;
}

function createCategoryHtml(category) {
  let mealsHtml = "";
  for (let index = 0; index < category.meals.length; index++) {
    mealsHtml += createMealHtml(category.meals[index]);
  }

  return `
    <article class="category" id="${category.id}">
      <div class="category-header category-header--${category.id}">
        <img src="${category.icon}" alt="">
        <h2>${createCategoryTitleHtml(category)}</h2>
      </div>
      <div class="meal-list">${mealsHtml}</div>
    </article>`;
}

function createCategoryTitleHtml(category) {
  if (category.id === "pizza") {
    return `Pizza <span class="category-header__extra">(30cm)</span>`;
  }
  return category.name;
}

function createMealHtml(meal) {
  const item = getBasketItem(meal.id);
  let buttonText = "Hinzufügen";
  let buttonClass = "add-button";

  if (item) {
    buttonText = "Hinzugefügt " + item.quantity;
    buttonClass = "add-button is-added";
  }

  return `
    <article class="meal-card">
      <img src="${meal.image}" alt="${meal.name}">
      <div class="meal-info">
        <div class="meal-text">
          <h3>${meal.name}</h3>
          <p>${meal.description}</p>
        </div>
        <div class="meal-actions">
          <span class="price">${formatPrice(meal.price)}</span>
          <button class="${buttonClass}" onclick="addToBasket('${meal.id}')">${buttonText}</button>
        </div>
      </div>
    </article>`;
}

function addToBasket(mealId) {
  const item = getBasketItem(mealId);
  if (item) {
    item.quantity++;
  } else {
    basket.push({ id: mealId, quantity: 1 });
  }
  updateView();
  openBasketAfterAdd();
}

function increaseQuantity(mealId) {
  const item = getBasketItem(mealId);
  item.quantity++;
  updateView();
}

function decreaseQuantity(mealId) {
  const item = getBasketItem(mealId);
  if (item.quantity > 1) {
    item.quantity--;
    updateView();
  } else {
    removeFromBasket(mealId);
  }
}

function removeFromBasket(mealId) {
  for (let index = 0; index < basket.length; index++) {
    if (basket[index].id === mealId) {
      basket.splice(index, 1);
      break;
    }
  }
  updateView();

  if (basket.length === 0 && isMobileBasketMode()) {
    closeBasketDialog();
  }
}

function getSubtotal() {
  let sum = 0;
  for (let index = 0; index < basket.length; index++) {
    const meal = getMeal(basket[index].id);
    sum += meal.price * basket[index].quantity;
  }
  return sum;
}

function getTotal() {
  if (basket.length === 0) {
    return 0;
  }
  return getSubtotal() + deliveryFee;
}

function renderBaskets() {
  const basketHtml = createBasketHtml();
  document.getElementById("desktopBasket").innerHTML = basketHtml;
  document.getElementById("mobileBasket").innerHTML = basketHtml;
  setupBasketScrollbars();
}

function createBasketHtml() {
  if (basket.length === 0) {
    return createEmptyBasketHtml();
  }

  let basketItemsHtml = "";
  for (let index = 0; index < basket.length; index++) {
    basketItemsHtml += createBasketItemHtml(basket[index]);
  }

  return `
    <h2>Dein Warenkorb</h2>
    <div class="basket-scroll">
      <div class="basket-items">${basketItemsHtml}</div>
      <div class="basket-scrollbar"><div class="basket-scrollbar__thumb"></div></div>
    </div>
    ${createBasketSumHtml()}`;
}

function createEmptyBasketHtml() {
  return `
    <h2>Dein Warenkorb</h2>
    <div class="basket-empty">
      <p>Noch ist dein Warenkorb leer.<br>Such dir etwas Leckeres aus!</p>
      <img src="./assets/logo/basket.png" alt="">
    </div>`;
}

function createBasketItemHtml(item) {
  const meal = getMeal(item.id);
  let deleteButtonHtml = "";

  if (item.quantity > 1) {
    deleteButtonHtml = `<button class="delete-button basket-card__delete" aria-label="Gericht komplett entfernen" onclick="removeFromBasket('${item.id}')">🗑</button>`;
  }

  return `
    <article class="basket-card">
      <div class="basket-card__top">
        <h3>${item.quantity} x ${meal.name}</h3>
        ${deleteButtonHtml}
      </div>
      <div class="basket-card__bottom">
        ${createQuantityHtml(item)}
        <strong>${formatPrice(meal.price * item.quantity)}</strong>
      </div>
    </article>`;
}

function createQuantityHtml(item) {
  let decreaseButtonHtml = `<button class="quantity-button" aria-label="Menge verringern" onclick="decreaseQuantity('${item.id}')">−</button>`;

  if (item.quantity === 1) {
    decreaseButtonHtml = `<button class="quantity-button quantity-button--delete" aria-label="Gericht entfernen" onclick="removeFromBasket('${item.id}')">🗑</button>`;
  }

  return `
    <div class="quantity-controls">
      ${decreaseButtonHtml}
      <span>${item.quantity}</span>
      <button class="quantity-button" aria-label="Menge erhöhen" onclick="increaseQuantity('${item.id}')">+</button>
    </div>`;
}

function createBasketSumHtml() {
  let compactClass = "";
  if (getTotal() >= 100) {
    compactClass = "buy-button--compact";
  }

  return `
    <div class="basket-sums">
      <div class="sum-row"><span>Zwischensumme</span><span>${formatPrice(getSubtotal())}</span></div>
      <div class="sum-row"><span>Lieferkosten</span><span>${formatPrice(deliveryFee)}</span></div>
      <div class="sum-row total"><span>Gesamt</span><span>${formatPrice(getTotal())}</span></div>
      <button class="buy-button ${compactClass}" onclick="buyNow()">
        <span class="buy-button__label">Jetzt bestellen</span>
        <span class="buy-button__price">(${formatPrice(getTotal())})</span>
      </button>
    </div>`;
}

function setupBasketScrollbars() {
  const scrollAreas = document.querySelectorAll(".basket-scroll");
  for (let index = 0; index < scrollAreas.length; index++) {
    setupBasketScrollbar(scrollAreas[index]);
  }
}

function setupBasketScrollbar(scrollArea) {
  const list = scrollArea.querySelector(".basket-items");
  const thumb = scrollArea.querySelector(".basket-scrollbar__thumb");
  if (!list || !thumb) return;
  updateScrollbarThumb(list, thumb);
  list.onscroll = function () {
    updateScrollbarThumb(list, thumb);
  };
  thumb.onpointerdown = function (event) {
    startScrollbarDrag(event, list, thumb);
  };
}

function updateScrollbarThumb(list, thumb) {
  const maxScroll = list.scrollHeight - list.clientHeight;
  const track = thumb.parentElement.clientHeight - thumb.offsetHeight;
  let top = 0;

  if (maxScroll > 0) {
    top = (list.scrollTop / maxScroll) * track;
  }

  thumb.style.transform = "translateY(" + top + "px)";
  thumb.parentElement.classList.toggle("hidden", maxScroll <= 0);
}

function startScrollbarDrag(event, list, thumb) {
  event.preventDefault();
  const startY = event.clientY;
  const startTop = list.scrollTop;
  thumb.setPointerCapture(event.pointerId);
  thumb.onpointermove = function (moveEvent) {
    dragScrollbar(moveEvent, list, thumb, startY, startTop);
  };
  thumb.onpointerup = function () {
    stopScrollbarDrag(thumb);
  };
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
  if (basket.length === 0) return;
  basket.length = 0;
  updateView();
  showConfirmation();
}

function showConfirmation() {
  hideElement("basketDialog");
  lockPageScroll();
  showElement("confirmationDialog");
  window.setTimeout(closeConfirmation, 3000);
}

function updateMobileTotal() {
  let amount = 0;
  for (let index = 0; index < basket.length; index++) {
    amount += basket[index].quantity;
  }

  if (amount > 0) {
    document.getElementById("mobileBasketTotal").textContent = amount;
  } else {
    document.getElementById("mobileBasketTotal").textContent = "";
  }

  document.getElementById("openBasketButton").classList.toggle("is-filled", amount > 0);
}

function updateView() {
  renderMenu();
  renderBaskets();
  updateMobileTotal();
  updateDesktopBasketPosition();
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
  if (event.target.id === "basketDialog") {
    closeBasketDialog();
  }
}

function openBasketDialog() {
  showElement("basketDialog");
  hideElement("basketPanel");
  lockPageScroll();
}

function openBasketAfterAdd() {
  if (isMobileBasketMode()) {
    openBasketDialog();
  } else {
    hideElement("basketDialog");
    showElement("basketPanel");
    unlockPageScroll();
    updateDesktopBasketPosition();
  }
}

function closeBasketDialog() {
  hideElement("basketDialog");
  hideElement("basketPanel");
  unlockPageScroll();
}

function closeConfirmation() {
  hideElement("confirmationDialog");
  unlockPageScroll();
}

function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

function isMobileBasketMode() {
  const mobileButton = document.querySelector(".mobile-basket-button");
  return getComputedStyle(mobileButton).display !== "none";
}

function lockPageScroll() {
  if (document.body.classList.contains("modal-open")) return;
  lockedScrollY = window.scrollY;
  document.body.style.top = "-" + lockedScrollY + "px";
  document.body.classList.add("modal-open");
}

function unlockPageScroll() {
  if (!document.body.classList.contains("modal-open")) return;
  document.body.classList.remove("modal-open");
  document.body.style.top = "";
  window.scrollTo(0, lockedScrollY);
}

function updateDesktopBasketPosition() {
  const basketPanel = document.getElementById("basketPanel");
  const pageLayout = document.querySelector(".page-layout");
  if (!basketPanel || !pageLayout) return;

  if (isMobileBasketMode()) {
    basketPanel.classList.remove("desktop-basket--stuck");
    return;
  }

  const stickyTop = 24;
  const layoutTop = pageLayout.getBoundingClientRect().top + window.scrollY;
  basketPanel.classList.toggle("desktop-basket--stuck", window.scrollY >= layoutTop - stickyTop);
}
