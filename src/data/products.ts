import type { Arepa } from "../types";

export const arepasData: Arepa[] = [
  // Sencilla
  { id: "1", name: "Pollo", description: "Rellena de pollo.", price: 9000, category: "Sencilla" },
  { id: "2", name: "Carne", description: "Rellena de carne.", price: 9000, category: "Sencilla" },

  // Combinada
  { id: "3", name: "Combinada 1", description: "Pollo, Carne.", price: 10000, category: "Combinada" },
  { id: "4", name: "Combinada 2", description: "Pollo, Cábano.", price: 10000, category: "Combinada" },
  { id: "5", name: "Combinada 3", description: "Carne, Cábano.", price: 10000, category: "Combinada" },

  // Mixta
  { id: "6", name: "Mixta 1", description: "Pollo, Carne, Cábano.", price: 11000, category: "Mixta" },
  { id: "7", name: "Mixta 2", description: "Pollo, Carne, Chorizo.", price: 11000, category: "Mixta" },
  { id: "8", name: "Mixta 3", description: "Carne, Cábano, Tocineta.", price: 11000, category: "Mixta" },

  // Super
  { id: "9", name: "Súper 1", description: "Pollo, Carne, Cábano, Jamón de Cordero.", price: 12000, category: "Súper" },
  { id: "10", name: "Súper 2", description: "Pollo, Carne, Chorizo, Tocineta.", price: 12000, category: "Súper" },

  // Super Mixta
  { id: "11", name: "Súper Mixta 1", description: "Pollo, Carne, Cábano, Maíz, Jamón de Cordero.", price: 13000, category: "Súper Mixta" },
  { id: "12", name: "Súper Mixta 2", description: "Pollo, Chorizo, Maíz, Maduro, Tocineta.", price: 13000, category: "Súper Mixta" },

  // Especial
  { id: "13", name: "La Especial Aretaz", description: "Con Todo: Pollo, Carne, Cábano, Chorizo, Tocineta, Maíz, Jamón, Maduro.", price: 15000, category: "Especial" },

  // --- Segmento: Bebidas ---
  { id: "b1", name: "Coca-Cola", description: "Bebida gaseosa tradicional bien fría.", price: 4000, category: "Gaseosas", segment: "Bebidas" },
  { id: "b2", name: "Manzana Postobón", description: "Bebida gaseosa sabor manzana.", price: 3500, category: "Gaseosas", segment: "Bebidas" },
  { id: "b3", name: "Colombiana Postobón", description: "La nuestra, bebida gaseosa dulce.", price: 3500, category: "Gaseosas", segment: "Bebidas" },
  { id: "b4", name: "Uva Postobón", description: "Bebida gaseosa sabor uva.", price: 3500, category: "Gaseosas", segment: "Bebidas" },

  // --- Segmento: Fritos ---
  { id: "f1", name: "Empanada Mixta", description: "Crujiente empanada rellena de pollo y carne.", price: 3500, category: "Empanadas", segment: "Fritos" },
  { id: "f2", name: "Flauta Pollo Queso", description: "Rollo frito crujiente con pollo y doble queso.", price: 4500, category: "Flautas", segment: "Fritos" },
  { id: "f3", name: "Flauta Hawaiana", description: "Rollo crujiente de jamón, queso y dulce de piña.", price: 4500, category: "Flautas", segment: "Fritos" },
  { id: "f4", name: "Papa Rellena Tradicional", description: "Papa rellena al estilo costeño con carne.", price: 5000, category: "Papas Rellenas", segment: "Fritos" },
];

export const segmentsConfig = [
  { id: "Arepas", icon: "🫓" },
  { id: "Bebidas", icon: "🥤" },
  { id: "Fritos", icon: "🥟" }
];
