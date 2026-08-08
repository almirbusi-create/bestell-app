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
  const deleteButton = item.quantity > 1
    ? `<button class="delete-button basket-card__delete" aria-label="Gericht komplett entfernen" onclick="removeFromBasket('${item.id}')">🗑</button>`
    : "";
  return `<article class="basket-card"><div class="basket-card__top">
    <h3>${item.quantity} x ${meal.name}</h3>${deleteButton}</div>
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
