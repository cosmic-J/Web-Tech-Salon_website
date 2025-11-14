const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/beautyStore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String, required: true },
  benefits: [String],
  ingredients: String,
  usage: String,
  stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: "Hydra-Glow Moisturizer",
    price: 49.99,
    originalPrice: 59.99,
    category: "moisturizer",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    rating: 4.8,
    description: "A lightweight, oil-free moisturizer that provides 24-hour hydration while leaving skin with a radiant glow.",
    benefits: [
      "24-hour hydration",
      "Non-comedogenic",
      "Oil-free formula",
      "SPF 30 protection",
      "Suitable for all skin types"
    ],
    ingredients: "Hyaluronic Acid, Vitamin E, Green Tea Extract, Ceramides",
    usage: "Apply morning and evening to clean face and neck. Gently massage until fully absorbed.",
    stock: 50
  },
  {
    name: "Sun Shield SPF 50+",
    price: 34.99,
    originalPrice: 42.99,
    category: "sunscreen",
    image: "https://images.unsplash.com/photo-1556228577-7e4e9ab8a5de?w=400&h=400&fit=crop",
    rating: 4.9,
    description: "Broad-spectrum sunscreen with lightweight texture that provides superior protection against UVA/UVB rays.",
    benefits: [
      "SPF 50+ protection",
      "Broad spectrum UVA/UVB",
      "Water resistant (80 minutes)",
      "Non-greasy formula",
      "Reef-safe ingredients"
    ],
    ingredients: "Zinc Oxide, Titanium Dioxide, Vitamin C, Aloe Vera",
    usage: "Apply generously 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.",
    stock: 75
  },
  {
    name: "Vitamin C Brightening Serum",
    price: 59.99,
    originalPrice: 69.99,
    category: "serum",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    rating: 4.7,
    description: "Potent antioxidant serum that brightens complexion, reduces dark spots, and protects against environmental damage.",
    benefits: [
      "Brightens complexion",
      "Reduces dark spots",
      "Antioxidant protection",
      "Boosts collagen",
      "Fights free radicals"
    ],
    ingredients: "20% Vitamin C, Ferulic Acid, Vitamin E, Hyaluronic Acid",
    usage: "Apply 2-3 drops to clean face every morning before moisturizer. Follow with sunscreen.",
    stock: 30
  },
  {
    name: "Gentle Foaming Cleanser",
    price: 28.99,
    originalPrice: 35.99,
    category: "cleanser",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
    rating: 4.6,
    description: "A gentle, pH-balanced foaming cleanser that effectively removes impurities without stripping natural oils.",
    benefits: [
      "pH-balanced formula",
      "Removes makeup",
      "Non-drying",
      "Suitable for sensitive skin",
      "Maintains skin barrier"
    ],
    ingredients: "Amino Acids, Glycerin, Chamomile Extract, Allantoin",
    usage: "Massage onto damp skin, then rinse thoroughly. Use morning and evening.",
    stock: 60
  }
];

async function insertSampleData() {
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Sample data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
}

insertSampleData();