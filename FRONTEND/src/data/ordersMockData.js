/**
 * Mock data for the recycling orders module
 */

// Mock orders data
export const mockOrders = [
  {
    id: 1,
    date: "2023-04-15",
    items: [
      { type: "Cardboard", quantity: 3, unit: "kg" },
      { type: "Plastic Bottles", quantity: 5, unit: "kg" },
    ],
    status: "Completed",
    points: 40,
    address: "123 Green St, Eco City",
    shippingAccountId: "sa-001",
    timeline: [
      {
        time: "2023-04-15 09:00",
        status: "Order Created",
      },
      {
        time: "2023-04-15 10:30",
        status: "Confirmed by User",
      },
      {
        time: "2023-04-15 14:45",
        status: "Collector Assigned",
      },
      {
        time: "2023-04-16 09:15",
        status: "Pickup in Progress",
      },
      {
        time: "2023-04-16 11:30",
        status: "Materials Received",
      },
      {
        time: "2023-04-16 15:00",
        status: "Recycling Complete",
      },
    ],
    locationHistory: [
      {
        time: "2023-04-15 09:00",
        location: "123 Green St, Eco City",
        status: "Order Created",
      },
      {
        time: "2023-04-16 09:15",
        location: "123 Green St, Eco City",
        status: "Collector Arrived",
      },
      {
        time: "2023-04-16 11:30",
        location: "EcoRecycle Center, Processing Station",
        status: "Materials Arrived at Facility",
      },
      {
        time: "2023-04-16 15:00",
        location: "EcoRecycle Center, Recycling Complete",
        status: "Processing Completed",
      },
    ],
    collectorName: "John Green",
    collectorContact: "555-0123",
  },
  {
    id: 2,
    date: "2023-04-18",
    items: [
      { type: "Electronics", quantity: 2, unit: "items" },
      { type: "Glass", quantity: 4, unit: "kg" },
    ],
    status: "In Progress",
    points: 35,
    address: "456 Earth Ave, Green Town",
    shippingAccountId: "sa-002",
    timeline: [
      {
        time: "2023-04-18 11:20",
        status: "Order Created",
      },
      {
        time: "2023-04-18 12:30",
        status: "Confirmed by User",
      },
      {
        time: "2023-04-18 14:00",
        status: "Collector Assigned",
      },
      {
        time: "2023-04-19 09:00",
        status: "Pickup in Progress",
      },
    ],
    locationHistory: [
      {
        time: "2023-04-18 11:20",
        location: "456 Earth Ave, Green Town",
        status: "Order Created",
      },
      {
        time: "2023-04-18 14:00",
        location: "EcoRecycle Center, Dispatch Office",
        status: "Collector Assigned",
      },
      {
        time: "2023-04-19 08:30",
        location: "Green Logistics Hub, Loading Bay",
        status: "Collector Preparing for Pickup",
      },
      {
        time: "2023-04-19 09:00",
        location: "En Route to 456 Earth Ave",
        status: "On the Way to Customer",
      },
    ],
    collectorName: "Sarah Recycler",
    collectorContact: "555-0456",
  },
  {
    id: 3,
    date: "2023-04-20",
    items: [
      { type: "Paper", quantity: 7, unit: "kg" },
      { type: "Aluminum Cans", quantity: 2, unit: "kg" },
    ],
    status: "Pending Confirmation",
    points: 25,
    address: "789 Recycle Rd, Eco Heights",
    shippingAccountId: "sa-001",
    timeline: [
      {
        time: "2023-04-20 14:10",
        status: "Order Created",
      },
      {
        time: "2023-04-20 14:15",
        status: "Waiting for Confirmation",
      },
    ],
    locationHistory: [
      {
        time: "2023-04-20 14:10",
        location: "789 Recycle Rd, Eco Heights",
        status: "Order Created",
      },
    ],
    collectorName: "Alex Eco",
    collectorContact: "555-0789",
  },
];

// Waste categories with types
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

// Map for quick lookup of waste type points
export const wasteTypesMap = {
  paper: 5,
  newspaper: 4,
  cardboard: 6,
  magazines: 3,
  plastic_bottles: 7,
  plastic_containers: 6,
  plastic_bags: 3,
  plastic_wraps: 4,
  aluminum_cans: 8,
  steel_cans: 7,
  scrap_metal: 10,
  metal_foil: 5,
  glass_bottles: 6,
  glass_jars: 6,
  window_glass: 8,
  glass_containers: 7,
  small_electronics: 15,
  batteries: 10,
  cables: 8,
  household_appliances: 20,
};

const ordersMockData = {
  mockOrders,
  wasteCategories,
  wasteTypesMap,
};

export default ordersMockData;
