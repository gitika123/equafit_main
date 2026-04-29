/** Broad cuisine tags — flavors students recognize; many dishes are “inspired by” home cooking on a budget. */
export type DietFuelCuisine =
  | "Indian"
  | "Chinese"
  | "Thai"
  | "Mediterranean"
  | "Mexican"
  | "Global / dorm";

export interface DietFuelRecipe {
  name: string;
  cuisine: DietFuelCuisine;
  /** Prep + cook, realistic for one pan / microwave / kettle */
  minutes: number;
  /** Honest serving note */
  feeds: string;
  /** Stuff dorms and shared kitchens usually have (or one quick store run) */
  pantryStaples: string[];
  steps: string[];
  /** One line on why it’s worth making */
  whyItWorks?: string;
}

export interface DietFuelWeek {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  budgetNote: string;
  tips: string[];
  shoppingIdeas: string[];
  /** Easy wins that week — mixed cultures so everyone sees something familiar */
  recipes: DietFuelRecipe[];
}

/** Rotating weekly themes (8 before the cycle repeats); “this week” follows the calendar ISO week. */
export const DIET_FUEL_WEEKS: DietFuelWeek[] = [
  {
    id: 1,
    title: "Pantry power",
    subtitle: "Build meals from shelf-stable basics",
    icon: "🫘",
    budgetNote: "Beans, rice, and oats cost cents per serving.",
    tips: [
      "Cook a big pot of beans or lentils on Sunday — freeze in portions for burritos, soups, and grain bowls.",
      "Replace one meat meal with eggs, tofu, or chickpeas; protein still counts and the receipt shrinks.",
      "Make your own seasoning mixes (cumin, paprika, garlic powder) instead of buying specialty packets.",
      "Oats work for breakfast, smoothies, and savory porridge with a fried egg on top.",
    ],
    shoppingIdeas: ["Dried beans or lentils", "Rolled oats", "Canned tomatoes", "Onions & garlic", "Eggs"],
    recipes: [
      {
        name: "5-minute masala eggs on toast",
        cuisine: "Indian",
        minutes: 10,
        feeds: "1 hungry person",
        pantryStaples: ["Eggs", "Bread or frozen paratha", "Onion", "Tomato or canned diced", "Oil", "Salt", "Chili powder or paprika", "Cumin (optional)"],
        steps: [
          "Dice a little onion; soften in a pan with oil on medium heat.",
          "Add chopped tomato (fresh or from a can), salt, pinch chili + cumin; cook 2 min until jammy.",
          "Crack in 2 eggs, scramble gently until just set — don’t dry them out.",
          "Pile on toast or tear up roti on the side.",
        ],
        whyItWorks: "Same vibe as anda bhurji / masala omelette without a long ingredient list.",
      },
      {
        name: "Chickpea lemon bowl (no tahini needed)",
        cuisine: "Mediterranean",
        minutes: 12,
        feeds: "1–2 bowls",
        pantryStaples: ["Canned chickpeas", "Lemon or bottled juice", "Olive oil or any oil", "Garlic", "Salt", "Cucumber or carrot", "Bread or crackers"],
        steps: [
          "Rinse chickpeas; mash half with a fork, leave half whole for texture.",
          "Stir in minced garlic, lemon, 1–2 tbsp oil, salt — taste bright and salty.",
          "Chop any crunchy veg you have; mix in or serve on the side.",
          "Scoop with bread, pita chips, or spoon over leftover rice.",
        ],
        whyItWorks: "Cheap hummus energy when you don’t have tahini — still feels like a mezze plate.",
      },
      {
        name: "Soy-garlic microwave rice bowl",
        cuisine: "Chinese",
        minutes: 15,
        feeds: "1 bowl",
        pantryStaples: ["Microwave rice or cooked leftover rice", "Frozen mixed veg", "Soy sauce", "Sugar or honey", "Garlic (jar ok)", "Sesame oil if you have it", "1 egg (optional)"],
        steps: [
          "Steam veg in the microwave until hot; warm rice the same way.",
          "Pan-fry or scramble an egg if you have one; skip if vegan.",
          "Toss rice + veg + egg with 1–2 tsp soy, tiny pinch sugar, garlic — high heat 2 min if you have a stove, or mix hot in a bowl.",
          "Finish with a few drops of sesame oil or chili crisp if available.",
        ],
        whyItWorks: "Hits the takeout craving using freezer + pantry stuff.",
      },
    ],
  },
  {
    id: 2,
    title: "Smart protein",
    subtitle: "Hit protein goals without premium prices",
    icon: "🍳",
    budgetNote: "Frozen fish and store-brand Greek yogurt are usually cheaper than fresh cuts daily.",
    tips: [
      "Buy chicken thighs or drumsticks instead of breast — more flavor, often half the price.",
      "Cottage cheese and skyr add protein to snacks; compare cost per gram of protein on the label.",
      "Canned tuna, sardines, or salmon make fast salads and pasta; watch for sales and stock up.",
      "Tofu and tempeh freeze okay; grab extras when they’re marked down.",
    ],
    shoppingIdeas: ["Frozen chicken pieces", "Canned fish", "Greek yogurt", "Tofu", "Peanut butter"],
    recipes: [
      {
        name: "Thai-style peanut noodles (cold or hot)",
        cuisine: "Thai",
        minutes: 15,
        feeds: "1–2",
        pantryStaples: ["Any noodles (ramen without heavy packet, spaghetti, rice noodles)", "Peanut butter", "Soy sauce", "Lime or vinegar", "Sugar", "Garlic", "Frozen veg", "Sriracha (optional)"],
        steps: [
          "Cook noodles; save a splash of starchy water.",
          "Whisk 2 tbsp PB + 1 tbsp soy + squeeze lime + 1 tsp sugar + minced garlic + hot water until pourable.",
          "Toss noodles and veg with sauce; thin with noodle water.",
          "Top with extra chili if you like heat — no coconut milk required.",
        ],
        whyItWorks: "Street-cart flavor from dining-hall staples.",
      },
      {
        name: "One-pan lemon yogurt chicken (or chickpeas)",
        cuisine: "Mediterranean",
        minutes: 25,
        feeds: "2 portions",
        pantryStaples: ["Chicken thighs OR canned chickpeas", "Greek yogurt", "Lemon", "Garlic", "Salt", "Paprika or any spice mix", "Oil"],
        steps: [
          "Coat chicken (or drained chickpeas) with yogurt, lemon, garlic, salt, paprika — 10 min rest if you have time.",
          "Roast or pan-fry chicken until cooked; for chickpeas, roast 18 min at high heat until crisp outside.",
          "Serve with bread, salad kit, or microwaved potato.",
        ],
        whyItWorks: "Yogurt tenderizes cheap cuts; chickpea version is fully plant-based.",
      },
      {
        name: "Soy-ginger tofu crumbles + rice",
        cuisine: "Chinese",
        minutes: 18,
        feeds: "2",
        pantryStaples: ["Firm tofu", "Soy sauce", "Ginger (jar or powder)", "Garlic", "Cornstarch or flour", "Sugar", "Rice", "Frozen peas"],
        steps: [
          "Crumble tofu; pat dry. Pan with oil until golden.",
          "Add garlic/ginger, splash soy, pinch sugar; toss 1 min.",
          "If you have cornstarch, sprinkle a little + splash water to gloss the sauce.",
          "Serve on rice with peas mixed in.",
        ],
        whyItWorks: "More satisfying than plain steamed tofu blocks.",
      },
    ],
  },
  {
    id: 3,
    title: "Produce that pays off",
    subtitle: "Fresh, frozen, and ugly — all count",
    icon: "🥬",
    budgetNote: "Frozen vegetables are as nutritious as fresh and waste less.",
    tips: [
      "Frozen broccoli, spinach, and mixed veg go straight into stir-fries, eggs, and rice — no spoilage guilt.",
      "Shop “ugly” or discount produce bins first; chop and freeze anything softening fast.",
      "Cabbage, carrots, and potatoes stay cheap year-round — slaws, soups, and oven fries.",
      "Herbs in pots on a windowsill beat buying $3 bunches every week.",
    ],
    shoppingIdeas: ["Frozen veg bags", "Bananas (freeze browning ones for smoothies)", "Cabbage", "Carrots", "In-season fruit"],
    recipes: [
      {
        name: "Cabbage-carrot slaw + can of beans",
        cuisine: "Mediterranean",
        minutes: 12,
        feeds: "2 sides or 1 meal",
        pantryStaples: ["Cabbage", "Carrot", "Lemon or vinegar", "Oil", "Salt", "Canned white beans or chickpeas", "Black pepper"],
        steps: [
          "Shred cabbage and carrot; toss with salt, rest 5 min, squeeze lightly.",
          "Dress with oil + acid; fold in rinsed beans.",
          "Eat as salad, in a wrap, or next to instant rice.",
        ],
        whyItWorks: "Crunch + fiber when you’re tired of sad bagged salads.",
      },
      {
        name: "Indian-style cabbage stir-fry (band gobi vibe)",
        cuisine: "Indian",
        minutes: 20,
        feeds: "2",
        pantryStaples: ["Cabbage", "Onion", "Oil", "Cumin seeds or ground cumin", "Turmeric (optional)", "Salt", "Chili flakes", "Roti or rice"],
        steps: [
          "Heat oil; sizzle cumin if you have seeds.",
          "Add onion, then shredded cabbage; cook on medium-high until edges brown.",
          "Salt + chili; squeeze lemon at the end.",
          "Scoop with roti, tortilla, or rice.",
        ],
        whyItWorks: "Uses a whole cheap cabbage across multiple meals.",
      },
      {
        name: "Thai-ish basil-less stir-fry (frozen veg + egg)",
        cuisine: "Thai",
        minutes: 12,
        feeds: "1 bowl",
        pantryStaples: ["Frozen stir-fry veg", "Egg", "Soy sauce", "Sugar", "Lime or vinegar", "Garlic", "Rice", "Sriracha"],
        steps: [
          "Hot pan: cook veg, push aside, scramble egg in the same pan.",
          "Mix everything; add soy + pinch sugar + lime.",
          "Optional: tear in any sad herbs or green onion tops.",
        ],
        whyItWorks: "Real Thai holy basil is hard to find on campus — this still gives sweet-salty-sour balance.",
      },
    ],
  },
  {
    id: 4,
    title: "Plan & stretch",
    subtitle: "Leftovers and batch prep = fewer delivery taps",
    icon: "🍱",
    budgetNote: "One planned “clean-out” meal per week saves more than skipping coffee.",
    tips: [
      "Write a 5-dinner outline before you shop — impulse buys drop when you have a list.",
      "Roast a tray of vegetables + a sheet of chicken or tofu; use them in bowls, wraps, and salads for three days.",
      "Soup from vegetable ends, bones, or a bouillon cube clears the fridge and stretches one meal into two.",
      "Pack lunch twice a week; even small habits compound for your budget and energy.",
    ],
    shoppingIdeas: ["Reusable containers", "Broth or bouillon", "Tortillas or bread on sale", "Cheese block (grate yourself)", "Whatever is on sale for batch cooking"],
    recipes: [
      {
        name: "Mexican-style rice & bean burritos (freezer OK)",
        cuisine: "Mexican",
        minutes: 25,
        feeds: "3–4 wraps",
        pantryStaples: ["Canned beans", "Rice", "Canned tomatoes or salsa", "Cheese if affordable", "Tortillas", "Cumin", "Garlic powder", "Hot sauce"],
        steps: [
          "Cook rice; warm beans with tomatoes/salsa + cumin + garlic.",
          "Mash some beans to hold the filling together.",
          "Roll in tortillas with cheese; toast in a pan or microwave melt.",
          "Wrap extras in foil and freeze for grab-and-go.",
        ],
        whyItWorks: "Batch once, eat between classes without app fees.",
      },
      {
        name: "Mediterranean fridge-clean pasta",
        cuisine: "Mediterranean",
        minutes: 20,
        feeds: "2",
        pantryStaples: ["Pasta", "Any sad veg", "Canned tomatoes", "Olive oil or oil", "Garlic", "Canned tuna or chickpeas", "Salt", "Chili flakes"],
        steps: [
          "Boil pasta; sauté chopped veg in oil.",
          "Add tomatoes + protein; simmer while pasta finishes.",
          "Toss together; finish with lemon if you have it.",
        ],
        whyItWorks: "Same idea as aglio e olio meets pantry puttanesca — flexible.",
      },
      {
        name: "Chinese tomato-egg over leftover rice",
        cuisine: "Chinese",
        minutes: 12,
        feeds: "1",
        pantryStaples: ["Eggs", "Tomato (fresh or canned)", "Sugar", "Salt", "Sesame oil optional", "Rice", "Soy splash"],
        steps: [
          "Soft-scramble eggs halfway, set aside.",
          "Cook tomatoes until saucy; salt + pinch sugar (classic balance).",
          "Fold eggs back in briefly; serve on hot rice.",
        ],
        whyItWorks: "Famous dorm-friendly comfort food — fast and cheap.",
      },
    ],
  },
  {
    id: 5,
    title: "Breakfast & snacks",
    subtitle: "Cheap fuel between classes",
    icon: "🌾",
    budgetNote: "Store-brand cereal and bulk nuts beat coffee-shop pastries on cost per calorie.",
    tips: [
      "Overnight oats with milk or yogurt + frozen berries cost less than daily grab-and-go options.",
      "Hard-boil a half-dozen eggs on Sunday; pair with fruit or toast for portable protein.",
      "Popcorn kernels in a pot beat chip bags — whole grain, pennies per bowl.",
      "Dilute juice with water or sparkling water; you still get flavor, fewer empty calories per dollar.",
    ],
    shoppingIdeas: ["Rolled oats", "Bananas", "Peanuts or sunflower seeds", "Popcorn kernels", "Store-brand milk"],
    recipes: [
      {
        name: "Overnight oats (dorm fridge)",
        cuisine: "Global / dorm",
        minutes: 5,
        feeds: "1 jar",
        pantryStaples: ["Rolled oats", "Milk or yogurt or plant milk", "Banana or frozen berries", "Peanut butter", "Honey or sugar", "Pinch salt"],
        steps: [
          "Jar: ½ cup oats, ½–⅔ cup liquid, sweetener, PB, fruit.",
          "Shake; fridge overnight (or 2 hours minimum).",
          "Top with anything crunchy you have.",
        ],
        whyItWorks: "No stove — survives a busy morning.",
      },
      {
        name: "Indian savory masala oats (microwave)",
        cuisine: "Indian",
        minutes: 8,
        feeds: "1 bowl",
        pantryStaples: ["Quick oats", "Water or broth", "Frozen peas", "Cumin", "Turmeric pinch", "Salt", "Butter or oil", "Optional: egg on top"],
        steps: [
          "Microwave oats + water 2 min; stir.",
          "Stir in peas, spices, fat; microwave 1 more min.",
          "Top with soft-boiled or fried egg if available.",
        ],
        whyItWorks: "Warmer than sweet oats when it’s cold out.",
      },
      {
        name: "Greek yogurt parfait to-go",
        cuisine: "Mediterranean",
        minutes: 5,
        feeds: "1",
        pantryStaples: ["Greek yogurt", "Honey or jam", "Granola or crushed cereal", "Fruit", "Cinnamon"],
        steps: [
          "Layer yogurt + fruit + sweetener + crunch in a container.",
          "Cinnamon on top feels fancy for zero effort.",
        ],
        whyItWorks: "Protein that feels like dessert — swap jam if honey is pricey.",
      },
    ],
  },
  {
    id: 6,
    title: "One-pot & global staples",
    subtitle: "Noodles, rice, and spice without the restaurant bill",
    icon: "🍜",
    budgetNote: "Dried pasta and rice noodles last months; sauces from soy, garlic, and chili cost almost nothing.",
    tips: [
      "Fried rice clears leftover veg and protein — day-old rice works best and tastes better.",
      "Lentil dal or chickpea stew over rice feeds a crowd from one bag of legumes.",
      "Miso paste + noodles + frozen veg = fast soup; a little paste goes a long way.",
      "Skip bottled sauces when you can: tomato paste, vinegar, and spices build flavor cheaply.",
    ],
    shoppingIdeas: ["Rice or noodles", "Miso", "Soy sauce", "Lentils", "Tomato paste"],
    recipes: [
      {
        name: "Red lentil dal (stove or one pot)",
        cuisine: "Indian",
        minutes: 30,
        feeds: "3–4 with rice",
        pantryStaples: ["Red lentils", "Onion", "Tomato paste or canned", "Cumin", "Turmeric", "Salt", "Oil", "Rice", "Lemon"],
        steps: [
          "Rinse lentils. Sauté onion in oil; add spices 30 sec.",
          "Add lentils + water (about 3:1 water to lentils) + tomato paste; simmer 15–20 min until mushy lovely.",
          "Salt; lemon at end. Rice on the side or mixed in.",
        ],
        whyItWorks: "Red lentils cook fast — no overnight soak.",
      },
      {
        name: "Miso hot noodle soup",
        cuisine: "Chinese",
        minutes: 12,
        feeds: "1",
        pantryStaples: ["Instant noodles (use half seasoning)", "Miso paste", "Frozen spinach", "Soy splash", "Sesame seeds optional", "Green onion if any"],
        steps: [
          "Boil water; whisk miso in a cup with a little hot water first so it doesn’t clump.",
          "Cook noodles with veg; off heat, stir in miso slurry.",
          "Light soy if you want more umami.",
        ],
        whyItWorks: "Better than plain salt broth — still dorm-fast.",
      },
      {
        name: "Thai-ish coconut-free tom yum noodles",
        cuisine: "Thai",
        minutes: 15,
        feeds: "1–2",
        pantryStaples: ["Rice noodles or ramen", "Lime", "Fish sauce or extra soy", "Sugar", "Chili", "Garlic", "Mushrooms or any veg", "Optional canned shrimp"],
        steps: [
          "Boil noodles separately.",
          "Simmer water + sliced veg + garlic + chili + fish sauce + sugar + lime.",
          "Combine; adjust sour/salty/sweet like taste-testing street soup.",
        ],
        whyItWorks: "No coconut milk — still sour-spicy-savory.",
      },
    ],
  },
  {
    id: 7,
    title: "Fiber & steady energy",
    subtitle: "Stay full without pricey “superfoods”",
    icon: "🥣",
    budgetNote: "Oats, beans, and apples are budget fiber; you don’t need imported powders.",
    tips: [
      "Add beans to tacos, pasta, or salad even in small amounts — fiber + protein in one move.",
      "Choose whole fruit over juice when prices are similar; chewing slows you down and helps fullness.",
      "If energy dips, pair carbs with protein or fat (apple + peanut butter, toast + egg) instead of doubling sugar.",
      "Water before meals is free hydration; carry a bottle so you’re not buying drinks on impulse.",
    ],
    shoppingIdeas: ["Apples", "Carrots", "Whole-grain bread on sale", "Chickpeas", "Refillable water bottle"],
    recipes: [
      {
        name: "Apple + PB “dorm charcuterie”",
        cuisine: "Global / dorm",
        minutes: 3,
        feeds: "1 snack",
        pantryStaples: ["Apple", "Peanut butter", "Crackers or bread", "Cinnamon"],
        steps: [
          "Slice apple; dip in PB.",
          "If you have crackers, alternate bites — fiber + fat keeps you awake through lecture.",
        ],
        whyItWorks: "Stabilizes blood sugar better than a solo pastry.",
      },
      {
        name: "Mediterranean bean & tuna salad cup",
        cuisine: "Mediterranean",
        minutes: 10,
        feeds: "2 cups",
        pantryStaples: ["Canned chickpeas", "Canned tuna", "Lemon or vinegar", "Oil", "Salt", "Diced cucumber or carrot", "Black pepper"],
        steps: [
          "Drain and rinse beans; flake tuna.",
          "Dress with acid + oil + salt; fold veg.",
          "Eat with fork or in a pita pocket.",
        ],
        whyItWorks: "High protein + fiber; skip tuna for chickpea-only.",
      },
      {
        name: "Mexican black bean & corn bowl",
        cuisine: "Mexican",
        minutes: 12,
        feeds: "2",
        pantryStaples: ["Canned black beans", "Canned corn or frozen", "Cumin", "Salsa", "Rice", "Cheese or avocado if on sale"],
        steps: [
          "Warm beans + corn + cumin.",
          "Layer on rice with salsa; cheese on top if you have it.",
        ],
        whyItWorks: "Chipotle-line vibes from cans.",
      },
    ],
  },
  {
    id: 8,
    title: "Crunch-time cooking",
    subtitle: "When you only have 15 minutes",
    icon: "⏱️",
    budgetNote: "Convenience fees add up; a few “emergency” meals at home beat delivery streaks.",
    tips: [
      "Keep frozen veg + eggs + hot sauce — scramble or fried rice in one pan under 15 minutes.",
      "Canned beans rinsed + microwave rice + salsa = burrito bowl; add cheese if you have it.",
      "Toast + refried beans + shredded veg is faster than waiting for a driver.",
      "When you do order in, make it intentional (social, treat) not autopilot — budget stays kinder.",
    ],
    shoppingIdeas: ["Microwave rice pouches (on sale)", "Canned beans", "Salsa", "Frozen stir-fry mix", "Eggs"],
    recipes: [
      {
        name: "Microwave burrito bowl",
        cuisine: "Mexican",
        minutes: 8,
        feeds: "1",
        pantryStaples: ["Microwave rice", "Canned beans", "Salsa", "Cheese", "Hot sauce", "Optional: microwave veg"],
        steps: [
          "Heat rice and beans; mix with salsa.",
          "Cheese on top; microwave 30 sec to melt.",
          "Hot sauce victory lap.",
        ],
        whyItWorks: "Literally faster than scrolling delivery apps.",
      },
      {
        name: "15-minute egg fried rice",
        cuisine: "Chinese",
        minutes: 15,
        feeds: "1–2",
        pantryStaples: ["Cold cooked rice", "Eggs", "Frozen peas/carrots", "Soy sauce", "Oil", "Green onion optional"],
        steps: [
          "Scramble eggs; set aside.",
          "Hot oil + rice, break clumps; add veg.",
          "Toss eggs back; soy to taste; high heat = less mush.",
        ],
        whyItWorks: "Classic use for takeout rice clamshells.",
      },
      {
        name: "Mediterranean tuna melt toast",
        cuisine: "Mediterranean",
        minutes: 10,
        feeds: "1",
        pantryStaples: ["Bread", "Canned tuna", "Mayo or yogurt", "Cheese slice", "Tomato", "Salt", "Paprika"],
        steps: [
          "Mix tuna with yogurt/mayo; season.",
          "Toast bread; tomato slices; tuna; cheese.",
          "Broil or microwave until cheese melts (watch so it doesn’t rubber).",
        ],
        whyItWorks: "Open-face melt = fewer dishes than a full sandwich press.",
      },
    ],
  },
];

/** ISO week number 1–53 for the given date (UTC-safe for week rotation). */
export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getCurrentDietFuelWeek(date: Date = new Date()): DietFuelWeek {
  const week = getISOWeekNumber(date);
  const index = (week - 1) % DIET_FUEL_WEEKS.length;
  return DIET_FUEL_WEEKS[index];
}

/** Badge colors for cuisine chips on the Fuel page */
export const CUISINE_BADGE_CLASS: Record<DietFuelCuisine, string> = {
  Indian: "bg-amber-100 text-amber-900 border-amber-200",
  Chinese: "bg-red-50 text-red-900 border-red-100",
  Thai: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Mediterranean: "bg-sky-100 text-sky-900 border-sky-200",
  Mexican: "bg-lime-100 text-lime-900 border-lime-200",
  "Global / dorm": "bg-slate-100 text-slate-800 border-slate-200",
};
