export interface DishItem {
  id: string;
  name: string;
  regionalName: string;
  category: 'tiffin' | 'meals' | 'beverage' | 'dessert';
  price: number;
  description: string;
  tag: string;
  spiceLevel: 'Mild' | 'Medium' | 'Zesty';
  accentColor: string;
  ingredients: string[];
  image: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  tagline: string;
  comment: string;
  rating: number;
  date: string;
}

export interface AmbienceSlot {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  temperature: string;
  lightingDescription: string;
  bgGradient: string;
}

export const RESTAURANT_DATA = {
  name: "THEERTHAM",
  tagline: "Pure Vegetarian South Indian Tiffin & Meals",
  city: "Nashik, Maharashtra",
  address: "Plot 14, Gangapur Road, Near Navshya Ganapati Chowk, Anandvalli, Nashik, Maharashtra 422013",
  googleMapsUrl: "https://maps.google.com/?q=Gangapur+Road+Nashik",
  phone: "+91 98230 45678",
  whatsappNumber: "919823045678",
  whatsappMessage: "Hello Theertham, I would like to reserve a table for authentic South Indian dining.",
  email: "vanakkam@theerthamnashik.com",
  
  hours: {
    breakfast: {
      label: "Morning Tiffin",
      timing: "7:00 AM – 11:30 AM",
      highlight: "Freshly steamed idlis, crisp dosas & steaming degree filter coffee"
    },
    lunch: {
      label: "Traditional Sadya Meals",
      timing: "12:00 PM – 3:45 PM",
      highlight: "Unlimited 24-item royal Kerala banana-leaf feasts"
    },
    dinner: {
      label: "Evening Tiffin & Dinner",
      timing: "6:30 PM – 10:45 PM",
      highlight: "Appams with coconut stew, parottas, ghee roast & payasam"
    }
  },

  features: [
    { title: "Serene Ambience", desc: "Temple wood-carved pillars, oil brass lamps & lush foliage" },
    { title: "Warm Service", desc: "Traditional Kerala hospitality rooted in Athithi Devo Bhava" },
    { title: "100% Pure Vegetarian", desc: "Stone-ground batters, organic ghee & cold-pressed oils" }
  ],

  story: {
    title: "Bringing Malabar & Kaveri Heritage to the Godavari",
    lead: "Theertham was conceived as a sanctuary of sacred flavors in Nashik.",
    paragraphs: [
      "Centuries of South Indian culinary discipline center on reverence: food prepared with mindfulness, offered on freshly harvest-cut banana leaves, and shared in calm pavilions bathed in brass lamp light.",
      "At Theertham, we carry forward the heirloom recipes of Udupi and Travancore. Our idli and dosa batters are stone-ground daily and naturally fermented for fourteen hours. Our sambar is brewed with freshly roasted whole coriander, dry red chillies from Byadgi, and aromatic shallots simmered in unpolished tamarind broth.",
      "Every drop of ghee is churned from native A2 milk, and our filter coffee is brewed from select Chikmagalur shade-grown peaberry beans. Welcome to our table."
    ]
  },

  dishes: [
    {
      id: "ghee-roast-dosa",
      name: "Ghee Roast Dosa",
      regionalName: "നെയ്യ് റോസ്റ്റ് ദോശ",
      category: "tiffin",
      price: 180,
      description: "Ultra-crispy paper-thin golden conical crepe roasted in aromatic native A2 ghee, glistening with pure butter, served with fresh coconut & tomato chutneys and hot sambar.",
      tag: "House Specialty",
      spiceLevel: "Medium",
      accentColor: "#C8963E",
      ingredients: ["Fermented rice & urad dal", "A2 pure cow ghee", "Fresh coconut chutney", "Byadgi sambar"],
      image: "/dishes/ghee_roast_dosa.webp"
    },
    {
      id: "masala-dosa",
      name: "Davangere Masala Dosa",
      regionalName: "ಮಸಾಲೆ ದೋಸೆ",
      category: "tiffin",
      price: 160,
      description: "Crisp red-chilli spiced lace edge crust with tempered turmeric potato mash, mustard crackle, fresh curry leaves, and a dollop of white butter.",
      tag: "All-Time Favorite",
      spiceLevel: "Medium",
      accentColor: "#E8A33D",
      ingredients: ["Slow-fermented rice crepe", "Spiced crushed potato", "White homemade butter", "Gunpowder podi"],
      image: "/dishes/masala_dosa.webp"
    },
    {
      id: "idli-sambar",
      name: "Kanchipuram Button Idli Sambar",
      regionalName: "இட்லி சாம்பார்",
      category: "tiffin",
      price: 130,
      description: "Velvety feather-soft steamed rice cakes submerged in a steaming bowl of fragrant lentil sambar, tempered with mustard crackle and fresh curry leaves.",
      tag: "Pure Comfort",
      spiceLevel: "Mild",
      accentColor: "#3E7B3A",
      ingredients: ["Steamed idli rice", "Toor dal & drumsticks", "Shallots (madras onions)", "Cold-pressed sesame oil"],
      image: "/dishes/idli_sambar.webp"
    },
    {
      id: "medu-vada",
      name: "Urad Dal Medu Vada",
      regionalName: "ഉഴുന്ന് വട",
      category: "tiffin",
      price: 140,
      description: "Crunchy golden crust giving way to an airy cloud-like interior, infused with cracked tellicherry black pepper, fresh ginger, and green chillies.",
      tag: "Freshly Churned",
      spiceLevel: "Medium",
      accentColor: "#C8963E",
      ingredients: ["Fluffy urad dal", "Crushed tellicherry pepper", "Finely chopped ginger", "Fresh curry leaves"],
      image: "/dishes/medu_vada.webp"
    },
    {
      id: "uttapam",
      name: "Onion Tomato Podi Uttapam",
      regionalName: "ஊத்தப்பம்",
      category: "tiffin",
      price: 170,
      description: "Thick golden griddled fermented pancake with crunchy caramelised shallot edges, ripe country tomatoes, fresh green chillies, and spicy podi.",
      tag: "Rustic Tiffin",
      spiceLevel: "Zesty",
      accentColor: "#B3261E",
      ingredients: ["Porous rice batter", "Finely diced shallots", "Country tomatoes", "Spicy idli podi"],
      image: "/dishes/uttapam.webp"
    },
    {
      id: "appam-stew",
      name: "Appam with Vegetable Stew",
      regionalName: "അപ്പവും പച്ചക്കറി സ്റ്റൂവും",
      category: "tiffin",
      price: 210,
      description: "Bowl-shaped fermented rice hoppers with crispy lacy golden edges and pillow-soft sponge center, paired with mild cardamom coconut milk vegetable stew.",
      tag: "Kerala Classic",
      spiceLevel: "Mild",
      accentColor: "#7A7F45",
      ingredients: ["Toddy-fermented rice hopper", "First-press coconut milk", "Carrots & beans", "Whole green cardamom"],
      image: "/dishes/appam_stew.webp"
    },
    {
      id: "kerala-sadya",
      name: "Royal Theertham Sadya Meal",
      regionalName: "തിരുവോണ സദ്യ",
      category: "meals",
      price: 360,
      description: "24-item ceremonial feast served on a pristine banana leaf: Steaming Matta rice, Parippu ghee, Sambar, Avial, Thoran, Olan, crispy pappadam, and chips.",
      tag: "Banana Leaf Feast",
      spiceLevel: "Medium",
      accentColor: "#3E7B3A",
      ingredients: ["Matta Kerala rice", "Avial with coconut curd", "Pumpkin olan in coconut milk", "Nendran banana chips"],
      image: "/dishes/kerala_sadya.webp"
    },
    {
      id: "filter-coffee",
      name: "Degree Kumbakonam Filter Coffee",
      regionalName: "பில்டர் காபி",
      category: "beverage",
      price: 70,
      description: "Brewed in a traditional brass drip filter from 80:20 roasted peaberry chicory beans, frothy with farm-fresh full-cream boiled milk in brass davarah.",
      tag: "Signature Decoction",
      spiceLevel: "Mild",
      accentColor: "#4F5A2A",
      ingredients: ["Chikmagalur peaberry beans", "Roasted chicory", "Full cream buffalo milk", "Raw cane sugar"],
      image: "/dishes/filter_coffee.webp"
    },
    {
      id: "payasam",
      name: "Palada Pradhaman & Ada Payasam",
      regionalName: "പാലട പ്രഥമൻ",
      category: "dessert",
      price: 150,
      description: "Royal Travancore dessert of slow-simmered rice flakes reduced for hours in rich milk and sugar until blushing a natural pale pink, garnished with golden cashews.",
      tag: "Divine Sweet",
      spiceLevel: "Mild",
      accentColor: "#DFAC55",
      ingredients: ["Handmade rice ada flakes", "Slow-condensed milk", "Ghee-roasted cashew nuts", "Kishmish & green cardamom"],
      image: "/dishes/payasam.webp"
    }
  ] as DishItem[],

  ambiencePhases: [
    {
      time: "07:00 AM – 11:30 AM",
      title: "Dawn & Morning Mist",
      subtitle: "The Tiffin Hour",
      description: "Soft sunbeams pierce the canopy of coconut palms. The gentle ring of temple bells mingles with the sizzle of crisp ghee dosas on hot cast-iron tavas.",
      temperature: "22°C Gentle Breeze",
      lightingDescription: "Golden morning sunbeams filtering through temple wood arches",
      bgGradient: "from-[#F7F3E3] via-[#E8E0C5] to-[#D5C9A7]"
    },
    {
      time: "12:00 PM – 03:45 PM",
      title: "Noon in the Coconut Grove",
      subtitle: "The Royal Sadya",
      description: "Lush banana leaves unfold on dark teak dining tables. A symphony of textures as warm Matta rice is crowned with yellow parippu dal and fragrant golden ghee.",
      temperature: "29°C Shaded Courtyard",
      lightingDescription: "Bright dappled daylight through tropical fronds",
      bgGradient: "from-[#ECE6D2] via-[#DFD6BC] to-[#C9BD98]"
    },
    {
      time: "06:30 PM – 10:45 PM",
      title: "Twilight & Brass Lamps",
      subtitle: "The Lamp-Lit Sanctum",
      description: "As twilight blankets Nashik, our stone pillars illuminate with deepam flames. Brass Nilavilakku lamps cast warm flickering amber reflections across the pavilion.",
      temperature: "24°C Candlelit Evening",
      lightingDescription: "Warm 2200K amber oil flame glow and brass reflections",
      bgGradient: "from-[#2A3316] via-[#1A230D] to-[#0D1406]"
    }
  ] as AmbienceSlot[],

  reviews: [
    {
      id: "rev-1",
      author: "Aditya Nambiar",
      location: "Resident, Nashik & Palakkad",
      tagline: "The closest taste to home in all of Maharashtra",
      comment: "Having grown up in Palakkad, finding an authentic Sadya in Nashik seemed impossible until Theertham opened. The Avial has the exact crunch, raw coconut oil aroma, and balance of sour curd. Eating off the banana leaf in this wooden pavilion took me straight back to my ancestral home.",
      rating: 5,
      date: "October 2026"
    },
    {
      id: "rev-2",
      author: "Radhika Kulkarni",
      location: "Food Writer, Nashik Today",
      tagline: "Unmatched ghee roast dosa and sublime filter coffee",
      comment: "The ghee roast dosa is so thin and crisp it literally shatters at the first touch. You can taste the genuine A2 butter and stone-ground batter fermented with zero chemical shortcuts. And that degree coffee served in a brass davarah is simply unmissable.",
      rating: 5,
      date: "September 2026"
    },
    {
      id: "rev-3",
      author: "Siddharth Deshmukh",
      location: "Gangapur Road, Nashik",
      tagline: "A peaceful culinary oasis",
      comment: "The ambience is unlike any restaurant in Nashik. Stepping past the brass lamps and heavy wooden pillars feels calm, spiritual, and grounding. Staff are exceptionally attentive and courteous. Our Sunday family breakfast spot forever.",
      rating: 5,
      date: "October 2026"
    },
    {
      id: "rev-4",
      author: "Meenakshi Sundaram",
      location: "Visiting from Bengaluru",
      tagline: "Remarkable Appam & Vegetable Stew",
      comment: "The coconut milk stew has whole green cardamoms and tender country vegetables simmered to perfection without heaviness. Paired with steaming, lacy appams, it was pure comfort. 100% pure vegetarian dining at its highest level.",
      rating: 5,
      date: "August 2026"
    }
  ] as ReviewItem[]
};
