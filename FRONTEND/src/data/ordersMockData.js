/**
 * Waste categories with types for recycling orders module
 */

export const wasteCategories = [
  {
    name: "Paper Products",
    types: [
      { id: "paper", label: "Paper", points: 5 },
      { id: "newspaper", label: "Newspaper", points: 4 },
      { id: "cardboard", label: "Cardboard", points: 6 },
      { id: "magazines", label: "Magazines", points: 3 },
    ],
  },
  {
    name: "Plastics",
    types: [
      { id: "plastic_bottles", label: "Plastic Bottles", points: 7 },
      { id: "plastic_containers", label: "Plastic Containers", points: 6 },
      { id: "plastic_bags", label: "Plastic Bags", points: 3 },
      { id: "plastic_wraps", label: "Plastic Wraps", points: 4 },
    ],
  },
  {
    name: "Metals",
    types: [
      { id: "aluminum_cans", label: "Aluminum Cans", points: 8 },
      { id: "steel_cans", label: "Steel Cans", points: 7 },
      { id: "scrap_metal", label: "Scrap Metal", points: 10 },
      { id: "metal_foil", label: "Metal Foil", points: 5 },
    ],
  },
  {
    name: "Glass",
    types: [
      { id: "glass_bottles", label: "Glass Bottles", points: 6 },
      { id: "glass_jars", label: "Glass Jars", points: 6 },
      { id: "window_glass", label: "Window Glass", points: 8 },
      { id: "glass_containers", label: "Glass Containers", points: 7 },
    ],
  },
  {
    name: "Electronics",
    types: [
      { id: "small_electronics", label: "Small Electronics", points: 15 },
      { id: "batteries", label: "Batteries", points: 10 },
      { id: "cables", label: "Cables & Wires", points: 8 },
      { id: "household_appliances", label: "Household Appliances", points: 20 },
    ],
  },
];
