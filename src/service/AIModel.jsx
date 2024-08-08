/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",//Here we had change text/plain to application/json
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for 3 days with each day plan with best time to visit in JSON format.\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '## Las Vegas 3-Day Budget Trip for a Couple\n\nThis itinerary prioritizes free and low-cost activities while offering options for splurging on select experiences.  \n\n**Hotel Options:**\n\n```json\n[\n  {\n    "hotelName": "The D Las Vegas",\n    "hotelAddress": "301 Fremont Street, Las Vegas, NV 89101",\n    "price": "$50-$100/night",\n    "hotelImageURL": "https://www.the-d.com/media/images/hotel/the-d-exterior.jpg",\n    "geoCoordinates": "36.1699, -115.1422",\n    "rating": "3.5 stars",\n    "description": "Centrally located on Fremont Street, offering basic, clean rooms and a retro vibe. Close to the Fremont Street Experience and numerous dining options."\n  },\n  {\n    "hotelName": "The Golden Nugget",\n    "hotelAddress": "129 E Fremont Street, Las Vegas, NV 89101",\n    "price": "$70-$150/night",\n    "hotelImageURL": "https://www.goldennugget.com/media/images/default-source/hotel/exterior-views/golden-nugget-hotel-las-vegas-exterior-day-view.jpg?sfvrsn=2",\n    "geoCoordinates": "36.1686, -115.1420",\n    "rating": "4 stars",\n    "description": "Iconic hotel with a casino, pool, and various restaurants. Known for its shark tank and luxurious amenities, offering a good value for the price."\n  },\n  {\n    "hotelName": "Circus Circus Hotel & Casino",\n    "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",\n    "price": "$40-$80/night",\n    "hotelImageURL": "https://www.circuscircus.com/media/images/hotel/circus-circus-hotel-exterior-day-view.jpg?sfvrsn=2",\n    "geoCoordinates": "36.0993, -115.1714",\n    "rating": "3 stars",\n    "description": "Family-friendly hotel with a carnival theme, featuring a midway with rides and attractions. Offers affordable rooms and a lively atmosphere."\n  }\n]\n```\n\n**Itinerary:**\n\n**Day 1: Fremont Street Experience & Downtown Delights**\n\n* **Morning (9:00 AM - 12:00 PM):**\n    * **Place:** Fremont Street Experience\n    * **Place Details:** Explore the pedestrian-friendly Fremont Street Experience, a vibrant hub with live music, street performers, and a canopy of lights. Check out the vintage slot machines and enjoy the bustling atmosphere.\n    * **Place Image URL:** https://www.fremontstreetexperience.com/media/images/fremont-street-experience-daytime-view.jpg\n    * **Geo Coordinates:** 36.1699, -115.1422\n    * **Ticket Pricing:** Free\n    * **Time to Travel:** 30 minutes\n\n* **Lunch (12:00 PM - 1:30 PM):**\n    * **Place:**  Heart Attack Grill (Fremont Street)\n    * **Place Details:** Enjoy a unique and (potentially) unhealthy lunch at this restaurant known for its "calorie-laden" dishes and nursing outfits. \n    * **Place Image URL:** https://www.heartattackgrill.com/images/slider_img_2.jpg\n    * **Geo Coordinates:** 36.1699, -115.1422\n    * **Ticket Pricing:** Budget-friendly \n    * **Time to Travel:** 15 minutes\n\n* **Afternoon (2:00 PM - 5:00 PM):**\n    * **Place:**  Neon Museum\n    * **Place Details:** Immerse yourselves in the history of Las Vegas by exploring iconic neon signs from the city\'s past. Take a tour or simply wander through the museum\'s collection.\n    * **Place Image URL:** https://www.neonmuseum.org/wp-content/uploads/2022/10/Neon-Museum-Las-Vegas-Aerial.jpg\n    * **Geo Coordinates:** 36.1842, -115.1318\n    * **Ticket Pricing:** Around $20 per person\n    * **Time to Travel:** 30 minutes\n\n* **Evening (6:00 PM - 10:00 PM):**\n    * **Place:**  Golden Nugget Casino\n    * **Place Details:** Enjoy an evening at the Golden Nugget\'s casino with a low-stakes gamble or simply watch the action unfold. Enjoy free drinks while playing at some of the tables.\n    * **Place Image URL:** https://www.goldennugget.com/media/images/default-source/casino/golden-nugget-las-vegas-casino.jpg?sfvrsn=2\n    * **Geo Coordinates:** 36.1686, -115.1420\n    * **Ticket Pricing:** Free (unless you choose to gamble)\n    * **Time to Travel:** 15 minutes\n\n**Day 2: Strip Exploration & Free Entertainment**\n\n* **Morning (9:00 AM - 12:00 PM):**\n    * **Place:** Bellagio Conservatory & Botanical Garden\n    * **Place Details:** Marvel at the stunning floral displays and intricate designs of the Bellagio Conservatory, a free and breathtaking attraction.\n    * **Place Image URL:** https://www.bellagio.com/media/images/conservatory-and-botanical-garden/winter-2023.jpg\n    * **Geo Coordinates:** 36.1119, -115.1708\n    * **Ticket Pricing:** Free\n    * **Time to Travel:** 30 minutes\n\n* **Lunch (12:00 PM - 1:30 PM):**\n    * **Place:**  Food Court at the LINQ Promenade\n    * **Place Details:** Enjoy a budget-friendly lunch at the LINQ Promenade\'s diverse food court, offering a range of cuisines and options.\n    * **Place Image URL:** https://www.caesars.com/media/images/linq-promenade-food-court-photo.jpg\n    * **Geo Coordinates:** 36.1005, -115.1727\n    * **Ticket Pricing:** Budget-friendly\n    * **Time to Travel:** 15 minutes\n\n* **Afternoon (2:00 PM - 5:00 PM):**\n    * **Place:**  Fountains of Bellagio Show\n    * **Place Details:** Watch the spectacular synchronized water and light show at the Bellagio Fountains, a free and iconic Las Vegas experience.\n    * **Place Image URL:** https://www.bellagio.com/media/images/fountains-of-bellagio-show/fountains-of-bellagio-show.jpg\n    * **Geo Coordinates:** 36.1119, -115.1708\n    * **Ticket Pricing:** Free\n    * **Time to Travel:** 30 minutes\n\n* **Evening (6:00 PM - 10:00 PM):**\n    * **Place:**  Free Concert or Show on the Strip\n    * **Place Details:**  Many casinos and hotels offer free concerts, magic shows, or other entertainment options in the evening. Check the schedules of venues like the Venetian, Wynn, or Planet Hollywood.\n    * **Place Image URL:** Varies based on the chosen venue. \n    * **Geo Coordinates:** Varies based on the chosen venue.\n    * **Ticket Pricing:** Free\n    * **Time to Travel:** 15 minutes\n\n**Day 3: Hiking & Natural Wonders**\n\n* **Morning (9:00 AM - 12:00 PM):**\n    * **Place:**  Red Rock Canyon National Conservation Area\n    * **Place Details:** Escape the city and enjoy a scenic drive or hike in Red Rock Canyon. Explore the beautiful rock formations and diverse landscape.\n    * **Place Image URL:** https://www.nps.gov/redr/learn/nature/images/Red-Rock-Canyon-Scenery-DSC_1588.jpg\n    * **Geo Coordinates:** 36.1811, -115.3796\n    * **Ticket Pricing:** $15 per vehicle\n    * **Time to Travel:** 45 minutes\n\n* **Lunch (12:00 PM - 1:30 PM):**\n    * **Place:**  Picnic at Red Rock Canyon\n    * **Place Details:**  Enjoy a picnic lunch at one of the scenic overlooks or picnic areas within Red Rock Canyon.\n    * **Place Image URL:**  Varies based on the chosen picnic spot.\n    * **Geo Coordinates:**  Varies based on the chosen picnic spot.\n    * **Ticket Pricing:** Free \n    * **Time to Travel:** 15 minutes\n\n* **Afternoon (2:00 PM - 5:00 PM):**\n    * **Place:**  Lake Mead National Recreation Area\n    * **Place Details:** Visit Lake Mead, the largest reservoir in the United States, for boating, swimming, fishing, or simply enjoying the beautiful lake views.\n    * **Place Image URL:** https://www.nps.gov/lame/learn/nature/images/Lake-Mead-Aerial.jpg\n    * **Geo Coordinates:**  36.1211, -114.9339\n    * **Ticket Pricing:**  Entry fee for the park (around $30 per vehicle)\n    * **Time to Travel:** 45 minutes\n\n* **Evening (6:00 PM - 9:00 PM):**\n    * **Place:**  Dinner at a local restaurant in Downtown Las Vegas\n    * **Place Details:**  Enjoy a final meal at a budget-friendly restaurant in Downtown Las Vegas, such as a diner or a local eatery.\n    * **Place Image URL:**  Varies based on the chosen restaurant.\n    * **Geo Coordinates:**  Varies based on the chosen restaurant.\n    * **Ticket Pricing:** Budget-friendly\n    * **Time to Travel:** 15 minutes\n\n**Important Tips for a Budget Trip:**\n\n* **Travel during the off-season:** Prices are typically lower during the shoulder seasons (spring and fall).\n* **Eat at local restaurants:** Skip the expensive buffets and explore the many affordable dining options in the city.\n* **Take advantage of free attractions:** Las Vegas has many free activities, including the Fremont Street Experience, Bellagio Conservatory, and Fountains of Bellagio show.\n* **Utilize public transportation:** The Las Vegas Monorail is a convenient and affordable way to get around the Strip.\n* **Book your accommodations in advance:** Securing a room early can help you get the best deals.\n* **Pack snacks and drinks:** This can help you save money on meals and drinks. \n\nThis itinerary is a suggested framework, and you can customize it based on your interests and preferences. Remember to factor in travel times and allow for flexibility in your schedule. \n',
          },
        ],
      },
    ],
  });

 


}
