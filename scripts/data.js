const deliveryFee = 4.99;

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
