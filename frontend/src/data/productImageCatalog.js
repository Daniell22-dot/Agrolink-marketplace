// AgroLink Frontend Product Image Catalog
// Mirror of backend/src/data/productImageCatalog.js. Images are hardcoded full
// URLs so they always render, even when the API is unavailable or slow.
// The backend remains the single source of truth (GET /api/images/catalog).

const DEFAULT_IMAGE = "/images/Water.jpg";

const CATEGORY_DEFAULTS = {
  "grains": ["/images/Maize1.jpg"],
  "vegetables": ["/images/Carrots.jpg"],
  "fruits": ["/images/Bananas.jpg"],
  "dairy": ["/images/Milk.jpg"],
  "meat": ["/images/Pork.jpg"],
  "livestock": ["/images/Goat.jpg"],
  "herbs": ["/images/Chillie(Pilipili).jpg"],
  "farm-inputs": ["/images/Fertilizer.jpg"],
  "tools": ["/images/Farm tools.jpg"],
  "other": ["/images/Water.jpg"]
};

const PRODUCT_IMAGES = [
  {
    "id": "maize",
    "label": "Maize (Corn)",
    "category": "grains",
    "keywords": [
      "maize",
      "corn",
      "mahindi",
      "corns"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "maize-flour",
    "label": "Maize Flour (Cornmeal)",
    "category": "grains",
    "keywords": [
      "maize flour",
      "cornmeal",
      "corn meal",
      "unga",
      "ugali",
      "sembe",
      "posho"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "wheat",
    "label": "Wheat",
    "category": "grains",
    "keywords": [
      "wheat",
      "ngano",
      "wheat grain"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "wheat-flour",
    "label": "Wheat Flour (All-Purpose)",
    "category": "grains",
    "keywords": [
      "wheat flour",
      "all purpose flour",
      "white flour",
      "baking flour",
      "chapati flour",
      "unga wa ngano"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "rice",
    "label": "Rice",
    "category": "grains",
    "keywords": [
      "rice",
      "pishori",
      "basmati",
      "mchele",
      "mpunga",
      "brown rice"
    ],
    "images": [
      "/images/Rice planting.jpg"
    ]
  },
  {
    "id": "rosecoco-beans",
    "label": "Rosecoco Beans",
    "category": "grains",
    "keywords": [
      "rosecoco",
      "red beans",
      "kidney beans",
      "maharage"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "nyayo-beans",
    "label": "Nyayo / Wairimu Beans",
    "category": "grains",
    "keywords": [
      "nyayo",
      "wairimu",
      "yellow beans",
      "cranberry beans"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "black-beans",
    "label": "Black Beans",
    "category": "grains",
    "keywords": [
      "black beans",
      "black eyed beans",
      "mbegu nyeusi"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "soya-beans",
    "label": "Soya Beans (Soybeans)",
    "category": "grains",
    "keywords": [
      "soya",
      "soy",
      "soybean",
      "soybean seed",
      "soya bean",
      "maharage ya soya"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "green-grams",
    "label": "Green Grams (Mung Beans)",
    "category": "grains",
    "keywords": [
      "green gram",
      "green grams",
      "ndengu",
      "mung bean",
      "mung beans"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "pigeon-peas",
    "label": "Pigeon Peas",
    "category": "grains",
    "keywords": [
      "pigeon pea",
      "pigeon peas",
      "mbaazi"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "cowpeas",
    "label": "Cowpeas (Kunde)",
    "category": "grains",
    "keywords": [
      "cowpea",
      "cowpeas",
      "kunde"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "sorghum",
    "label": "Sorghum",
    "category": "grains",
    "keywords": [
      "sorghum",
      "mtama",
      "sorghum grain"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "millet",
    "label": "Millet",
    "category": "grains",
    "keywords": [
      "millet",
      "ulezi",
      "finger millet",
      "wimbi"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "groundnuts",
    "label": "Groundnuts (Peanuts)",
    "category": "grains",
    "keywords": [
      "groundnut",
      "groundnuts",
      "peanut",
      "peanuts",
      "njugu",
      "karanga",
      "achaari"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "sunflower-seeds",
    "label": "Sunflower Seeds",
    "category": "grains",
    "keywords": [
      "sunflower seed",
      "sunflower seeds",
      "alizeti",
      "seed"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "coffee",
    "label": "Coffee (Green Beans)",
    "category": "grains",
    "keywords": [
      "coffee",
      "kahawa",
      "coffee bean",
      "arabica"
    ],
    "images": [
      "/images/Coffee.jpg"
    ]
  },
  {
    "id": "tea",
    "label": "Tea Leaves",
    "category": "grains",
    "keywords": [
      "tea",
      "chai",
      "tea leaf",
      "tea leaves",
      "black tea"
    ],
    "images": [
      "/images/Coffee berriess.jpg"
    ]
  },
  {
    "id": "sugar",
    "label": "Sugar",
    "category": "grains",
    "keywords": [
      "sugar",
      "sukari",
      "granulated sugar",
      "cane sugar"
    ],
    "images": [
      "/images/Sugar Cane.jpg"
    ]
  },
  {
    "id": "sugarcane",
    "label": "Sugarcane",
    "category": "grains",
    "keywords": [
      "sugarcane",
      "sugar cane",
      "muwa",
      "cane"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "tomatoes",
    "label": "Tomatoes",
    "category": "vegetables",
    "keywords": [
      "tomato",
      "tomatoes",
      "nyanya"
    ],
    "images": [
      "/images/Chillie(Pilipili).jpg"
    ]
  },
  {
    "id": "onions",
    "label": "Onions",
    "category": "vegetables",
    "keywords": [
      "onion",
      "onions",
      "vitunguu",
      "red onion"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "sukuma-wiki",
    "label": "Sukuma Wiki (Collard Greens)",
    "category": "vegetables",
    "keywords": [
      "sukuma",
      "sukuma wiki",
      "collard",
      "collard green",
      "collard greens"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "kale",
    "label": "Kale",
    "category": "vegetables",
    "keywords": [
      "kale",
      "kales"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "spinach",
    "label": "Spinach",
    "category": "vegetables",
    "keywords": [
      "spinach",
      "mchicha",
      "green leafy",
      "leafy greens"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "cabbage",
    "label": "Cabbage",
    "category": "vegetables",
    "keywords": [
      "cabbage",
      "kabichi"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "carrots",
    "label": "Carrots",
    "category": "vegetables",
    "keywords": [
      "carrot",
      "carrots",
      "karoti"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "irish-potatoes",
    "label": "Irish Potatoes",
    "category": "vegetables",
    "keywords": [
      "irish potato",
      "irish potatoes",
      "potato",
      "potatoes",
      "viazi",
      "shangi",
      "white potato"
    ],
    "images": [
      "/images/Irish Potatoes.jpg"
    ]
  },
  {
    "id": "sweet-potatoes",
    "label": "Sweet Potatoes",
    "category": "vegetables",
    "keywords": [
      "sweet potato",
      "sweet potatoes",
      "viazi vitamin",
      "viazi vitamu",
      "kiazi",
      "orange sweet potato"
    ],
    "images": [
      "/images/Sweat Potatoes.jpg"
    ]
  },
  {
    "id": "cassava",
    "label": "Cassava (Muhogo)",
    "category": "vegetables",
    "keywords": [
      "cassava",
      "muhogo",
      "manioc",
      "yucca"
    ],
    "images": [
      "/images/Maize.jpg"
    ]
  },
  {
    "id": "yams",
    "label": "Yams",
    "category": "vegetables",
    "keywords": [
      "yam",
      "yams",
      "tubers",
      "true yam"
    ],
    "images": [
      "/images/Nduma(Arrow root).jpg"
    ]
  },
  {
    "id": "green-beans",
    "label": "Green Beans (French Beans)",
    "category": "vegetables",
    "keywords": [
      "green bean",
      "green beans",
      "french bean",
      "french beans",
      "snap bean"
    ],
    "images": [
      "/images/Beans.jpg"
    ]
  },
  {
    "id": "bell-peppers",
    "label": "Bell Peppers (Pilipili Hoho)",
    "category": "vegetables",
    "keywords": [
      "bell pepper",
      "bell peppers",
      "capsicum",
      "hoho",
      "sweet pepper",
      "pilipili hoho"
    ],
    "images": [
      "/images/Chillie(Pilipili).jpg"
    ]
  },
  {
    "id": "chilli",
    "label": "Chillies (Pilipili)",
    "category": "vegetables",
    "keywords": [
      "chilli",
      "chillies",
      "chili",
      "hot pepper",
      "pilipili",
      "bird eye chilli"
    ],
    "images": [
      "/images/Chillie(Pilipili).jpg"
    ]
  },
  {
    "id": "garlic",
    "label": "Garlic",
    "category": "vegetables",
    "keywords": [
      "garlic",
      "kitunguu saumu"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "ginger",
    "label": "Ginger",
    "category": "vegetables",
    "keywords": [
      "ginger",
      "tangawizi"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "eggplant",
    "label": "Eggplant (Biringanya)",
    "category": "vegetables",
    "keywords": [
      "eggplant",
      "biringanya",
      "aubergine"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "cucumber",
    "label": "Cucumber",
    "category": "vegetables",
    "keywords": [
      "cucumber",
      "tango",
      "cucumbers"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "pumpkin",
    "label": "Pumpkin",
    "category": "vegetables",
    "keywords": [
      "pumpkin",
      "malenge",
      "butternut",
      "butternut squash"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "mushrooms",
    "label": "Mushrooms",
    "category": "vegetables",
    "keywords": [
      "mushroom",
      "mushrooms",
      "uyoga"
    ],
    "images": [
      "/images/Maize1.jpg"
    ]
  },
  {
    "id": "banana",
    "label": "Bananas",
    "category": "fruits",
    "keywords": [
      "banana",
      "bananas",
      "ndizi"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "avocado",
    "label": "Avocados",
    "category": "fruits",
    "keywords": [
      "avocado",
      "avocados",
      "parachichi",
      "avocado pear"
    ],
    "images": [
      "/images/Avocado.jpg"
    ]
  },
  {
    "id": "mango",
    "label": "Mangoes",
    "category": "fruits",
    "keywords": [
      "mango",
      "mangoes",
      "embe"
    ],
    "images": [
      "/images/Maembe(Mangoes).jpg"
    ]
  },
  {
    "id": "papaya",
    "label": "Papaya (Pawpaw)",
    "category": "fruits",
    "keywords": [
      "papaya",
      "pawpaw",
      "mbibo"
    ],
    "images": [
      "/images/Pawpaw.jpg"
    ]
  },
  {
    "id": "pineapple",
    "label": "Pineapples",
    "category": "fruits",
    "keywords": [
      "pineapple",
      "pineapples",
      "nanasi"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "orange",
    "label": "Oranges",
    "category": "fruits",
    "keywords": [
      "orange",
      "oranges",
      "machungwa"
    ],
    "images": [
      "/images/Oranges.jpg"
    ]
  },
  {
    "id": "lemon",
    "label": "Lemons",
    "category": "fruits",
    "keywords": [
      "lemon",
      "lemons",
      "ndimu"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "lime",
    "label": "Limes",
    "category": "fruits",
    "keywords": [
      "lime",
      "limes"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "apple",
    "label": "Apples",
    "category": "fruits",
    "keywords": [
      "apple",
      "apples",
      "tufaha"
    ],
    "images": [
      "/images/Apples.jpg"
    ]
  },
  {
    "id": "watermelon",
    "label": "Watermelon",
    "category": "fruits",
    "keywords": [
      "watermelon",
      "tikitimaji",
      "tikitini",
      "matikiti"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "passion-fruit",
    "label": "Passion Fruit",
    "category": "fruits",
    "keywords": [
      "passion fruit",
      "kakungu",
      "karakara"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "grapes",
    "label": "Grapes",
    "category": "fruits",
    "keywords": [
      "grape",
      "grapes",
      "zabibu"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "strawberry",
    "label": "Strawberries",
    "category": "fruits",
    "keywords": [
      "strawberry",
      "strawberries",
      "stroberi"
    ],
    "images": [
      "/images/Berries.jpg"
    ]
  },
  {
    "id": "peach",
    "label": "Peaches",
    "category": "fruits",
    "keywords": [
      "peach",
      "peaches"
    ],
    "images": [
      "/images/Apples.jpg"
    ]
  },
  {
    "id": "plum",
    "label": "Plums",
    "category": "fruits",
    "keywords": [
      "plum",
      "plums"
    ],
    "images": [
      "/images/Apples.jpg"
    ]
  },
  {
    "id": "coconut",
    "label": "Coconuts",
    "category": "fruits",
    "keywords": [
      "coconut",
      "coconuts",
      "nazi"
    ],
    "images": [
      "/images/Bananas.jpg"
    ]
  },
  {
    "id": "guava",
    "label": "Guava",
    "category": "fruits",
    "keywords": [
      "guava",
      "mapera"
    ],
    "images": [
      "/images/White Guavas.jpg"
    ]
  },
  {
    "id": "avocado-oil",
    "label": "Avocado Oil",
    "category": "fruits",
    "keywords": [
      "avocado oil",
      "oil"
    ],
    "images": [
      "/images/Avocado.jpg"
    ]
  },
  {
    "id": "dairy-cow",
    "label": "Dairy Cow / Cattle",
    "category": "livestock",
    "keywords": [
      "cow",
      "cattle",
      "friesian",
      "holstein",
      "dairy cow",
      "heifer",
      "ngombe",
      "bull"
    ],
    "images": [
      "/images/Cow.jpg",
      "/images/Cow1.jpg"
    ]
  },
  {
    "id": "goat",
    "label": "Goat (Live)",
    "category": "livestock",
    "keywords": [
      "goat",
      "live goat",
      "galla",
      "mbuzi"
    ],
    "images": [
      "/images/Goat.jpg"
    ]
  },
  {
    "id": "sheep",
    "label": "Sheep / Ram",
    "category": "livestock",
    "keywords": [
      "sheep",
      "ram",
      "dorper",
      "ewe",
      "kondoo",
      "lamb stock"
    ],
    "images": [
      "/images/Irish Potatoes.jpg"
    ]
  },
  {
    "id": "chicks",
    "label": "Chicks / Kienyeji",
    "category": "livestock",
    "keywords": [
      "chick",
      "chicks",
      "kienyeji",
      "rooster",
      "cock",
      "day old",
      "day-old",
      "hatchery",
      "kuku"
    ],
    "images": [
      "/images/Chicks.jpg"
    ]
  },
  {
    "id": "beef",
    "label": "Beef",
    "category": "meat",
    "keywords": [
      "beef",
      "steak",
      "ngombe nyama",
      "nyama ngombe",
      "beef meat",
      "red meat"
    ],
    "images": [
      "/images/Mutton meat.jpg",
      "/images/Cow.jpg",
      "/images/Tilapia.jpg"
    ]
  },
  {
    "id": "goat-meat",
    "label": "Goat Meat",
    "category": "meat",
    "keywords": [
      "goat",
      "goat meat",
      "mbuzi",
      "nyama mbuzi"
    ],
    "images": [
      "/images/Mutton meat.jpg",
      "/images/Tilapia.jpg"
    ]
  },
  {
    "id": "mutton",
    "label": "Mutton / Lamb",
    "category": "meat",
    "keywords": [
      "mutton",
      "lamb",
      "kondoo",
      "ram"
    ],
    "images": [
      "/images/Mutton meat.jpg"
    ]
  },
  {
    "id": "pork",
    "label": "Pork",
    "category": "meat",
    "keywords": [
      "pork",
      "nguruwe",
      "pork meat"
    ],
    "images": [
      "/images/Pork.jpg",
      "/images/Mutton meat.jpg"
    ]
  },
  {
    "id": "chicken",
    "label": "Chicken (Broiler)",
    "category": "meat",
    "keywords": [
      "chicken",
      "broiler",
      "kuku",
      "kuku nyama",
      "chicken meat",
      "poultry"
    ],
    "images": [
      "https://images.pexels.com/photos/24182617/pexels-photo-24182617.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop"
    ]
  },
  {
    "id": "whole-chicken",
    "label": "Whole Chicken",
    "category": "meat",
    "keywords": [
      "whole chicken",
      "free range chicken",
      "kienyeji",
      "kuku kienyeji",
      "live chicken"
    ],
    "images": [
      "/images/Chicks.jpg",
      "/images/Chicks1.jpg"
    ]
  },
  {
    "id": "turkey",
    "label": "Turkey",
    "category": "meat",
    "keywords": [
      "turkey",
      "turkey meat"
    ],
    "images": [
      "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=500"
    ]
  },
  {
    "id": "eggs",
    "label": "Eggs",
    "category": "meat",
    "keywords": [
      "egg",
      "eggs",
      "mayai",
      "tray of eggs"
    ],
    "images": [
      "/images/Chicks.jpg",
      "/images/Chicks1.jpg"
    ]
  },
  {
    "id": "tilapia",
    "label": "Tilapia",
    "category": "meat",
    "keywords": [
      "tilapia",
      "fish",
      "samaki",
      "catfish",
      "whole fish",
      "fresh fish",
      "fish fillet"
    ],
    "images": [
      "https://images.pexels.com/photos/229789/pexels-photo-229789.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.pexels.com/photos/6149077/pexels-photo-6149077.jpeg?auto=compress&cs=tinysrgb&w=500"
    ]
  },
  {
    "id": "omena",
    "label": "Omena (Sardines / Dagaa)",
    "category": "meat",
    "keywords": [
      "omena",
      "sardine",
      "sardines",
      "dagaa",
      "omena fish"
    ],
    "images": [
      "/images/Tilapia.jpg",
      "/images/Fish.jpg"
    ]
  },
  {
    "id": "honey",
    "label": "Honey",
    "category": "meat",
    "keywords": [
      "honey",
      "asali",
      "raw honey"
    ],
    "images": [
      "/images/Guava.jpg"
    ]
  },
  {
    "id": "milk",
    "label": "Fresh Milk",
    "category": "dairy",
    "keywords": [
      "milk",
      "maziwa",
      "raw milk",
      "fresh milk"
    ],
    "images": [
      "/images/Milk.jpg"
    ]
  },
  {
    "id": "cheese",
    "label": "Cheese",
    "category": "dairy",
    "keywords": [
      "cheese",
      "jibini"
    ],
    "images": [
      "/images/Milk.jpg"
    ]
  },
  {
    "id": "butter",
    "label": "Butter",
    "category": "dairy",
    "keywords": [
      "butter",
      "siagi",
      "ghee"
    ],
    "images": [
      "/images/Milk.jpg"
    ]
  },
  {
    "id": "yogurt",
    "label": "Yogurt",
    "category": "dairy",
    "keywords": [
      "yogurt",
      "yoghurt",
      "maziwa lala",
      "fermented milk"
    ],
    "images": [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop"
    ]
  },
  {
    "id": "coriander",
    "label": "Coriander (Dhania)",
    "category": "herbs",
    "keywords": [
      "coriander",
      "cilantro",
      "dhania",
      "coriander leaves"
    ],
    "images": [
      "/images/Carrots.jpg"
    ]
  },
  {
    "id": "turmeric",
    "label": "Turmeric",
    "category": "herbs",
    "keywords": [
      "turmeric",
      "manjano"
    ],
    "images": [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop"
    ]
  },
  {
    "id": "black-pepper",
    "label": "Black Pepper",
    "category": "herbs",
    "keywords": [
      "black pepper",
      "pepper",
      "pilipili manga"
    ],
    "images": [
      "/images/Coffee.jpg"
    ]
  },
  {
    "id": "veterinary",
    "label": "Veterinary Services",
    "category": "other",
    "keywords": [
      "vet",
      "veterinary",
      "vaccination",
      "livestock advisory",
      "dairy",
      "poultry advisory"
    ],
    "images": [
      "/images/Cow.jpg"
    ]
  },
  {
    "id": "hay",
    "label": "Hay / Fodder",
    "category": "other",
    "keywords": [
      "hay",
      "fodder",
      "nyasi",
      "silage",
      "animal feed"
    ],
    "images": [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&auto=format&fit=crop"
    ]
  },
  {
    "id": "fertilizer",
    "label": "Fertilizer",
    "category": "farm-inputs",
    "keywords": [
      "fertilizer",
      "can",
      "dap",
      "urea",
      "npk",
      " compost",
      "manure",
      "soil amendment",
      "nutrient"
    ],
    "images": [
      "/images/CAN fertilizer.jpeg",
      "/images/DAP fertilizer.jpg"
    ]
  },
  {
    "id": "seeds",
    "label": "Seeds",
    "category": "farm-inputs",
    "keywords": [
      "seeds",
      "seed",
      "planting",
      "vegetable seeds",
      "herb seeds",
      "legume seeds",
      "grain seeds",
      "fruit seeds"
    ],
    "images": [
      "/images/Variant of seeds.jpg"
    ]
  },
  {
    "id": "irrigation",
    "label": "Irrigation Systems",
    "category": "tools",
    "keywords": [
      "irrigation",
      "drip irrigation",
      "sprinkler",
      "knapsack",
      "sprayer",
      "water pump",
      "hose",
      "piping"
    ],
    "images": [
      "/images/Drip Irrigation.jpg",
      "/images/knapsack sprayer.jpeg",
      "/images/Sprinkler.jpg"
    ]
  },
  {
    "id": "greenhouse",
    "label": "Greenhouse / Polythene",
    "category": "tools",
    "keywords": [
      "greenhouse",
      "polythene",
      "plastic film",
      "cover",
      "tunnel",
      "shade net"
    ],
    "images": [
      "/images/Fabric grow bag.jpeg"
    ]
  },
  {
    "id": "farm-tools",
    "label": "Farm Tools & Equipment",
    "category": "tools",
    "keywords": [
      "tools",
      "farm tools",
      "equipment",
      "hoe",
      "machete",
      "spade",
      "shovel",
      "wheelbarrow",
      "gloves",
      "gumboots",
      "boots"
    ],
    "images": [
      "/images/Farm tools.jpg",
      "/images/Gloves.jpg",
      "/images/Grren Gum boots.jpg"
    ]
  }
];

const getCatalog = () => ({
    products: PRODUCT_IMAGES,
    categories: CATEGORY_DEFAULTS,
    default: DEFAULT_IMAGE
});

module.exports = {
    PRODUCT_IMAGES,
    CATEGORY_DEFAULTS,
    DEFAULT_IMAGE,
    getCatalog
};
