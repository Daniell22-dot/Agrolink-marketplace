// AgroLink Frontend Product Image Catalog
// Mirror of backend/src/data/productImageCatalog.js. Images are hardcoded full
// URLs so they always render, even when the API is unavailable or slow.
// The backend remains the single source of truth (GET /api/images/catalog).

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop";

const CATEGORY_DEFAULTS = {
  "grains": [
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop"
  ],
  "vegetables": [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop"
  ],
  "fruits": [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
  ],
  "dairy": [
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop"
  ],
  "meat": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop"
  ],
  "livestock": [
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&auto=format&fit=crop"
  ],
  "herbs": [
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop"
  ],
  "other": [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop"
  ]
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
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/12921034/pexels-photo-12921034.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.pexels.com/photos/6086003/pexels-photo-6086003.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/12338945/pexels-photo-12338945.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1546587348-d12660c30c50?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1546587348-d12660c30c50?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/2254097/pexels-photo-2254097.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/7999009/pexels-photo-7999009.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.pexels.com/photos/7543161/pexels-photo-7543161.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/7543161/pexels-photo-7543161.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1590502593747-42a996133562?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1590502593747-42a996133562?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/422202/pexels-photo-422202.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.pexels.com/photos/248337/pexels-photo-248337.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/25851592/pexels-photo-25851592.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/20187068/pexels-photo-20187068.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/20187068/pexels-photo-20187068.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop"
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
      "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.pexels.com/photos/24182617/pexels-photo-24182617.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.pexels.com/photos/6827029/pexels-photo-6827029.jpeg?auto=compress&cs=tinysrgb&w=500",
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/229789/pexels-photo-229789.jpeg?auto=compress&cs=tinysrgb&w=500"
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
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&auto=format&fit=crop"
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
