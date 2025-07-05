import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  
  createDb() {
    const products: Product[] = [
      {
        id: "1",
        name: "MacBook Pro 16\"",
        price: 2499.99,
        category: "electronics",
        description: "Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
        image: "https://picsum.photos/400/300?random=1",
        inStock: true,
        rating: 4.8,
        discount: 10,
        tags: ["apple", "laptop", "premium"]
      },
      {
        id: "2",
        name: "iPhone 15 Pro",
        price: 1199.99,
        category: "electronics",
        description: "Latest iPhone with titanium design and A17 Pro chip",
        image: "https://picsum.photos/400/300?random=2",
        inStock: true,
        rating: 4.9,
        tags: ["apple", "phone", "5g"]
      },
      {
        id: "3",
        name: "Samsung Galaxy S24",
        price: 899.99,
        category: "electronics",
        description: "Android flagship with AI features and 200MP camera",
        image: "https://picsum.photos/400/300?random=3",
        inStock: true,
        rating: 4.7,
        discount: 15,
        tags: ["samsung", "android", "camera"]
      },
      {
        id: "4",
        name: "Dell XPS 13",
        price: 1299.99,
        category: "electronics",
        description: "Ultra-portable laptop with InfinityEdge display",
        image: "https://picsum.photos/400/300?random=4",
        inStock: true,
        rating: 4.6,
        tags: ["dell", "laptop", "ultrabook"]
      },
      {
        id: "5",
        name: "Sony WH-1000XM5",
        price: 399.99,
        category: "electronics",
        description: "Industry-leading noise canceling headphones",
        image: "https://picsum.photos/400/300?random=5",
        inStock: true,
        rating: 4.8,
        tags: ["sony", "headphones", "noise-canceling"]
      },
      {
        id: "6",
        name: "Levi's 501 Original Jeans",
        price: 89.99,
        category: "clothing",
        description: "Classic straight-leg jeans in authentic indigo",
        image: "https://picsum.photos/400/300?random=6",
        inStock: true,
        rating: 4.5,
        tags: ["levis", "jeans", "denim"]
      },
      {
        id: "7",
        name: "Nike Air Max 270",
        price: 149.99,
        category: "clothing",
        description: "Lifestyle sneakers with visible Air unit",
        image: "https://picsum.photos/400/300?random=7",
        inStock: true,
        rating: 4.4,
        discount: 20,
        tags: ["nike", "sneakers", "casual"]
      },
      {
        id: "8",
        name: "Adidas Ultraboost 22",
        price: 189.99,
        category: "clothing",
        description: "Running shoes with responsive Boost midsole",
        image: "https://picsum.photos/400/300?random=8",
        inStock: true,
        rating: 4.6,
        tags: ["adidas", "running", "boost"]
      },
      {
        id: "9",
        name: "Patagonia Better Sweater",
        price: 119.99,
        category: "clothing",
        description: "Fleece jacket made from recycled polyester",
        image: "https://picsum.photos/400/300?random=9",
        inStock: true,
        rating: 4.7,
        tags: ["patagonia", "fleece", "sustainable"]
      },
      {
        id: "10",
        name: "Clean Code",
        price: 42.99,
        category: "books",
        description: "A Handbook of Agile Software Craftsmanship by Robert C. Martin",
        image: "https://picsum.photos/400/300?random=10",
        inStock: true,
        rating: 4.6,
        tags: ["programming", "software", "craft"]
      },
      {
        id: "11",
        name: "The Pragmatic Programmer",
        price: 39.99,
        category: "books",
        description: "From Journeyman to Master by Andy Hunt and Dave Thomas",
        image: "https://picsum.photos/400/300?random=11",
        inStock: true,
        rating: 4.8,
        tags: ["programming", "career", "development"]
      },
      {
        id: "12",
        name: "Design Patterns",
        price: 54.99,
        category: "books",
        description: "Elements of Reusable Object-Oriented Software",
        image: "https://picsum.photos/400/300?random=12",
        inStock: true,
        rating: 4.5,
        tags: ["design", "patterns", "oop"]
      },
      {
        id: "13",
        name: "Angular: Up & Running",
        price: 35.99,
        category: "books",
        description: "Learning Angular, Step by Step by Shyam Seshadri",
        image: "https://picsum.photos/400/300?random=13",
        inStock: true,
        rating: 4.3,
        tags: ["angular", "web", "frontend"]
      },
      {
        id: "14",
        name: "IKEA HEMNES Dresser",
        price: 179.99,
        category: "home",
        description: "6-drawer dresser in white stain",
        image: "https://picsum.photos/400/300?random=14",
        inStock: true,
        rating: 4.2,
        tags: ["ikea", "furniture", "storage"]
      },
      {
        id: "15",
        name: "Philips Hue Smart Bulb",
        price: 49.99,
        category: "home",
        description: "Color-changing LED bulb with app control",
        image: "https://picsum.photos/400/300?random=15",
        inStock: true,
        rating: 4.4,
        tags: ["smart home", "led", "lighting"]
      },
      {
        id: "16",
        name: "Dyson V15 Detect",
        price: 749.99,
        category: "home",
        description: "Cordless vacuum with laser dust detection",
        image: "https://picsum.photos/400/300?random=16",
        inStock: true,
        rating: 4.7,
        discount: 50,
        tags: ["dyson", "vacuum", "cleaning"]
      },
      {
        id: "17",
        name: "Instant Pot Duo 7-in-1",
        price: 99.99,
        category: "home",
        description: "Electric pressure cooker and multi-cooker",
        image: "https://picsum.photos/400/300?random=17",
        inStock: true,
        rating: 4.6,
        tags: ["cooking", "pressure cooker", "kitchen"]
      },
      {
        id: "18",
        name: "Yeti Rambler 20oz",
        price: 34.99,
        category: "sports",
        description: "Insulated stainless steel tumbler",
        image: "https://picsum.photos/400/300?random=18",
        inStock: true,
        rating: 4.8,
        tags: ["yeti", "tumbler", "insulated"]
      },
      {
        id: "19",
        name: "Peloton Bike+",
        price: 2495.00,
        category: "sports",
        description: "Indoor cycling bike with rotating screen",
        image: "https://picsum.photos/400/300?random=19",
        inStock: false,
        rating: 4.5,
        tags: ["peloton", "cycling", "fitness"]
      },
      {
        id: "20",
        name: "Wilson Tennis Racket",
        price: 149.99,
        category: "sports",
        description: "Pro Staff 97 tennis racket",
        image: "https://picsum.photos/400/300?random=20",
        inStock: true,
        rating: 4.4,
        tags: ["wilson", "tennis", "racket"]
      },
      {
        id: "21",
        name: "Garmin Fenix 7",
        price: 699.99,
        category: "sports",
        description: "Multisport GPS watch with solar charging",
        image: "https://picsum.photos/400/300?random=21",
        inStock: true,
        rating: 4.6,
        tags: ["garmin", "gps", "fitness"]
      },
      {
        id: "22",
        name: "Hydroflask 32oz",
        price: 44.99,
        category: "sports",
        description: "Insulated water bottle with flex cap",
        image: "https://picsum.photos/400/300?random=22",
        inStock: true,
        rating: 4.7,
        tags: ["hydroflask", "water bottle", "insulated"]
      },
      {
        id: "23",
        name: "ThinkPad X1 Carbon",
        price: 1899.99,
        category: "electronics",
        description: "Business laptop with 14\" 4K display",
        image: "https://picsum.photos/400/300?random=23",
        inStock: true,
        rating: 4.5,
        tags: ["lenovo", "business", "laptop"]
      },
      {
        id: "24",
        name: "AirPods Pro 2",
        price: 249.99,
        category: "electronics",
        description: "Wireless earbuds with adaptive transparency",
        image: "https://picsum.photos/400/300?random=24",
        inStock: true,
        rating: 4.6,
        tags: ["apple", "earbuds", "wireless"]
      },
      {
        id: "25",
        name: "iPad Pro 12.9\"",
        price: 1099.99,
        category: "electronics",
        description: "Professional tablet with M2 chip",
        image: "https://picsum.photos/400/300?random=25",
        inStock: true,
        rating: 4.8,
        tags: ["apple", "tablet", "creative"]
      },
      {
        id: "26",
        name: "Uniqlo Heattech Shirt",
        price: 19.99,
        category: "clothing",
        description: "Ultra-warm crew neck long sleeve T-shirt",
        image: "https://picsum.photos/400/300?random=26",
        inStock: true,
        rating: 4.3,
        tags: ["uniqlo", "thermal", "base layer"]
      },
      {
        id: "27",
        name: "Canada Goose Parka",
        price: 895.00,
        category: "clothing",
        description: "Expedition-grade winter coat",
        image: "https://picsum.photos/400/300?random=27",
        inStock: true,
        rating: 4.7,
        tags: ["canada goose", "winter", "parka"]
      },
      {
        id: "28",
        name: "Allbirds Tree Runners",
        price: 98.00,
        category: "clothing",
        description: "Sustainable sneakers made from eucalyptus",
        image: "https://picsum.photos/400/300?random=28",
        inStock: true,
        rating: 4.2,
        tags: ["allbirds", "sustainable", "sneakers"]
      },
      {
        id: "29",
        name: "JavaScript: The Good Parts",
        price: 29.99,
        category: "books",
        description: "By Douglas Crockford - Essential JavaScript guide",
        image: "https://picsum.photos/400/300?random=29",
        inStock: true,
        rating: 4.4,
        tags: ["javascript", "programming", "web"]
      },
      {
        id: "30",
        name: "You Don't Know JS",
        price: 149.99,
        category: "books",
        description: "Complete 6-book series by Kyle Simpson",
        image: "https://picsum.photos/400/300?random=30",
        inStock: true,
        rating: 4.7,
        tags: ["javascript", "advanced", "series"]
      },
      {
        id: "31",
        name: "Herman Miller Aeron Chair",
        price: 1395.00,
        category: "home",
        description: "Ergonomic office chair with PostureFit SL",
        image: "https://picsum.photos/400/300?random=31",
        inStock: true,
        rating: 4.6,
        tags: ["herman miller", "ergonomic", "office"]
      },
      {
        id: "32",
        name: "Nest Learning Thermostat",
        price: 249.99,
        category: "home",
        description: "Smart thermostat with energy-saving features",
        image: "https://picsum.photos/400/300?random=32",
        inStock: true,
        rating: 4.3,
        tags: ["nest", "smart home", "thermostat"]
      },
      {
        id: "33",
        name: "KitchenAid Stand Mixer",
        price: 379.99,
        category: "home",
        description: "5-quart artisan series mixer",
        image: "https://picsum.photos/400/300?random=33",
        inStock: true,
        rating: 4.8,
        tags: ["kitchenaid", "mixer", "baking"]
      },
      {
        id: "34",
        name: "Patagonia Houdini Jacket",
        price: 99.00,
        category: "sports",
        description: "Ultra-light windbreaker for outdoor activities",
        image: "https://picsum.photos/400/300?random=34",
        inStock: true,
        rating: 4.5,
        tags: ["patagonia", "windbreaker", "outdoor"]
      },
      {
        id: "35",
        name: "Osprey Atmos 65 Backpack",
        price: 260.00,
        category: "sports",
        description: "Hiking backpack with anti-gravity suspension",
        image: "https://picsum.photos/400/300?random=35",
        inStock: true,
        rating: 4.7,
        tags: ["osprey", "hiking", "backpack"]
      }
    ];

    // Generate categories from products
    const categories = Array.from(new Set(products.map(p => p.category)))
      .map((category, index) => ({
        id: (index + 1).toString(),
        name: category,
        displayName: category.charAt(0).toUpperCase() + category.slice(1)
      }));

    return { products, categories };
  }

  // Override the genId method to handle string IDs properly
  genId(collection: any[], collectionName: string): any {
    return collection.length > 0 
      ? (Math.max(...collection.map(item => +item.id)) + 1).toString()
      : '1';
  }
}