import type { DietFuelCuisine } from "@/lib/diet-fuel-guide";

/** Stock photos by vibe (Unsplash) — used when a meal has no custom imageUrl. */
export const CUISINE_MEAL_IMAGES: Record<DietFuelCuisine, string> = {
  Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=500&fit=crop&q=80",
  Chinese: "https://images.unsplash.com/photo-1563245372-f21724e38593?w=800&h=500&fit=crop&q=80",
  Thai: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=500&fit=crop&q=80",
  Mediterranean: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop&q=80",
  Mexican: "https://images.unsplash.com/photo-1565299585323-38174c0b5d0a?w=800&h=500&fit=crop&q=80",
  "Global / dorm": "https://images.unsplash.com/photo-1490645935967-10de286bae44?w=800&h=500&fit=crop&q=80",
};

export interface MealSlot {
  title: string;
  cuisine: DietFuelCuisine;
  minutes: number;
  /** If omitted, CUISINE_MEAL_IMAGES[cuisine] is used */
  imageUrl?: string;
  staples: string[];
  steps: string[];
}

export interface DayMealPlan {
  dayIndex: number;
  label: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

export const SEVEN_DAY_MEAL_PLAN: DayMealPlan[] = [
  {
    dayIndex: 1,
    label: "Monday",
    breakfast: {
      title: "Yogurt + fruit + granola bowl",
      cuisine: "Mediterranean",
      minutes: 8,
      staples: ["Greek yogurt", "Banana or berries", "Granola or oats", "Honey"],
      steps: [
        "Spoon yogurt into a bowl.",
        "Slice banana or add frozen berries (microwave 20 sec if needed).",
        "Top with granola and a drizzle of honey.",
      ],
    },
    lunch: {
      title: "Microwave burrito bowl",
      cuisine: "Mexican",
      minutes: 10,
      staples: ["Microwave rice", "Canned beans", "Salsa", "Cheese", "Hot sauce"],
      steps: [
        "Heat rice and beans; mix with salsa.",
        "Cheese on top; microwave 30 sec to melt.",
        "Hot sauce to taste.",
      ],
    },
    dinner: {
      title: "Soy-garlic tofu crumbles + rice",
      cuisine: "Chinese",
      minutes: 18,
      staples: ["Firm tofu", "Soy sauce", "Ginger", "Garlic", "Rice", "Frozen peas"],
      steps: [
        "Crumble tofu; pat dry. Pan-fry until golden.",
        "Add garlic and ginger, soy and a pinch of sugar.",
        "Serve on rice with peas mixed in.",
      ],
    },
  },
  {
    dayIndex: 2,
    label: "Tuesday",
    breakfast: {
      title: "Masala eggs on toast",
      cuisine: "Indian",
      minutes: 12,
      staples: ["Eggs", "Bread", "Onion", "Tomato", "Oil", "Salt", "Chili powder"],
      steps: [
        "Soft onion in oil; add chopped tomato and spices.",
        "Crack in eggs; scramble gently.",
        "Serve on toast.",
      ],
    },
    lunch: {
      title: "Peanut noodle cold bowl",
      cuisine: "Thai",
      minutes: 15,
      staples: ["Noodles", "Peanut butter", "Soy sauce", "Lime", "Frozen veg", "Sriracha"],
      steps: [
        "Cook noodles; rinse if serving cold.",
        "Whisk PB, soy, lime, sugar, garlic with hot water until smooth.",
        "Toss noodles and veg with sauce.",
      ],
    },
    dinner: {
      title: "Cabbage-carrot slaw + canned beans",
      cuisine: "Mediterranean",
      minutes: 12,
      staples: ["Cabbage", "Carrot", "Lemon", "Oil", "Canned beans", "Salt"],
      steps: [
        "Shred cabbage and carrot; salt lightly.",
        "Dress with oil and lemon; fold in rinsed beans.",
        "Eat as a big bowl or in a wrap.",
      ],
    },
  },
  {
    dayIndex: 3,
    label: "Wednesday",
    breakfast: {
      title: "Overnight oats (same-day quick soak)",
      cuisine: "Global / dorm",
      minutes: 10,
      staples: ["Rolled oats", "Milk or alt milk", "Banana", "Peanut butter", "Cinnamon"],
      steps: [
        "Mix oats with milk in a jar; microwave 90 sec or soak 10 min.",
        "Stir in PB and cinnamon.",
        "Top with banana slices.",
      ],
    },
    lunch: {
      title: "Tuna + chickpea salad cup",
      cuisine: "Mediterranean",
      minutes: 10,
      staples: ["Canned tuna", "Chickpeas", "Lemon", "Oil", "Cucumber", "Salt"],
      steps: [
        "Drain tuna and chickpeas; flake tuna.",
        "Dress with lemon, oil, salt; dice cucumber in.",
        "Eat with crackers or pita.",
      ],
    },
    dinner: {
      title: "15-minute egg fried rice",
      cuisine: "Chinese",
      minutes: 15,
      staples: ["Cooked rice", "Eggs", "Frozen peas", "Soy sauce", "Oil", "Green onion"],
      steps: [
        "Scramble eggs; set aside.",
        "Fry rice with veg; break clumps.",
        "Toss eggs back in; season with soy.",
      ],
    },
  },
  {
    dayIndex: 4,
    label: "Thursday",
    breakfast: {
      title: "Cheese quesadilla + salsa",
      cuisine: "Mexican",
      minutes: 8,
      staples: ["Tortilla", "Cheese", "Salsa", "Butter or oil"],
      steps: [
        "Butter pan; tortilla + cheese fold or second tortilla on top.",
        "Cook until crisp; flip once.",
        "Cut wedges; dip in salsa.",
      ],
    },
    lunch: {
      title: "Tom yum-ish instant soup noodles",
      cuisine: "Thai",
      minutes: 12,
      staples: ["Instant noodles", "Lime", "Fish sauce or soy", "Frozen shrimp or tofu", "Chili"],
      steps: [
        "Boil water with a splash of fish sauce and lime.",
        "Cook noodles; add protein and veg.",
        "Finish with chili and extra lime.",
      ],
    },
    dinner: {
      title: "Lemon yogurt chicken or chickpeas",
      cuisine: "Mediterranean",
      minutes: 25,
      staples: ["Chicken thighs or chickpeas", "Greek yogurt", "Lemon", "Garlic", "Paprika"],
      steps: [
        "Coat protein with yogurt, lemon, garlic, paprika.",
        "Roast or pan-fry until done.",
        "Serve with microwaved potato or salad kit.",
      ],
    },
  },
  {
    dayIndex: 5,
    label: "Friday",
    breakfast: {
      title: "Avocado toast (or hummus toast)",
      cuisine: "Mediterranean",
      minutes: 7,
      staples: ["Bread", "Avocado or hummus", "Salt", "Lemon", "Chili flakes"],
      steps: [
        "Toast bread.",
        "Mash avocado with salt and lemon, or spread hummus thick.",
        "Top with chili flakes.",
      ],
    },
    lunch: {
      title: "Black bean & corn bowl",
      cuisine: "Mexican",
      minutes: 12,
      staples: ["Black beans", "Corn", "Cumin", "Salsa", "Rice", "Cheese"],
      steps: [
        "Warm beans and corn with cumin.",
        "Layer on rice with salsa and cheese.",
      ],
    },
    dinner: {
      title: "Band gobi–style cabbage stir-fry",
      cuisine: "Indian",
      minutes: 20,
      staples: ["Cabbage", "Onion", "Oil", "Cumin", "Turmeric", "Chili", "Roti or rice"],
      steps: [
        "Cook onion in oil; add cabbage on high heat.",
        "Season; cook until edges brown.",
        "Serve with roti or rice.",
      ],
    },
  },
  {
    dayIndex: 6,
    label: "Saturday",
    breakfast: {
      title: "Smoothie bag dump",
      cuisine: "Global / dorm",
      minutes: 6,
      staples: ["Frozen fruit", "Banana", "Milk or juice", "Peanut butter", "Oats"],
      steps: [
        "Blend frozen fruit, banana, liquid, PB.",
        "Optional: tbsp oats for thickness.",
      ],
    },
    lunch: {
      title: "Mediterranean tuna melt toast",
      cuisine: "Mediterranean",
      minutes: 12,
      staples: ["Bread", "Tuna", "Cheese", "Tomato", "Mayo or yogurt"],
      steps: [
        "Mix tuna with yogurt or mayo.",
        "Toast bread with tuna, tomato, cheese; broil or microwave to melt.",
      ],
    },
    dinner: {
      title: "Thai-ish frozen veg + egg on rice",
      cuisine: "Thai",
      minutes: 14,
      staples: ["Rice", "Frozen stir-fry veg", "Egg", "Soy sauce", "Sugar", "Lime", "Garlic"],
      steps: [
        "Fry veg hot; push aside and scramble egg.",
        "Toss with rice, soy, pinch sugar, lime.",
      ],
    },
  },
  {
    dayIndex: 7,
    label: "Sunday",
    breakfast: {
      title: "Chickpea lemon bowl (half mashed)",
      cuisine: "Mediterranean",
      minutes: 12,
      staples: ["Chickpeas", "Lemon", "Garlic", "Oil", "Cucumber", "Bread"],
      steps: [
        "Mash half the chickpeas; mix with whole chickpeas.",
        "Dress with garlic, lemon, oil, salt.",
        "Scoop with bread.",
      ],
    },
    lunch: {
      title: "Microwave loaded potato",
      cuisine: "Global / dorm",
      minutes: 12,
      staples: ["Potato", "Cheese", "Beans", "Salsa", "Sour cream or yogurt"],
      steps: [
        "Microwave potato until soft.",
        "Split; top with warm beans, cheese, salsa.",
        "Dollop yogurt.",
      ],
    },
    dinner: {
      title: "Soy-ginger noodle soup",
      cuisine: "Chinese",
      minutes: 16,
      staples: ["Broth cube", "Noodles", "Soy sauce", "Ginger", "Frozen wonton or tofu", "Spinach"],
      steps: [
        "Simmer broth with ginger and soy.",
        "Add noodles and protein; finish with greens.",
      ],
    },
  },
];

export function mealImage(m: MealSlot): string {
  return m.imageUrl ?? CUISINE_MEAL_IMAGES[m.cuisine];
}
