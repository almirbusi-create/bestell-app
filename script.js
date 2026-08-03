const deliveryFee = 4.99;
const basket = [];

const categories = [
  {
    id: "burger",
    name: "Burger & Sandwiches",
    icon: "./logo/logo1.png",
    meals: [
      createMeal("veggieBurger", "Vegetarischer Pilz-Burger", "Burgersauce, Tomaten, Fontina, Portobello", 16.9, "./img/veggie-mushroom black burger.jpg"),
      createMeal("meatBurger", "Fleisch-Burger", "Rindfleisch, Bacon, BBQ-Sauce, Cheddar", 15.9, "./img/ali meat burger.jpg"),
      createMeal("redBurger", "Roter Rindfleisch-Burger", "Rindfleisch, Käse, Tomaten, Salat, Zwiebeln", 14.9, "./img/beef red burger.jpg"),
      createMeal("chickenBurger", "Großer Hähnchen-Burger", "Hähnchen, Käse, Tomaten, Salat, Zwiebeln", 15.9, "./img/tripel sendwich.jpg")
    ]
  },
