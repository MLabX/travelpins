/*
 * TravelPins data file
 * ---------------------
 * This is the ONLY file you edit to change what's on the map.
 * Swap in Max's real dataset by replacing the objects below,
 * or drag a CSV/JSON onto the app to load data at runtime.
 *
 * Fields:
 *   name      (required)  - place name
 *   lat, lng  (required)  - coordinates (decimal degrees)
 *   category  (required)  - one of the keys in CATEGORIES (index.html)
 *   city                  - optional label
 *   rating                - optional 1-5
 *   notes                 - optional free text
 *   image                 - optional photo URL (shown in the popup; omit if none)
 */
window.TRAVEL_PINS = [
  { name: "Blue Bottle Coffee", city: "Tokyo", category: "coffee", lat: 35.6659, lng: 139.7085, rating: 5, notes: "Kiyosumi flagship. Pour-over heaven.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&q=70" },
  { name: "Fuglen", city: "Tokyo", category: "coffee", lat: 35.6693, lng: 139.6952, rating: 4, notes: "Norwegian-Japanese, great cocktails at night." },
  { name: "La Marzocco Cafe", city: "Seattle", category: "coffee", lat: 47.6205, lng: -122.3493, rating: 5, notes: "Rotating roaster residency." },
  { name: "Stumptown Coffee", city: "Portland", category: "coffee", lat: 45.5210, lng: -122.6816, rating: 4, notes: "The original. Cold brew on tap." },
  { name: "Sightglass Coffee", city: "San Francisco", category: "coffee", lat: 37.7726, lng: -122.4103, rating: 5, notes: "Beautiful two-story roastery." },
  { name: "Caffè Reggio", city: "New York", category: "coffee", lat: 40.7300, lng: -74.0000, rating: 4, notes: "Claims to have brought the cappuccino to the US." },
  { name: "Monmouth Coffee", city: "London", category: "coffee", lat: 51.5150, lng: -0.1257, rating: 5, notes: "Covent Garden. Always a queue for a reason." },
  { name: "Coutume Café", city: "Paris", category: "coffee", lat: 48.8524, lng: 2.3178, rating: 4, notes: "Third-wave pioneers in the 7th." },
  { name: "The Barn", city: "Berlin", category: "coffee", lat: 52.5296, lng: 13.4010, rating: 4, notes: "Minimalist, single-origin obsessed." },
  { name: "Proud Mary", city: "Melbourne", category: "coffee", lat: -37.8000, lng: 144.9860, rating: 5, notes: "Collingwood legend. Brunch too." },
  { name: "Toby's Estate", city: "Sydney", category: "coffee", lat: -33.8846, lng: 151.1972, rating: 4, notes: "Chippendale roastery, City Rd." },
  { name: "Café Central", city: "Vienna", category: "coffee", lat: 48.2100, lng: 16.3660, rating: 4, notes: "Historic Viennese coffee house." },

  // A few non-coffee examples to show multi-category filtering.
  { name: "teamLab Planets", city: "Tokyo", category: "sight", lat: 35.6486, lng: 139.7906, rating: 5, notes: "Immersive digital art museum." },
  { name: "Tsuta Ramen", city: "Tokyo", category: "food", lat: 35.7295, lng: 139.7100, rating: 5, notes: "First Michelin-starred ramen." },
  { name: "Sky Garden", city: "London", category: "sight", lat: 51.5113, lng: -0.0837, rating: 4, notes: "Free rooftop garden, book ahead." },

  // ---- Sydney CBD: top 20 coffee shops (added Jul 2026) ----
  // Coordinates are street-level approximations from each venue's address; all verified to fall within the CBD.
  { name: "Single O", city: "Sydney", category: "coffee", lat: -33.8683, lng: 151.2056, rating: 4, notes: "89 York St. House-roasted, ever-busy CBD institution." },
  { name: "Pablo & Rusty's", city: "Sydney", category: "coffee", lat: -33.8735, lng: 151.2087, rating: 5, notes: "161 Castlereagh St. Carbon-neutral pioneer, beautifully balanced blends." },
  { name: "Gumption by Coffee Alchemy", city: "Sydney", category: "coffee", lat: -33.8693, lng: 151.2073, rating: 5, notes: "Strand Arcade, 412 George St. A gem inside the historic arcade." },
  { name: "Cabrito Coffee Traders", city: "Sydney", category: "coffee", lat: -33.8627, lng: 151.2092, rating: 4, notes: "12 Bulletin Pl. Tucked-away laneway roaster near Circular Quay." },
  { name: "Skittle Lane", city: "Sydney", category: "coffee", lat: -33.8692, lng: 151.2063, rating: 4, notes: "40 King St. Minimalist and precise, seasonal beans." },
  { name: "Cross Eatery", city: "Sydney", category: "coffee", lat: -33.8672, lng: 151.2053, rating: 4, notes: "155 Clarence St. Sharp brunch and reliable espresso." },
  { name: "Bowery Lane", city: "Sydney", category: "coffee", lat: -33.8646, lng: 151.2092, rating: 4, notes: "1 O'Connell St. Bistro-cafe at the Circular Quay end." },
  { name: "Workshop Espresso", city: "Sydney", category: "coffee", lat: -33.8664, lng: 151.2079, rating: 4, notes: "350 George St. Fast, consistent city standby." },
  { name: "Devon Cafe Barangaroo", city: "Sydney", category: "coffee", lat: -33.8619, lng: 151.2012, rating: 4, notes: "200 Barangaroo Ave. Elevated brunch by the water." },
  { name: "South by Dukes", city: "Sydney", category: "coffee", lat: -33.8633, lng: 151.2006, rating: 4, notes: "Tower One, Barangaroo. Melbourne's Dukes Roasters, harbourside." },
  { name: "The Precinct by Toby's Estate", city: "Sydney", category: "coffee", lat: -33.8626, lng: 151.2016, rating: 4, notes: "Barangaroo. Slick, fast-paced sibling to Toby's Estate." },
  { name: "Bourke Street Bakery Barangaroo", city: "Sydney", category: "coffee", lat: -33.8646, lng: 151.2015, rating: 4, notes: "Exchange Pl, Barangaroo. Pastries plus dependable coffee." },
  { name: "Reuben Hills Kiosk", city: "Sydney", category: "coffee", lat: -33.8675, lng: 151.2094, rating: 4, notes: "Martin Place. Reuben Hills beans in a marble foyer." },
  { name: "Regiment Coffee", city: "Sydney", category: "coffee", lat: -33.8676, lng: 151.2066, rating: 4, notes: "30 Barrack St. Quick, quality pour." },
  { name: "Infusion on Clarence", city: "Sydney", category: "coffee", lat: -33.8668, lng: 151.2049, rating: 4, notes: "116 Clarence St. Humble spot, outstanding Danes coffee." },
  { name: "Mecca Coffee", city: "Sydney", category: "coffee", lat: -33.8695, lng: 151.2067, rating: 5, notes: "King St. Roastery craft, flavour-forward cups." },
  { name: "Sample Coffee City", city: "Sydney", category: "coffee", lat: -33.8672, lng: 151.2067, rating: 4, notes: "20 Barrack St. Compact city sibling of the Surry Hills original." },
  { name: "Coffee Emporium", city: "Sydney", category: "coffee", lat: -33.8688, lng: 151.2095, rating: 3, notes: "88 King St. Busy corporate go-to." },
  { name: "The Fine Food Store", city: "Sydney", category: "coffee", lat: -33.8590, lng: 151.2085, rating: 4, notes: "1 Kendall Lane, The Rocks. Rustic corner, Toby's Estate beans." },
  { name: "Ground Control", city: "Sydney", category: "coffee", lat: -33.8828, lng: 151.2065, rating: 3, notes: "Eddy Ave, near Central. Grab-and-go for commuters." }
];
