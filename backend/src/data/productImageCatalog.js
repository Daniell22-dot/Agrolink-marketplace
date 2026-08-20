// AgroLink Product Image Catalog
// Single source of truth for product images. When an admin/farmer creates a
// product without uploading files, the backend resolves the correct image(s)
// from this catalog based on the product name/category.
// Exposed publicly via GET /api/images/catalog and mirrored in the frontend.

const U = (id) => `https://images.unsplash.com/${id}?w=500&auto=format&fit=crop`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=500`;

// Generic fallback image (always reachable)
const DEFAULT_IMAGE = U('photo-1542838132-92c53300491e');

// Category-level fallbacks
const CATEGORY_DEFAULTS = {
    grains: [U('photo-1551754655-cd27e38d2076')],
    vegetables: [U('photo-1498837167922-ddd27525d352')],
    fruits: [U('photo-1553279768-865429fa0078')],
    dairy: [U('photo-1550583724-b2692b85b150')],
    meat: [U('photo-1544025162-d76694265947')],
    livestock: [U('photo-1628009368231-7bb7cfcb0def')],
    herbs: [U('photo-1540420773420-3366772f4999')],
    other: [DEFAULT_IMAGE]
};

const PRODUCT_IMAGES = [
    // ------------------------------ GRAINS ------------------------------
    { id: 'maize', label: 'Maize (Corn)', category: 'grains', keywords: ['maize', 'corn', 'mahindi', 'corns'], images: [U('photo-1551754655-cd27e38d2076'), P(12921034)] },
    { id: 'maize-flour', label: 'Maize Flour (Cornmeal)', category: 'grains', keywords: ['maize flour', 'cornmeal', 'corn meal', 'unga', 'ugali', 'sembe', 'posho'], images: [P(6086003)] },
    { id: 'wheat', label: 'Wheat', category: 'grains', keywords: ['wheat', 'ngano', 'wheat grain'], images: [U('photo-1574323347407-f5e1ad6d020b')] },
    { id: 'wheat-flour', label: 'Wheat Flour (All-Purpose)', category: 'grains', keywords: ['wheat flour', 'all purpose flour', 'white flour', 'baking flour', 'chapati flour', 'unga wa ngano'], images: [U('photo-1509440159596-0249088772ff')] },
    { id: 'rice', label: 'Rice', category: 'grains', keywords: ['rice', 'pishori', 'basmati', 'mchele', 'mpunga', 'brown rice'], images: [U('photo-1586201375761-83865001e31c')] },
    { id: 'rosecoco-beans', label: 'Rosecoco Beans', category: 'grains', keywords: ['rosecoco', 'red beans', 'kidney beans', 'maharage'], images: [P(13620780), U('photo-1551462147-37885acc36f1')] },
    { id: 'nyayo-beans', label: 'Nyayo / Wairimu Beans', category: 'grains', keywords: ['nyayo', 'wairimu', 'yellow beans', 'cranberry beans'], images: [P(13620780)] },
    { id: 'black-beans', label: 'Black Beans', category: 'grains', keywords: ['black beans', 'black eyed beans', 'mbegu nyeusi'], images: [U('photo-1551462147-37885acc36f1')] },
    { id: 'soya-beans', label: 'Soya Beans (Soybeans)', category: 'grains', keywords: ['soya', 'soy', 'soybean', 'soybean seed', 'soya bean', 'maharage ya soya'], images: [P(12338945)] },
    { id: 'green-grams', label: 'Green Grams (Mung Beans)', category: 'grains', keywords: ['green gram', 'green grams', 'ndengu', 'mung bean', 'mung beans'], images: [U('photo-1551462147-37885acc36f1')] },
    { id: 'pigeon-peas', label: 'Pigeon Peas', category: 'grains', keywords: ['pigeon pea', 'pigeon peas', 'mbaazi'], images: [U('photo-1551462147-37885acc36f1'), P(13620780)] },
    { id: 'cowpeas', label: 'Cowpeas (Kunde)', category: 'grains', keywords: ['cowpea', 'cowpeas', 'kunde'], images: [U('photo-1551462147-37885acc36f1')] },
    { id: 'sorghum', label: 'Sorghum', category: 'grains', keywords: ['sorghum', 'mtama', 'sorghum grain'], images: [U('photo-1574323347407-f5e1ad6d020b'), U('photo-1551754655-cd27e38d2076')] },
    { id: 'millet', label: 'Millet', category: 'grains', keywords: ['millet', 'ulezi', 'finger millet', 'wimbi'], images: [U('photo-1574323347407-f5e1ad6d020b')] },
    { id: 'groundnuts', label: 'Groundnuts (Peanuts)', category: 'grains', keywords: ['groundnut', 'groundnuts', 'peanut', 'peanuts', 'njugu', 'karanga', 'achaari'], images: [U('photo-1546587348-d12660c30c50')] },
    { id: 'sunflower-seeds', label: 'Sunflower Seeds', category: 'grains', keywords: ['sunflower seed', 'sunflower seeds', 'alizeti', 'seed'], images: [U('photo-1546587348-d12660c30c50')] },
    { id: 'coffee', label: 'Coffee (Green Beans)', category: 'grains', keywords: ['coffee', 'kahawa', 'coffee bean', 'arabica'], images: [U('photo-1559056199-641a0ac8b55e')] },
    { id: 'tea', label: 'Tea Leaves', category: 'grains', keywords: ['tea', 'chai', 'tea leaf', 'tea leaves', 'black tea'], images: [U('photo-1576092768241-dec231879fc3')] },
    { id: 'sugar', label: 'Sugar', category: 'grains', keywords: ['sugar', 'sukari', 'granulated sugar', 'cane sugar'], images: [U('photo-1581441363689-1f3c3c414635')] },
    { id: 'sugarcane', label: 'Sugarcane', category: 'grains', keywords: ['sugarcane', 'sugar cane', 'muwa', 'cane'], images: [P(2254097)] },

    // ----------------------------- VEGETABLES -----------------------------
    { id: 'tomatoes', label: 'Tomatoes', category: 'vegetables', keywords: ['tomato', 'tomatoes', 'nyanya'], images: [U('photo-1592924357228-91a4daadcfea')] },
    { id: 'onions', label: 'Onions', category: 'vegetables', keywords: ['onion', 'onions', 'vitunguu', 'red onion'], images: [U('photo-1508747703725-719777637510')] },
    { id: 'sukuma-wiki', label: 'Sukuma Wiki (Collard Greens)', category: 'vegetables', keywords: ['sukuma', 'sukuma wiki', 'collard', 'collard green', 'collard greens'], images: [U('photo-1576045057995-568f588f82fb')] },
    { id: 'kale', label: 'Kale', category: 'vegetables', keywords: ['kale', 'kales'], images: [U('photo-1576045057995-568f588f82fb')] },
    { id: 'spinach', label: 'Spinach', category: 'vegetables', keywords: ['spinach', 'mchicha', 'green leafy', 'leafy greens'], images: [U('photo-1540420773420-3366772f4999'), U('photo-1576045057995-568f588f82fb')] },
    { id: 'cabbage', label: 'Cabbage', category: 'vegetables', keywords: ['cabbage', 'kabichi'], images: [U('photo-1594282486552-05b4d80fbb9f')] },
    { id: 'carrots', label: 'Carrots', category: 'vegetables', keywords: ['carrot', 'carrots', 'karoti'], images: [U('photo-1598170845058-32b9d6a5da37')] },
    { id: 'irish-potatoes', label: 'Irish Potatoes', category: 'vegetables', keywords: ['irish potato', 'irish potatoes', 'potato', 'potatoes', 'viazi', 'shangi', 'white potato'], images: [U('photo-1518977676601-b53f82aba655')] },
    { id: 'sweet-potatoes', label: 'Sweet Potatoes', category: 'vegetables', keywords: ['sweet potato', 'sweet potatoes', 'viazi vitamin', 'viazi vitamu', 'kiazi', 'orange sweet potato'], images: [P(7999009)] },
    { id: 'cassava', label: 'Cassava (Muhogo)', category: 'vegetables', keywords: ['cassava', 'muhogo', 'manioc', 'yucca'], images: [P(7543161)] },
    { id: 'yams', label: 'Yams', category: 'vegetables', keywords: ['yam', 'yams', 'tubers', 'true yam'], images: [U('photo-1590165482129-1b8b27698780')] },
    { id: 'green-beans', label: 'Green Beans (French Beans)', category: 'vegetables', keywords: ['green bean', 'green beans', 'french bean', 'french beans', 'snap bean'], images: [U('photo-1551462147-37885acc36f1')] },
    { id: 'bell-peppers', label: 'Bell Peppers (Pilipili Hoho)', category: 'vegetables', keywords: ['bell pepper', 'bell peppers', 'capsicum', 'hoho', 'sweet pepper', 'pilipili hoho'], images: [U('photo-1597362925123-77861d3fbac7')] },
    { id: 'chilli', label: 'Chillies (Pilipili)', category: 'vegetables', keywords: ['chilli', 'chillies', 'chili', 'hot pepper', 'pilipili', 'bird eye chilli'], images: [U('photo-1597362925123-77861d3fbac7')] },
    { id: 'garlic', label: 'Garlic', category: 'vegetables', keywords: ['garlic', 'kitunguu saumu'], images: [U('photo-1508747703725-719777637510')] },
    { id: 'ginger', label: 'Ginger', category: 'vegetables', keywords: ['ginger', 'tangawizi'], images: [U('photo-1540420773420-3366772f4999'), P(7543161)] },
    { id: 'eggplant', label: 'Eggplant (Biringanya)', category: 'vegetables', keywords: ['eggplant', 'biringanya', 'aubergine'], images: [U('photo-1553279768-865429fa0078')] },
    { id: 'cucumber', label: 'Cucumber', category: 'vegetables', keywords: ['cucumber', 'tango', 'cucumbers'], images: [U('photo-1498837167922-ddd27525d352')] },
    { id: 'pumpkin', label: 'Pumpkin', category: 'vegetables', keywords: ['pumpkin', 'malenge', 'butternut', 'butternut squash'], images: [U('photo-1498837167922-ddd27525d352')] },
    { id: 'mushrooms', label: 'Mushrooms', category: 'vegetables', keywords: ['mushroom', 'mushrooms', 'uyoga'], images: [U('photo-1508747703725-719777637510')] },

    // ------------------------------- FRUITS -------------------------------
    { id: 'banana', label: 'Bananas', category: 'fruits', keywords: ['banana', 'bananas', 'ndizi'], images: [U('photo-1571771894821-ce9b6c11b08e')] },
    { id: 'avocado', label: 'Avocados', category: 'fruits', keywords: ['avocado', 'avocados', 'parachichi', 'avocado pear'], images: [U('photo-1523049673857-eb18f1d7b578')] },
    { id: 'mango', label: 'Mangoes', category: 'fruits', keywords: ['mango', 'mangoes', 'embe'], images: [U('photo-1553279768-865429fa0078')] },
    { id: 'papaya', label: 'Papaya (Pawpaw)', category: 'fruits', keywords: ['papaya', 'pawpaw', 'mbibo'], images: [U('photo-1553279768-865429fa0078')] },
    { id: 'pineapple', label: 'Pineapples', category: 'fruits', keywords: ['pineapple', 'pineapples', 'nanasi'], images: [U('photo-1550258987-190a2d41a8ba')] },
    { id: 'orange', label: 'Oranges', category: 'fruits', keywords: ['orange', 'oranges', 'machungwa'], images: [U('photo-1547514701-42782101795e')] },
    { id: 'lemon', label: 'Lemons', category: 'fruits', keywords: ['lemon', 'lemons', 'ndimu'], images: [U('photo-1590502593747-42a996133562')] },
    { id: 'lime', label: 'Limes', category: 'fruits', keywords: ['lime', 'limes'], images: [U('photo-1590502593747-42a996133562')] },
    { id: 'apple', label: 'Apples', category: 'fruits', keywords: ['apple', 'apples', 'tufaha'], images: [U('photo-1560806887-1e4cd0b6cbd6')] },
    { id: 'watermelon', label: 'Watermelon', category: 'fruits', keywords: ['watermelon', 'tikitimaji', 'tikitini', 'matikiti'], images: [U('photo-1587049352846-4a222e784d38')] },
    { id: 'passion-fruit', label: 'Passion Fruit', category: 'fruits', keywords: ['passion fruit', 'kakungu', 'karakara'], images: [U('photo-1553279768-865429fa0078')] },
    { id: 'grapes', label: 'Grapes', category: 'fruits', keywords: ['grape', 'grapes', 'zabibu'], images: [U('photo-1537640538966-79f369143f8f')] },
    { id: 'strawberry', label: 'Strawberries', category: 'fruits', keywords: ['strawberry', 'strawberries', 'stroberi'], images: [U('photo-1464965911861-746a04b4bca6')] },
    { id: 'peach', label: 'Peaches', category: 'fruits', keywords: ['peach', 'peaches'], images: [U('photo-1560806887-1e4cd0b6cbd6')] },
    { id: 'plum', label: 'Plums', category: 'fruits', keywords: ['plum', 'plums'], images: [U('photo-1560806887-1e4cd0b6cbd6')] },
    { id: 'coconut', label: 'Coconuts', category: 'fruits', keywords: ['coconut', 'coconuts', 'nazi'], images: [U('photo-1587049352846-4a222e784d38')] },
    { id: 'guava', label: 'Guava', category: 'fruits', keywords: ['guava', 'mapera'], images: [U('photo-1553279768-865429fa0078')] },
    { id: 'avocado-oil', label: 'Avocado Oil', category: 'fruits', keywords: ['avocado oil', 'oil'], images: [U('photo-1523049673857-eb18f1d7b578')] },

    // ------------------------------ MEAT & FISH ------------------------------
    { id: 'dairy-cow', label: 'Dairy Cow / Cattle', category: 'livestock', keywords: ['cow', 'cattle', 'friesian', 'holstein', 'dairy cow', 'heifer', 'ngombe', 'bull'], images: [P(422202), P(248337)] },
    { id: 'goat', label: 'Goat (Live)', category: 'livestock', keywords: ['goat', 'live goat', 'galla', 'mbuzi'], images: [U('photo-1524024973431-2ad916746881')] },
    { id: 'sheep', label: 'Sheep / Ram', category: 'livestock', keywords: ['sheep', 'ram', 'dorper', 'ewe', 'kondoo', 'lamb stock'], images: [P(25851592)] },
    { id: 'chicks', label: 'Chicks / Kienyeji', category: 'livestock', keywords: ['chick', 'chicks', 'kienyeji', 'rooster', 'cock', 'day old', 'day-old', 'hatchery', 'kuku'], images: [U('photo-1548550023-2bdb3c5beed7')] },
    { id: 'beef', label: 'Beef', category: 'meat', keywords: ['beef', 'steak', 'ngombe nyama', 'nyama ngombe', 'beef meat', 'red meat'], images: [U('photo-1544025162-d76694265947'), U('photo-1603048588665-791ca8aea617'), P(20187068)] },
    { id: 'goat-meat', label: 'Goat Meat', category: 'meat', keywords: ['goat', 'goat meat', 'mbuzi', 'nyama mbuzi'], images: [U('photo-1603048588665-791ca8aea617'), P(20187068)] },
    { id: 'mutton', label: 'Mutton / Lamb', category: 'meat', keywords: ['mutton', 'lamb', 'kondoo', 'ram'], images: [U('photo-1603048588665-791ca8aea617')] },
    { id: 'pork', label: 'Pork', category: 'meat', keywords: ['pork', 'nguruwe', 'pork meat'], images: [U('photo-1607623814075-e51df1bdc82f'), U('photo-1603048588665-791ca8aea617')] },
    { id: 'chicken', label: 'Chicken (Broiler)', category: 'meat', keywords: ['chicken', 'broiler', 'kuku', 'kuku nyama', 'chicken meat', 'poultry'], images: [P(24182617), U('photo-1604503468506-a8da13d82791')] },
    { id: 'whole-chicken', label: 'Whole Chicken', category: 'meat', keywords: ['whole chicken', 'free range chicken', 'kienyeji', 'kuku kienyeji', 'live chicken'], images: [P(106343), P(24182617)] },
    { id: 'turkey', label: 'Turkey', category: 'meat', keywords: ['turkey', 'turkey meat'], images: [P(106343)] },
    { id: 'eggs', label: 'Eggs', category: 'meat', keywords: ['egg', 'eggs', 'mayai', 'tray of eggs'], images: [P(6827029), U('photo-1582722872445-44dc5f7e3c8f')] },
    { id: 'tilapia', label: 'Tilapia', category: 'meat', keywords: ['tilapia', 'fish', 'samaki', 'catfish', 'whole fish', 'fresh fish', 'fish fillet'], images: [P(229789), P(6149077)] },
    { id: 'omena', label: 'Omena (Sardines / Dagaa)', category: 'meat', keywords: ['omena', 'sardine', 'sardines', 'dagaa', 'omena fish'], images: [U('photo-1519708227418-c8fd9a32b7a2'), P(229789)] },
    { id: 'honey', label: 'Honey', category: 'meat', keywords: ['honey', 'asali', 'raw honey'], images: [U('photo-1587049352851-8d4e89133924')] },

    // ------------------------------- DAIRY -------------------------------
    { id: 'milk', label: 'Fresh Milk', category: 'dairy', keywords: ['milk', 'maziwa', 'raw milk', 'fresh milk'], images: [U('photo-1550583724-b2692b85b150')] },
    { id: 'cheese', label: 'Cheese', category: 'dairy', keywords: ['cheese', 'jibini'], images: [U('photo-1486297678162-eb2a19b0a32d')] },
    { id: 'butter', label: 'Butter', category: 'dairy', keywords: ['butter', 'siagi', 'ghee'], images: [U('photo-1563636619-e9143da7973b')] },
    { id: 'yogurt', label: 'Yogurt', category: 'dairy', keywords: ['yogurt', 'yoghurt', 'maziwa lala', 'fermented milk'], images: [U('photo-1550583724-b2692b85b150')] },

    // ---------------------------- HERBS & SPICES ----------------------------
    { id: 'coriander', label: 'Coriander (Dhania)', category: 'herbs', keywords: ['coriander', 'cilantro', 'dhania', 'coriander leaves'], images: [U('photo-1540420773420-3366772f4999')] },
    { id: 'turmeric', label: 'Turmeric', category: 'herbs', keywords: ['turmeric', 'manjano'], images: [U('photo-1540420773420-3366772f4999')] },
    { id: 'black-pepper', label: 'Black Pepper', category: 'herbs', keywords: ['black pepper', 'pepper', 'pilipili manga'], images: [U('photo-1559056199-641a0ac8b55e')] },

    // ------------------------------- SERVICES -------------------------------
    { id: 'veterinary', label: 'Veterinary Services', category: 'other', keywords: ['vet', 'veterinary', 'vaccination', 'livestock advisory', 'dairy', 'poultry advisory'], images: [U('photo-1628009368231-7bb7cfcb0def')] },
    { id: 'hay', label: 'Hay / Fodder', category: 'other', keywords: ['hay', 'fodder', 'nyasi', 'silage', 'animal feed'], images: [U('photo-1628009368231-7bb7cfcb0def')] }
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
