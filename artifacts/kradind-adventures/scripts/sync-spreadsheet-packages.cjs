const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const allPackagesPath = path.resolve(__dirname, '..', 'data', 'all-packages.json');
const cmsStorePath = path.resolve(__dirname, '..', 'data', 'cms-store.json');
const travelDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'travel-data.ts');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority';

// 28 items from Google Spreadsheet
const spreadsheetRows = [
  {
    sNo: 1,
    title: "Rishikesh Tour Package for couple 2 nights 3 days",
    slug: "rishikesh-couple-tour-package-2-nights-3-days",
    primaryKeyword: "Rishikesh tour package for couple 2 nights 3 days",
    metaTitle: "Rishikesh Tour Package for Couple: 2 Nights 3 Days Gateway",
    metaDescription: "Book a romantic 2 nights 3 days Rishikesh tour package for couples. Enjoy riverside stays, Ganga Aarti, rafting, and cozy cliffside cafes. Get quotes now!",
    metaKeywords: "rishikesh tour package for couple 2 nights 3 days, rishikesh couple package, 2 nights 3 days rishikesh trip for couples, rishikesh honeymoon package, romantic weekend in rishikesh",
    location: "Rishikesh, Uttarakhand",
    region: "Uttarakhand",
    duration: "3 Days / 2 Nights",
    price: 11999,
    originalPrice: 14999,
    badge: "Couples Gateway",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    tagline: "Romantic riverside cottage stay, peaceful Triveni Ghat Ganga Aarti, river rafting & cliff cafes.",
    overview: "Escape to the holy and serene banks of the Ganges with our handcrafted Rishikesh tour package for couples. Spend 2 nights in romantic boutique riverside accommodations, watch the evening Ganga Aarti, enjoy river rafting, and explore vibrant mountain cafes.",
    highlights: [
      "Romantic riverside boutique resort / luxury tent stay",
      "Private VIP seating for Triveni Ghat Ganga Aarti",
      "Exciting 16 km Ganga river rafting & cliff jumping (optional)",
      "Evening candle-light dinner with mountain river view",
      "Explore Beatles Ashram, Ram Jhula, and cliffside cafes"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Rishikesh & Romantic Riverside Sunset",
        description: "Arrive in Rishikesh. Check in to your serene riverside resort. In the evening, visit Triveni Ghat for the soulful Ganga Aarti followed by a romantic dinner.",
        stay: "Riverside Resort, Rishikesh",
        meal: "Welcome Drink & Dinner"
      },
      {
        day: 2,
        title: "Ganga River Rafting & Beatles Ashram Exploration",
        description: "Enjoy breakfast overlooking the river. Head out for thrilling river rafting (Shivpuri to Rishikesh). In the afternoon, visit the historic Beatles Ashram and relax at picturesque cafes.",
        stay: "Riverside Resort, Rishikesh",
        meal: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "Morning Sunrise Yoga & Departure",
        description: "Begin with a relaxing morning yoga session and wholesome breakfast. Walk across Ram Jhula and Lakshman Jhula area for souvenirs before departure.",
        stay: "Return Journey",
        meal: "Breakfast"
      }
    ],
    inclusions: [
      "2 Nights luxury riverside accommodation",
      "Daily breakfast and candle-light dinner",
      "Private AC transport for local transfers",
      "River rafting activity with safety equipment",
      "All driver allowance, toll, and parking"
    ],
    exclusions: [
      "Personal expenses and tips",
      "Adventure activities not mentioned in itinerary",
      "Airfare or train tickets"
    ],
    faqs: [
      {
        question: "Is this package suitable for honeymoons or wedding anniversaries?",
        answer: "Yes, this package is designed specifically for couples and includes romantic stays, candle-light dinner setups, and quiet riverside experiences."
      },
      {
        question: "Can we customize the stay to a luxury resort?",
        answer: "Absolutely! We can upgrade your accommodation to 4-star and 5-star properties along the Ganges upon request."
      }
    ]
  },
  {
    sNo: 2,
    title: "Uttarakhand Tour Package – 5 Nights 6 Days",
    slug: "uttarakhand-tour-package-5-nights-6-days",
    primaryKeyword: "Uttarakhand tour package 5 nights 6 days",
    metaTitle: "Uttarakhand Tour Package 5 Nights 6 Days | Hill & Temple",
    metaDescription: "Book our 5 nights 6 days Uttarakhand tour package. Explore scenic hill stations, Ganga Aarti, river views, and Himalayan viewpoints. Get your custom quote!",
    metaKeywords: "uttarakhand tour package 5 nights 6 days, 5 nights 6 days uttarakhand itinerary, uttarakhand holiday package, uttarakhand trip 6 days, uttarakhand travel package 5n 6d",
    location: "Dehradun, Mussoorie & Nainital, Uttarakhand",
    region: "Uttarakhand",
    duration: "6 Days / 5 Nights",
    price: 21999,
    originalPrice: 26999,
    badge: "Bestseller Hill Circuit",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    tagline: "The quintessential Uttarakhand holiday: Queen of the Hills Mussoorie, serene Lake City Nainital & sacred Haridwar/Rishikesh.",
    overview: "Discover Uttarakhand's most beloved destinations on this 6-day scenic circuit. From misty pine ridges in Mussoorie to boating on Naini Lake and evening temple bells in Haridwar, experience the best of Devbhoomi with private chauffeur service.",
    highlights: [
      "Scenic cable car ride to Gun Hill & Kempty Falls in Mussoorie",
      "Peaceful boating in the mango-shaped Naini Lake",
      "Witness sacred evening Ganga Aarti at Har Ki Pauri Haridwar",
      "Panoramic Himalayan viewpoints at Snow View & Lal Tibba",
      "Comfortable 3-star handpicked boutique hotels throughout"
    ],
    itinerary: [
      {
        day: 1,
        title: "Delhi / Dehradun to Mussoorie Transfer",
        description: "Pickup from Delhi or Dehradun. Drive up the winding Shivalik ranges to Mussoorie. Check in to your hotel and spend the evening strolling on the vibrant Mall Road.",
        stay: "Mussoorie Hotel",
        meal: "Dinner"
      },
      {
        day: 2,
        title: "Mussoorie Sightseeing & Kempty Falls",
        description: "Visit Kempty Falls, Company Garden, and Lal Tibba scenic viewpoint. Enjoy evening sunset overlooking Doon Valley.",
        stay: "Mussoorie Hotel",
        meal: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "Mussoorie to Rishikesh & Haridwar",
        description: "Drive down to Rishikesh. Visit Ram Jhula, Triveni Ghat, and proceed to Haridwar to experience the divine evening Ganga Aarti at Har Ki Pauri.",
        stay: "Rishikesh / Haridwar Hotel",
        meal: "Breakfast & Dinner"
      },
      {
        day: 4,
        title: "Transfer to Nainital via Corbett Foothills",
        description: "Morning departure for Nainital across the picturesque Kumaon foothills. Check in to lake-view hotel and enjoy a peaceful twilight boat ride.",
        stay: "Nainital Hotel",
        meal: "Breakfast & Dinner"
      },
      {
        day: 5,
        title: "Nainital Lakes & Viewpoints Exploration",
        description: "Explore Bhimtal, Sattal, Naukuchiatal, and Naina Devi Temple. Enjoy evening shopping on Mall Road.",
        stay: "Nainital Hotel",
        meal: "Breakfast & Dinner"
      },
      {
        day: 6,
        title: "Departure to Delhi / Kathgodam",
        description: "After breakfast, depart for Kathgodam Railway Station or Delhi Airport with unforgettable Devbhoomi memories.",
        stay: "Return Journey",
        meal: "Breakfast"
      }
    ],
    inclusions: [
      "5 Nights accommodation on twin sharing",
      "Daily breakfast and dinner at hotels",
      "Private AC vehicle for all transfers and tours",
      "All driver allowances, parking, and toll taxes"
    ],
    exclusions: [
      "Monument entry fees & cable car tickets",
      "Personal shopping and laundry",
      "Lunch and extra beverages"
    ],
    faqs: [
      {
        question: "Can we start the tour from Dehradun instead of Delhi?",
        answer: "Yes, pickup can be arranged from Dehradun Jolly Grant Airport or Railway Station at no extra charge."
      }
    ]
  },
  {
    sNo: 3,
    title: "Kerala Tour Package – 5 Nights  6 Days",
    slug: "kerala-tour-package-5-nights-6-days",
    aliasSlugs: ["kerala-tour-package"],
    primaryKeyword: "Kerala tour package 5 nights 6 days",
    metaTitle: "Kerala Tour Package 5 Nights 6 Days | Hills & Backwaters",
    metaDescription: "Book a 5 nights 6 days Kerala tour package. Explore misty Munnar tea hills, Thekkady wildlife, and an Alleppey backwater houseboat stay. Get best deals now!",
    metaKeywords: "kerala tour package 5 nights 6 days, 5 nights 6 days kerala itinerary, munnar thekkady alleppey tour package, kerala backwater holiday 6 days, kerala houseboat trip 5n 6d"
  },
  {
    sNo: 4,
    title: "Leh Ladakh Itinerary – 6 Nights 7 Days",
    slug: "leh-ladakh-itinerary-6-nights-7-days",
    primaryKeyword: "Leh Ladakh Itinerary – 6 Nights / 7 Days",
    metaTitle: "Leh Ladakh Tour Package 6 Nights 7 Days | Nubra & Pangong",
    metaDescription: "Book a 6 nights 7 days Leh Ladakh tour package. Experience Khardung La, Nubra Valley sand dunes, Pangong Tso camp stay, and Leh monasteries. Get best rates!",
    metaKeywords: "leh ladakh tour package 6 nights 7 days, ladakh tour package 7 days, 6n 7d ladakh holiday package, nubra valley pangong lake tour, leh ladakh trip from delhi, ladakh travel package",
    location: "Leh, Nubra Valley, Pangong Tso, Ladakh",
    region: "Ladakh",
    duration: "7 Days / 6 Nights",
    price: 26999,
    originalPrice: 32999,
    badge: "Land of High Passes",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80",
    tagline: "Drive across Khardung La, ride double-humped camels in Nubra Valley, and sleep under stars at Pangong Lake.",
    overview: "Experience the ultimate Himalayan road adventure in Leh Ladakh. Travel through dramatic cold desert valleys, sacred Tibetan monasteries, azure glacial lakes, and world-record high mountain passes.",
    highlights: [
      "Drive across Khardung La (17,582 ft) — among the world's highest motorable passes",
      "Overnight luxury tent camping along turquoise Pangong Tso Lake",
      "Double-humped Bactrian camel safari in Hunder white sand dunes",
      "Visit historic Thiksey, Diskit & Shey Monasteries",
      "Experience Magnetic Hill & confluence of Indus and Zanskar rivers"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Leh & Complete Rest for Acclimatization", description: "Arrive at Kushok Bakula Rimpochee Airport Leh (11,500 ft). Transfer to hotel and take complete rest to acclimatize to high altitude.", stay: "Leh Hotel", meal: "Dinner" },
      { day: 2, title: "Sham Valley Sightseeing & Magnetic Hill", description: "Explore Hall of Fame, Kali Mata Temple, Magnetic Hill phenomenon, and Sangam (confluence of Indus & Zanskar rivers).", stay: "Leh Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Leh to Nubra Valley via Khardung La Pass", description: "Ascend the legendary Khardung La pass (17,582 ft) into Nubra Valley. Visit giant Diskit Buddha and enjoy camel safari at Hunder dunes.", stay: "Nubra Valley Camp", meal: "Breakfast & Dinner" },
      { day: 4, title: "Nubra Valley to Pangong Tso via Shyok River", description: "Drive along scenic Shyok river gorge to the breathtaking Pangong Tso lake (14,270 ft) that changes colors throughout the day.", stay: "Pangong Lake Camp", meal: "Breakfast & Dinner" },
      { day: 5, title: "Pangong Tso Sunrise & Return to Leh via Chang La", description: "Witness magical sunrise over Pangong Lake. Return to Leh crossing high Chang La pass (17,590 ft).", stay: "Leh Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Monasteries & Leh Local Shopping", description: "Visit Thiksey Monastery and Rancho School. Evening at leisure in Leh main bazaar for Pashmina and Tibetan souvenirs.", stay: "Leh Hotel", meal: "Breakfast & Dinner" },
      { day: 7, title: "Leh Airport Departure", description: "Transfer to Leh Airport for flight back home with memories of a lifetime.", stay: "Return Flight", meal: "Breakfast" }
    ],
    inclusions: [
      "6 Nights accommodation (Hotels + Luxury Camps)",
      "Daily breakfast and hot dinner",
      "Non-AC Innova / Xylo / Tempo Traveller per itinerary",
      "Inner Line Permits and Wildlife fees for Nubra & Pangong",
      "Airport pickup and drop"
    ],
    exclusions: [
      "Airfare to/from Leh",
      "Camel ride, ATV rides, and river rafting charges",
      "Oxygen cylinder if requested for personal backup"
    ],
    faqs: [
      {
        question: "Is acclimatization compulsory in Leh?",
        answer: "Yes, Day 1 must be spent in complete rest at the hotel to adapt smoothly to 11,500 ft altitude without mountain sickness."
      }
    ]
  },
  {
    sNo: 5,
    title: "Rajasthan Tour Package  5 Nights  6 Days",
    slug: "rajasthan-tour-package-5-nights-6-days",
    aliasSlugs: ["rajasthan-tour-package-6-days", "rajasthan-tour-package"],
    primaryKeyword: "Rajasthan tour package 5 nights 6 days",
    metaTitle: "Rajasthan Tour Package 5 Nights 6 Days | Forts & Palaces",
    metaDescription: "Book a 5 nights 6 days Rajasthan tour package. Explore Jaipur, Jodhpur, and Udaipur forts, royal palaces, cultural shows, and lake views. Get the best deals!",
    metaKeywords: "rajasthan tour package 5 nights 6 days, 5 nights 6 days rajasthan itinerary, jaipur jodhpur udaipur tour package, rajasthan holiday package 6 days, rajasthan trip 5n 6d",
    location: "Jaipur, Jodhpur & Udaipur, Rajasthan",
    region: "Rajasthan",
    duration: "6 Days / 5 Nights",
    price: 24999,
    originalPrice: 29999,
    badge: "Royal Heritage",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
    tagline: "Pink City palaces, the mighty Blue City fort of Mehrangarh, and romantic boat rides in the City of Lakes Udaipur.",
    overview: "Immerse yourself in Rajasthan's majestic royalty. Explore grand hilltop fortresses, vibrant desert markets, ornate havelis, and shimmering lakes with dedicated chauffeur transport.",
    highlights: [
      "Guided tour of Amer Fort, City Palace & Hawa Mahal in Jaipur",
      "Visit towering Mehrangarh Fort and Jaswant Thada in Jodhpur",
      "Sunset boat ride on Lake Pichola overlooking Jag Mandir Udaipur",
      "Explore Ranakpur Jain Temple with 1,444 marble pillars en route",
      "Stay in authentic heritage hotels with royal hospitality"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Pink City Jaipur", description: "Arrive in Jaipur. Check in to hotel. Evening visit to Birla Temple and Chokhi Dhani ethnic cultural resort.", stay: "Jaipur Hotel", meal: "Dinner" },
      { day: 2, title: "Full Day Jaipur Forts & Palaces Tour", description: "Visit Amer Fort, Jal Mahal, City Palace, Jantar Mantar, and iconic Hawa Mahal.", stay: "Jaipur Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Jaipur to Jodhpur (The Blue City)", description: "Drive to Jodhpur. Check in and visit Mehrangarh Fort, Jaswant Thada, and Umaid Bhawan Palace.", stay: "Jodhpur Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Jodhpur to Udaipur via Ranakpur", description: "Scenic drive to Udaipur stopping at the magnificent marble Ranakpur Jain Temples.", stay: "Udaipur Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Udaipur City Palace & Lake Pichola", description: "Explore Udaipur City Palace, Saheliyon Ki Bari, and enjoy sunset boat ride on Lake Pichola.", stay: "Udaipur Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Udaipur Airport / Railway Departure", description: "Transfer to Udaipur Airport or Railway Station with royal memories.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "5 Nights accommodation in verified heritage / 3-star hotels",
      "Daily breakfast and dinner",
      "Private AC transport throughout the circuit",
      "All toll, parking, driver allowance, and state taxes"
    ],
    exclusions: [
      "Monument entry tickets and camera fees",
      "Boat ride tickets on Lake Pichola"
    ],
    faqs: [
      { question: "Can this tour be customized to include Jaisalmer desert dunes?", answer: "Yes, we can extend this package to 7N/8D to include Jaisalmer Sam Sand Dunes camping." }
    ]
  },
  {
    sNo: 6,
    title: "Kashmir Tour Package 5 Nights 6 Days",
    slug: "kashmir-tour-package-5-nights-6-days",
    aliasSlugs: ["kashmir-tour-package-6-days"],
    primaryKeyword: "Kashmir tour package 5 nights 6 days",
    metaTitle: "Kashmir Tour Package 5 Nights 6 Days | Gulmarg & Pahalgam",
    metaDescription: "Book a 5 nights 6 days Kashmir tour package. Enjoy Dal Lake Shikara ride, Gulmarg Gondola, Pahalgam valleys, and a heritage houseboat stay. Get best quotes!",
    metaKeywords: "kashmir tour package 5 nights 6 days, 5 nights 6 days kashmir itinerary, srinagar gulmarg pahalgam tour package, kashmir holiday package 6 days, kashmir trip 5n 6d"
  },
  {
    sNo: 7,
    title: "Nainital Tour Package 3 Nights 4 Days ",
    slug: "nainital-tour-package-3-nights-4-days",
    aliasSlugs: ["nainital-tour-package"],
    primaryKeyword: "Nainital tour package 3 nights 4 days",
    metaTitle: "Nainital Tour Package 3 Nights 4 Days | KRADIND Holidays",
    metaDescription: "Book our 3 nights 4 days Nainital tour package. Enjoy Naini Lake boating, Bhimtal, Naina Devi Temple, and Mall Road. Customizable plans at the best rates!",
    metaKeywords: "nainital tour package 3 nights 4 days, 3 nights 4 days nainital itinerary, nainital holiday package, nainital trip 4 days, nainital lake tour package, nainital travel package"
  },
  {
    sNo: 8,
    title: "Kedarnath Tour Package  5 Nights 6 Days",
    slug: "kedarnath-tour-package-5-nights-6-days",
    primaryKeyword: "Kedarnath tour package 5 nights 6 days",
    metaTitle: "Kedarnath Tour Package 5 Nights 6 Days | Yatra & Darshan",
    metaDescription: "Book our 5 nights 6 days Kedarnath tour package. Includes Haridwar/Rishikesh pickup, Guptkashi stay, Kedarnath temple darshan, and trek assistance. Book now!",
    metaKeywords: "kedarnath tour package 5 nights 6 days, 5 nights 6 days kedarnath itinerary, kedarnath yatra package, kedarnath trip from haridwar 6 days, kedarnath yatra 5n 6d",
    location: "Haridwar, Guptkashi & Kedarnath, Uttarakhand",
    region: "Uttarakhand",
    duration: "6 Days / 5 Nights",
    price: 16999,
    originalPrice: 20999,
    badge: "Sacred Pilgrimage",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1600&q=80",
    tagline: "Sacred pilgrimage to the divine Jyotirlinga of Lord Shiva nestled at 11,755 ft amidst snow-clad peaks.",
    overview: "Embark on a soul-cleansing spiritual yatra to Baba Kedarnath. Enjoy private cab transfers from Haridwar/Rishikesh, riverside stays in Guptkashi/Phata, and guided support for the Kedarnath trek or helicopter tickets.",
    highlights: [
      "Darshan at Kedarnath Temple (one of the 12 sacred Jyotirlingas)",
      "Scenic drive along Ganga, Alaknanda & Mandakini river confluences",
      "Stay near Gaurikund/Guptkashi for smooth early morning start",
      "Helicopter / pony / trek assistance from base camp",
      "Visit Kashi Vishwanath Temple in Guptkashi"
    ],
    itinerary: [
      { day: 1, title: "Haridwar / Rishikesh to Guptkashi", description: "Drive along the river valley via Devprayag and Rudraprayag to Guptkashi. Evening visit to ancient Kashi Vishwanath Temple.", stay: "Guptkashi Hotel", meal: "Dinner" },
      { day: 2, title: "Guptkashi to Gaurikund & Trek to Kedarnath", description: "Early morning drive to Sonprayag/Gaurikund. Begin the sacred 16 km trek to Kedarnath. Arrive by evening for divine Aarti.", stay: "Kedarnath Ashram / Camp", meal: "Breakfast & Dinner" },
      { day: 3, title: "Kedarnath Morning Darshan & Descent to Guptkashi", description: "Attend morning darshan and Abhishek. Trek down to Gaurikund and transfer back to hotel in Guptkashi.", stay: "Guptkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Excursion to Chopta & Tungnath (Optional)", description: "Visit scenic Chopta alpine meadows and return to hotel.", stay: "Guptkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Guptkashi to Rishikesh", description: "Drive back to Rishikesh. Attend the evening Triveni Ghat Ganga Aarti.", stay: "Rishikesh Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Departure from Rishikesh / Haridwar", description: "Transfer to Haridwar Railway Station for your onward journey with Baba Kedar's blessings.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "5 Nights accommodation (hotels + Kedarnath stay)",
      "Daily breakfast and vegetarian dinner",
      "Private vehicle from Haridwar to Haridwar",
      "Yatra registration assistance"
    ],
    exclusions: [
      "Helicopter tickets or pony/palki charges",
      "Special VIP darshan slips"
    ],
    faqs: [
      { question: "Can senior citizens do the Kedarnath trek?", answer: "Yes, pony, doli (palki), or helicopter rides are available from Phata/Sersi/Guptkashi for senior citizens and families." }
    ]
  },
  {
    sNo: 9,
    title: "Rishikesh Tour Package 3 Nights 4 days ",
    slug: "rishikesh-tour-package-3-nights-4-days",
    primaryKeyword: "Rishikesh tour package 3 nights 4 days",
    metaTitle: "Rishikesh Tour Package 3 Nights 4 Days | Rafting & Stays",
    metaDescription: "Book a 3 nights 4 days Rishikesh tour package. Experience Ganga river rafting, riverside camping, Triveni Ghat Aarti, and iconic suspension bridges. Book now!",
    metaKeywords: "rishikesh tour package 3 nights 4 days, 3 nights 4 days rishikesh itinerary, rishikesh holiday package 4 days, rishikesh rafting camping package, rishikesh trip 3n 4d",
    location: "Rishikesh & Shivpuri, Uttarakhand",
    region: "Uttarakhand",
    duration: "4 Days / 3 Nights",
    price: 9999,
    originalPrice: 12999,
    badge: "Yoga & Adventure",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    tagline: "World Capital of Yoga, thrilling Grade III white water rapids, cliff camping & spiritual Ganga banks.",
    overview: "Immerse yourself in Rishikesh's unique blend of adrenaline and inner peace. Enjoy riverside luxury camping in Shivpuri, 16 km white water rafting, cliff jumping, Ganga Aarti, and serene cafe hopping.",
    highlights: [
      "16 km thrilling Ganga river rafting from Shivpuri",
      "Riverside luxury camping with swimming pool & bonfire",
      "Experience divine Triveni Ghat Ganga Aarti",
      "Visit Beatles Ashram & iconic Lakshman & Ram Jhula",
      "Cliff jumping and body surfing under certified instructors"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Rishikesh & Riverside Camp Check-in", description: "Arrive in Rishikesh. Transfer to luxury adventure camp in Shivpuri. Enjoy camp games, evening bonfire, music, and buffet dinner.", stay: "Shivpuri Luxury Camp", meal: "Lunch, Snacks & Dinner" },
      { day: 2, title: "Ganga White Water Rafting & Cliff Jumping", description: "Post breakfast, hit the rapids of the holy Ganges (Return to Sender, Roller Coaster, Golf Course). Evening visit to Beatles Ashram.", stay: "Shivpuri Luxury Camp", meal: "Breakfast & Dinner" },
      { day: 3, title: "Waterfalls Trek, Triveni Ghat Aarti & Cafe Hopping", description: "Short morning hike to Neer Garh waterfall. Spend afternoon exploring Little Buddha and Beatles cafes in Tapovan. Attend evening Triveni Ghat Aarti.", stay: "Tapovan Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Morning Yoga & Departure", description: "Peaceful morning yoga session by the river and depart for Delhi/Dehradun.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "3 Nights stay (2 Nights Camp + 1 Night Hotel)",
      "Daily breakfast and dinner (plus camp meals)",
      "16 km river rafting with safety gear and life jacket",
      "Local sightseeing transfers"
    ],
    exclusions: [
      "Bungee jumping and giant swing charges",
      "Personal expenses"
    ],
    faqs: [
      { question: "Is river rafting safe for non-swimmers?", answer: "Yes, all rafting is conducted with certified instructors and world-class life jackets suitable for non-swimmers." }
    ]
  },
  {
    sNo: 10,
    title: "Do Dham Yatra Package  5 Nights 6 Days",
    slug: "do-dham-yatra-package-5-nights-6-days",
    primaryKeyword: "Do Dham Yatra package 5 nights 6 days",
    metaTitle: "Do Dham Yatra Package 5 Nights 6 Days | Kedar & Badri",
    metaDescription: "Book a 5 nights 6 days Do Dham Yatra package. Includes Haridwar pickup, Kedarnath darshan, Badrinath temple, Mana Village & cab transfers. Get quotes now!",
    metaKeywords: "do dham yatra package 5 nights 6 days, 5 nights 6 days kedarnath badrinath package, do dham tour package 6 days, kedarnath badrinath yatra from haridwar, do dham package 5n 6d",
    location: "Kedarnath & Badrinath, Uttarakhand",
    region: "Uttarakhand",
    duration: "6 Days / 5 Nights",
    price: 19999,
    originalPrice: 24999,
    badge: "Sacred Do Dham",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1600&q=80",
    tagline: "Sacred darshan of Lord Shiva at Kedarnath and Lord Vishnu at Badrinath in the holy Garhwal Himalayas.",
    overview: "Fulfill your dream of visiting both Kedarnath and Badrinath shrines on this complete 6-day pilgrimage. Includes private vehicle, confirmed hotel stays, yatra registration, and darshan assistance.",
    highlights: [
      "Darshan at holy Kedarnath Jyotirlinga (11,755 ft)",
      "Darshan at Badrinath Dham & dip in Tapt Kund hot springs",
      "Visit Mana Village — the last Indian village before Tibet border",
      "See Bheem Pul, Saraswati River origin, and Vyas Gufa",
      "All meals and private vehicle from Haridwar/Rishikesh"
    ],
    itinerary: [
      { day: 1, title: "Haridwar to Guptkashi", description: "Drive through scenic valleys of Devprayag and Rudraprayag to Guptkashi.", stay: "Guptkashi Hotel", meal: "Dinner" },
      { day: 2, title: "Guptkashi to Kedarnath", description: "Transfer to Sonprayag and trek/heli to Kedarnath. Evening Aarti at Kedarnath.", stay: "Kedarnath Stay", meal: "Breakfast & Dinner" },
      { day: 3, title: "Kedarnath to Guptkashi / Pipalkoti", description: "Morning darshan, trek down to Sonprayag and drive to Pipalkoti.", stay: "Pipalkoti Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Pipalkoti to Badrinath Dham", description: "Drive to Badrinath. Evening darshan at Badrinath Temple and visit Mana Village.", stay: "Badrinath Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Badrinath to Rudraprayag / Rishikesh", description: "Morning bath in Tapt Kund, darshan, and drive back to Rudraprayag/Srinagar.", stay: "Rudraprayag Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Rudraprayag to Haridwar Departure", description: "Drive to Haridwar for onward journey with holy prasad.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "5 Nights accommodation",
      "Daily breakfast and vegetarian dinner",
      "Private AC / Non-AC vehicle throughout the yatra",
      "Toll, parking, and driver allowance"
    ],
    exclusions: [
      "Helicopter tickets or pony charges for Kedarnath",
      "Personal donations and pooja receipts"
    ],
    faqs: [
      { question: "What is the best time for Do Dham Yatra?", answer: "May to June and September to October offer the clearest skies and pleasant mountain weather." }
    ]
  },
  {
    sNo: 11,
    title: "Char Dham Yatra Package 11 Nights 12 Days",
    slug: "char-dham-yatra-package-11-nights-12-days",
    primaryKeyword: "Char Dham Yatra package 11 nights 12 days",
    metaTitle: "Char Dham Yatra Package 11 Nights 12 Days | Darshan Tour",
    metaDescription: "Book an 11 nights 12 days Char Dham Yatra package. Covers Yamunotri, Gangotri, Kedarnath, and Badrinath with Haridwar pickup, stays, and cabs. Book today!",
    metaKeywords: "char dham yatra package 11 nights 12 days, 11 nights 12 days char dham itinerary, char dham yatra from haridwar 12 days, uttarakhand char dham tour package, char dham package 11n 12d",
    location: "Yamunotri, Gangotri, Kedarnath & Badrinath, Uttarakhand",
    region: "Uttarakhand",
    duration: "12 Days / 11 Nights",
    price: 38999,
    originalPrice: 46999,
    badge: "Complete Char Dham",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1600&q=80",
    tagline: "The supreme Himalayan pilgrimage: Complete yatra of Yamunotri, Gangotri, Kedarnath & Badrinath in 12 days.",
    overview: "Undertake the holiest Hindu pilgrimage across the four sacred shrines of Uttarakhand. Travel in comfort with experienced hill chauffeurs, verified hotels, and seamless darshan coordination.",
    highlights: [
      "Yamunotri Dham: Origin of sacred Yamuna river & Surya Kund",
      "Gangotri Dham: Origin of holy Bhagirathi & Submerged Shivling",
      "Kedarnath Dham: Holy Jyotirlinga surrounded by snow peaks",
      "Badrinath Dham: Abode of Lord Badri Narayan and Tapt Kund",
      "Visit Mana Village, Devprayag, and Rishikesh Ganga Aarti"
    ],
    itinerary: [
      { day: 1, title: "Haridwar to Barkot", description: "Pickup and scenic drive to Barkot overlooking Bandarpoonch peak.", stay: "Barkot Hotel", meal: "Dinner" },
      { day: 2, title: "Barkot to Yamunotri & Return", description: "Trek 6 km to Yamunotri temple, holy dip, darshan, and return to Barkot.", stay: "Barkot Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Barkot to Uttarkashi", description: "Drive to Uttarkashi and visit ancient Kashi Vishwanath temple.", stay: "Uttarkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Uttarkashi to Gangotri & Return", description: "Drive along picturesque Bhagirathi river to Gangotri temple, darshan, and return.", stay: "Uttarkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Uttarkashi to Guptkashi", description: "Scenic mountain drive past Tehri Dam region to Guptkashi.", stay: "Guptkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Guptkashi to Kedarnath", description: "Trek/helicopter to Kedarnath and attend evening Aarti.", stay: "Kedarnath Stay", meal: "Breakfast & Dinner" },
      { day: 7, title: "Kedarnath to Guptkashi", description: "Morning darshan and return trek/heli down to Guptkashi.", stay: "Guptkashi Hotel", meal: "Breakfast & Dinner" },
      { day: 8, title: "Guptkashi to Badrinath", description: "Drive via Chopta / Joshimath to Badrinath Dham.", stay: "Badrinath Hotel", meal: "Breakfast & Dinner" },
      { day: 9, title: "Badrinath Darshan & Mana Village", description: "Darshan, hot spring dip, and visit to Mana Village, Saraswati River origin.", stay: "Badrinath Hotel", meal: "Breakfast & Dinner" },
      { day: 10, title: "Badrinath to Rudraprayag", description: "Drive down to Rudraprayag viewing the Alaknanda and Mandakini confluence.", stay: "Rudraprayag Hotel", meal: "Breakfast & Dinner" },
      { day: 11, title: "Rudraprayag to Rishikesh", description: "Drive to Rishikesh and attend divine evening Triveni Ghat Ganga Aarti.", stay: "Rishikesh Hotel", meal: "Breakfast & Dinner" },
      { day: 12, title: "Rishikesh to Haridwar Departure", description: "Transfer to Haridwar Railway Station for onward journey.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "11 Nights hotel stays",
      "Daily breakfast and dinner (pure vegetarian)",
      "Dedicated private AC vehicle throughout the trip",
      "Yatra registration and biometric pass assistance"
    ],
    exclusions: [
      "Helicopter tickets, horse/palki charges",
      "Special puja fees"
    ],
    faqs: [
      { question: "Are medical certificates required for Char Dham?", answer: "Yes, travelers above 50 years are advised to get a basic health checkup done before the high altitude yatra." }
    ]
  },
  {
    sNo: 12,
    title: "Ooty Tour Package 3 Nights 4 Days",
    slug: "ooty-tour-package-3-nights-4-days",
    primaryKeyword: "Ooty tour package 3 nights 4 days",
    metaTitle: "Ooty Tour Package 3 Nights 4 Days | Coonoor & Tea Hills",
    metaDescription: "Book our 3 nights 4 days Ooty tour package. Visit Doddabetta Peak, Pykara Lake, Sim's Park Coonoor, tea gardens, and Nilgiri toy train. Get best deals now!",
    metaKeywords: "ooty tour package 3 nights 4 days, 3 nights 4 days ooty itinerary, ooty coonoor tour package, ooty holiday package 4 days, ooty trip 3n 4d, ooty travel package",
    location: "Ooty & Coonoor, Tamil Nadu",
    region: "South India",
    duration: "4 Days / 3 Nights",
    price: 14999,
    originalPrice: 18999,
    badge: "Queen of Nilgiris",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80",
    tagline: "Rolling Nilgiri tea estates, heritage toy train rides, pine forests, and cool mountain weather.",
    overview: "Escape to South India's favorite hill station. Ride the historic UNESCO Nilgiri Mountain Railway, visit aromatic tea factories, enjoy boating at Pykara Lake, and explore botanical gardens in Ooty and Coonoor.",
    highlights: [
      "Panoramic views from Doddabetta Peak (highest in Nilgiris)",
      "UNESCO World Heritage Nilgiri Mountain Toy Train ride",
      "Speed boating at scenic Pykara Lake and waterfalls",
      "Stroll through sprawling Ooty Botanical & Rose Gardens",
      "Explore Dolphin's Nose & Sim's Park in Coonoor"
    ],
    itinerary: [
      { day: 1, title: "Coimbatore / Bangalore to Ooty Transfer", description: "Pickup and scenic drive through Nilgiri hairpin bends to Ooty. Check in and visit Ooty Lake.", stay: "Ooty Hotel", meal: "Dinner" },
      { day: 2, title: "Ooty Sights & Doddabetta Peak", description: "Visit Doddabetta Peak, Tea Factory & Museum, Rose Garden, and Botanical Gardens.", stay: "Ooty Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Coonoor Day Excursion & Toy Train Ride", description: "Take the heritage Toy Train to Coonoor. Visit Sim's Park, Lamb's Rock, and Dolphin's Nose.", stay: "Ooty Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Pykara Waterfalls & Departure", description: "Visit Pine Forest and Pykara Lake for boating before departure to Coimbatore Airport/Station.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "3 Nights hotel accommodation in Ooty",
      "Daily breakfast and dinner",
      "Private AC cab for all transfers and sightseeing",
      "All tolls, driver allowance, and parking"
    ],
    exclusions: [
      "Toy train tickets (subject to railway availability)",
      "Entry and boating tickets"
    ],
    faqs: [
      { question: "Which airport is closest to Ooty?", answer: "Coimbatore Airport (CJB) is approximately 85 km (3 hours drive) from Ooty." }
    ]
  },
  {
    sNo: 13,
    title: "Manali Tour Package 4 Nights 5 Days  4 Nights",
    slug: "manali-tour-package-4-nights-5-days",
    primaryKeyword: "Manali tour package 4 nights 5 days",
    metaTitle: "Manali Tour Package 4 Nights 5 Days | Solang & Snow Point",
    metaDescription: "Book our 4 nights 5 days Manali tour package. Enjoy Solang Valley snow sports, Hadimba Temple, Atal Tunnel, Mall Road, and scenic cab transfers. Book now!",
    metaKeywords: "manali tour package 4 nights 5 days, 4 nights 5 days manali itinerary, manali holiday package 5 days, manali solang valley tour package, manali trip package 4n 5d",
    location: "Manali & Solang Valley, Himachal Pradesh",
    region: "Himachal Pradesh",
    duration: "5 Days / 4 Nights",
    price: 15999,
    originalPrice: 19999,
    badge: "Snow & Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
    tagline: "Towering snow peaks, Solang Valley adventure sports, Atal Tunnel drive, Hadimba temple & vibrant Mall Road.",
    overview: "Experience the magic of Himachal Pradesh in Manali. Enjoy snow activities at Solang Valley, drive through the historic Atal Tunnel into Sissu (Lahaul Valley), and relax by the roaring Beas River.",
    highlights: [
      "Thrilling adventure sports in Solang Valley (paragliding, skiing, zorbing)",
      "Scenic drive through the world's longest highway tunnel — Atal Tunnel",
      "Visit ancient wooden Hadimba Devi Temple amidst giant deodars",
      "Relax in natural hot sulfur springs at Vashisht village",
      "Evening cafe hopping and shopping on Manali Mall Road"
    ],
    itinerary: [
      { day: 1, title: "Delhi / Chandigarh to Manali Transfer", description: "Pickup and scenic drive past Mandi and Kullu to Manali. Check in and evening at leisure.", stay: "Manali Hotel", meal: "Dinner" },
      { day: 2, title: "Manali Local Sightseeing & Old Manali", description: "Visit Hadimba Temple, Manu Temple, Club House, Vashisht hot springs, and Mall Road.", stay: "Manali Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Solang Valley & Atal Tunnel Excursion", description: "Full day excursion to Solang Valley for snow activities and drive through Atal Tunnel to Sissu waterfall.", stay: "Manali Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Naggar Castle & Kullu River Rafting", description: "Visit historic Naggar Castle and enjoy river rafting in Kullu along the Beas River.", stay: "Manali Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Departure to Delhi / Chandigarh", description: "Check out and drive back with memorable Himalayan stories.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "4 Nights accommodation in 3-star resort",
      "Daily breakfast and dinner",
      "Private vehicle for all transfers and tours",
      "Green tax and all driver allowances"
    ],
    exclusions: [
      "Rohtang Pass permit and taxi (if required separately)",
      "Adventure activities expenses"
    ],
    faqs: [
      { question: "Is snow available in Manali year-round?", answer: "Snow is available in Solang/Rohtang/Sissu between December and May." }
    ]
  },
  {
    sNo: 14,
    title: "Shimla Tour Package   3 Nights 4 Days",
    slug: "shimla-tour-package-3-nights-4-days",
    primaryKeyword: "Shimla tour package 3 nights 4 days",
    metaTitle: "Shimla Tour Package 3 Nights 4 Days | Kufri & Mall Road",
    metaDescription: "Book our 3 nights 4 days Shimla tour package. Explore Mall Road, Ridge, Kufri snow views, Jakhoo Temple, and scenic mountain drives. Get the best rates now!",
    metaKeywords: "shimla tour package 3 nights 4 days, 3 nights 4 days shimla itinerary, shimla kufri tour package, shimla holiday package 4 days, shimla trip 3n 4d, shimla travel package",
    location: "Shimla & Kufri, Himachal Pradesh",
    region: "Himachal Pradesh",
    duration: "4 Days / 3 Nights",
    price: 12999,
    originalPrice: 16999,
    badge: "Colonial Queen",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=80",
    tagline: "Victorian colonial architecture, heritage Mall Road, Jakhoo hilltop Hanuman temple & snow-clad Kufri.",
    overview: "Relive the colonial elegance of the erstwhile summer capital of British India. Stroll along the pedestrian-only Ridge, take the Jakhoo ropeway, and enjoy mountain adventures in Kufri.",
    highlights: [
      "Scenic walk on Mall Road, Christ Church, and The Ridge",
      "Fun adventure rides and horse riding at Kufri Fun World",
      "Visit Jakhoo Hill & giant 108 ft Lord Hanuman statue",
      "Explore Viceregal Lodge (Indian Institute of Advanced Study)",
      "Handpicked comfortable hill resort accommodation"
    ],
    itinerary: [
      { day: 1, title: "Chandigarh / Delhi to Shimla Drive", description: "Scenic drive ascending into pine hills. Check in and take evening stroll on Mall Road.", stay: "Shimla Hotel", meal: "Dinner" },
      { day: 2, title: "Kufri Adventure & Chail Excursion", description: "Visit Kufri snow viewpoint, Himalayan Wildlife Zoo, and horse riding to Mahasu Peak.", stay: "Shimla Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Shimla Heritage & Cultural Walk", description: "Visit Jakhoo Temple, Viceregal Lodge, Annandale, and Lakkar Bazaar.", stay: "Shimla Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Departure via Pinjore Gardens", description: "Check out and transfer back to Chandigarh / Delhi.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "3 Nights stay in verified hotel",
      "Daily breakfast and dinner",
      "Private AC cab for pickup, drop, and sightseeing",
      "All toll, parking, and driver allowance"
    ],
    exclusions: [
      "Kufri horse riding or adventure park tickets",
      "Jakhoo cable car tickets"
    ],
    faqs: [
      { question: "Can we experience snowfall in Shimla?", answer: "Snowfall typically occurs between late December and early February in Shimla and Kufri." }
    ]
  },
  {
    sNo: 15,
    title: "Jaisalmer Tour Package  3 Nights 4 Days",
    slug: "jaisalmer-tour-package-3-nights-4-days",
    aliasSlugs: ["jaisalmer-tour-package"],
    primaryKeyword: "Jaisalmer tour package 3 nights 4 days",
    metaTitle: "Jaisalmer Tour Package 3 Nights 4 Days | Desert Safari",
    metaDescription: "Book our 3 nights 4 days Jaisalmer tour package. Enjoy Sam sand dunes camping, camel safari, Golden Fort, Patwon Ki Haveli & folk dance. Get best rates now!",
    metaKeywords: "jaisalmer tour package 3 nights 4 days, 3 nights 4 days jaisalmer itinerary, jaisalmer desert safari package, sam sand dunes camping 4 days, jaisalmer trip 3n 4d"
  },
  {
    sNo: 16,
    title: "Meghalaya tour package  5 Nights  6 Days ",
    slug: "meghalaya-tour-package-5-nights-6-days",
    aliasSlugs: ["meghalaya-tour-package"],
    primaryKeyword: "Meghalaya tour package 5 nights 6 days",
    metaTitle: "Meghalaya Tour Package 5 Nights 6 Days | Waterfalls & Root",
    metaDescription: "Book a 5 nights 6 days Meghalaya tour package. Explore Shillong, Cherrapunji waterfalls, Double Decker Root Bridge, and crystal-clear Dawki river. Book now!",
    metaKeywords: "meghalaya tour package 5 nights 6 days, 5 nights 6 days meghalaya itinerary, shillong cherrapunji dawki package, double decker root bridge tour, meghalaya holiday package 6 days"
  },
  {
    sNo: 17,
    title: " Sikkim Tour Package 5 Nights 6 Days ",
    slug: "sikkim-tour-package-5-nights-6-days",
    aliasSlugs: ["sikkim-tour-package"],
    primaryKeyword: "Sikkim tour package 5 nights 6 days",
    metaTitle: "Sikkim Tour Package 5 Nights 6 Days | Gangtok & Lachung",
    metaDescription: "Book our 5 nights 6 days Sikkim tour package. Explore Gangtok, glacial Tsomgo Lake, Yumthang Valley of Flowers, and Lachung waterfalls. Get best rates now!",
    metaKeywords: "sikkim tour package 5 nights 6 days, 5 nights 6 days sikkim itinerary, gangtok lachung tour package, tsomgo lake tour package, sikkim holiday package 6 days, sikkim trip 5n 6d"
  },
  {
    sNo: 18,
    title: "Assam Tour Package 5 Nights 6 Days ",
    slug: "assam-tour-package-5-nights-6-days",
    aliasSlugs: ["assam-tour-package"],
    primaryKeyword: "Assam tour package 5 nights 6 days",
    metaTitle: "Assam Tour Package 5 Nights 6 Days | Kaziranga & Brahmaputra",
    metaDescription: "Book our 5 nights 6 days Assam tour package. Experience Kaziranga rhino jeep safari, Kamakhya Temple, lush tea gardens, and Brahmaputra river cruise. Book now!",
    metaKeywords: "assam tour package 5 nights 6 days, 5 nights 6 days assam itinerary, kaziranga national park tour package, guwahati kaziranga tour, assam wildlife package 6 days, assam trip 5n 6d"
  },
  {
    sNo: 19,
    title: "Jaipur Tour Package 2 Nights 3 Days",
    slug: "jaipur-tour-package-2-nights-3-days",
    aliasSlugs: ["jaipur-tour-package"],
    primaryKeyword: "Jaipur tour package 2 nights 3 days",
    metaTitle: "Jaipur Tour Package 2 Nights 3 Days | Forts & Pink City",
    metaDescription: "Book our 2 nights 3 days Jaipur tour package. Explore Amber Fort, Hawa Mahal, City Palace, Jal Mahal & vibrant bazaars. Enjoy private cabs & comfortable stays!",
    metaKeywords: "jaipur tour package 2 nights 3 days, 2 nights 3 days jaipur itinerary, jaipur weekend tour package, jaipur sightseeing package 3 days, pink city tour 2n 3d, jaipur trip package"
  },
  {
    sNo: 20,
    title: "Maharashtra Tour Package 4 Nights 5 Days",
    slug: "maharashtra-tour-package-4-nights-5-days",
    aliasSlugs: ["maharashtra-tour-package"],
    primaryKeyword: "Maharashtra tour package 4 nights 5 days",
    metaTitle: "Maharashtra Tour Package 4 Nights 5 Days | Hill Stations",
    metaDescription: "Book our 4 nights 5 days Maharashtra tour package. Explore Lonavala, Khandala, Mahabaleshwar viewpoints, and Panchgani strawberry farms. Get best rates now!",
    metaKeywords: "maharashtra tour package 4 nights 5 days, 4 nights 5 days maharashtra itinerary, lonavala mahabaleshwar tour package, maharashtra holiday package 5 days, mumbai lonavala mahabaleshwar tour, maharashtra trip 4n 5d"
  },
  {
    sNo: 21,
    title: "Kerala Tour Package 5 Nights 6 Days",
    slug: "kerala-tour-package-5-nights-6-days",
    aliasSlugs: ["kerala-tour-package"],
    primaryKeyword: "Kerala tour package 5 nights 6 days",
    metaTitle: "Kerala Tour Package 5 Nights 6 Days | Hills & Houseboat",
    metaDescription: "Book our 5 nights 6 days Kerala tour package. Visit misty Munnar tea gardens, Thekkady wildlife, and enjoy an Alleppey backwater houseboat stay. Book today!",
    metaKeywords: "kerala tour package 5 nights 6 days, 5 nights 6 days kerala itinerary, munnar thekkady alleppey tour package, kerala holiday package 6 days, kerala houseboat trip 5n 6d, kerala travel package"
  },
  {
    sNo: 22,
    title: "Jim Corbett Nainital Kainchi Dham Tour Package  5 Days 4 Nights",
    slug: "jim-corbett-nainital-kainchi-dham-tour-package",
    primaryKeyword: "Jim Corbett Nainital Kainchi Dham tour package 4 nights 5 days",
    metaTitle: "Corbett Nainital Kainchi Dham Tour | 4 Nights 5 Days Trip",
    metaDescription: "Book our 4 nights 5 days Jim Corbett, Nainital & Kainchi Dham tour. Enjoy jungle safari, Naini Lake, Mall Road & Neem Karoli Baba Ashram darshan. Book now!",
    metaKeywords: "jim corbett nainital kainchi dham tour package 4 nights 5 days, kainchi dham neem karoli baba tour package, nainital corbett tour package 4n 5d, corbett jungle safari nainital trip 5 days, corbett nainital kainchi dham itinerary",
    location: "Jim Corbett, Nainital & Kainchi Dham, Uttarakhand",
    region: "Uttarakhand",
    duration: "5 Days / 4 Nights",
    price: 17999,
    originalPrice: 22999,
    badge: "Safari & Spiritual",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80",
    tagline: "Bengal tiger jungle jeep safari in Corbett, serene Naini Lake boating & divine darshan at Neem Karoli Baba Kainchi Dham Ashram.",
    overview: "The most sought-after Kumaon circuit combining untamed wildlife, sparkling mountain lakes, and spiritual bliss. Seek blessings at Neem Karoli Baba Ashram, embark on open 4x4 Gypsy jungle safari in Jim Corbett, and unwind by the lake in Nainital.",
    highlights: [
      "Open 4x4 Gypsy Jeep Safari in Corbett National Park tiger territory",
      "Darshan at sacred Kainchi Dham Ashram of Neem Karoli Baba",
      "Boat ride on picturesque Naini Lake and visit to Naina Devi Temple",
      "Visit Corbett Waterfall, Garjiya Devi Temple, and Bhimtal lake",
      "Comfortable resort stays with private chauffeur throughout"
    ],
    itinerary: [
      { day: 1, title: "Delhi to Jim Corbett National Park", description: "Pickup from Delhi. Drive to Jim Corbett. Check in to jungle resort. Evening nature walk and swimming pool relaxation.", stay: "Corbett Jungle Resort", meal: "Dinner" },
      { day: 2, title: "Morning Jungle Safari & Transfer to Nainital", description: "Early morning open Jeep Safari in Corbett forest zone. Return for breakfast and drive to Nainital. Evening boat ride.", stay: "Nainital Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Sacred Kainchi Dham Pilgrimage & Lake Tour", description: "Visit the holy Kainchi Dham Ashram of Neem Karoli Baba. En route explore Bhimtal and Sattal.", stay: "Nainital Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Nainital Local Exploration & Viewpoints", description: "Explore Snow View Point, Eco Cave Gardens, Mall Road, and Tibetan Market.", stay: "Nainital Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Nainital to Delhi Departure", description: "Check out after breakfast and drive back to Delhi with blessed memories.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "4 Nights accommodation (1N Corbett + 3N Nainital)",
      "Daily breakfast and dinner",
      "1 Jim Corbett Open Jeep Safari with permits and guide",
      "Private AC transport from Delhi to Delhi"
    ],
    exclusions: [
      "Jeep safari camera charges",
      "Boating tickets in Nainital"
    ],
    faqs: [
      { question: "Is advance booking required for Kainchi Dham and Safari?", answer: "Yes, Corbett safari permits and Nainital resort stays should be booked at least 2 weeks in advance." }
    ]
  },
  {
    sNo: 23,
    title: "AULI TOUR PACKAGE  3 NIGHTS  4 DAYS",
    slug: "auli-tour-package-from-dehradun-3-nights-4-days",
    primaryKeyword: "Auli tour package 3 nights 4 days",
    metaTitle: "Auli Tour Package 3 Nights 4 Days | Snow Peaks & Ropeway",
    metaDescription: "Book our 3 nights 4 days Auli tour package. Experience the scenic ropeway ride, skiing slopes, Nanda Devi views, Gorson Bugyal & Joshimath stay. Book now!",
    metaKeywords: "auli tour package 3 nights 4 days, 3 nights 4 days auli itinerary, auli skiing package 4 days, auli trip 3n 4d, auli holiday package, auli ropeway tour package",
    location: "Auli & Joshimath, Uttarakhand",
    region: "Uttarakhand",
    duration: "4 Days / 3 Nights",
    price: 15499,
    originalPrice: 19999,
    badge: "Ski Paradise",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    tagline: "India's premier skiing destination, Asia's longest cable car ropeway, artificial lake & 180° views of Nanda Devi peak.",
    overview: "Witness the snowy wonderland of Auli perched at 9,500 to 10,500 ft. Ride the breathtaking Joshimath-Auli ropeway, trek to pristine alpine meadow Gorson Bugyal, and marvel at panoramic Himalayan giants.",
    highlights: [
      "Asia's longest 4 km cable car ropeway ride from Joshimath to Auli",
      "Panoramic views of Mt. Nanda Devi (India's 2nd highest peak), Dunagiri & Trishul",
      "Skiing lessons on powdery slopes (seasonal December to March)",
      "Trek to Gorson Bugyal meadow and artificial alpine lake",
      "Stay in authentic wooden cliff cabins and hill resorts"
    ],
    itinerary: [
      { day: 1, title: "Dehradun / Rishikesh to Joshimath Scenic Drive", description: "Scenic drive along Devprayag, Srinagar, and Karnaprayag rivers to Joshimath. Check in and relax.", stay: "Joshimath Hotel", meal: "Dinner" },
      { day: 2, title: "Joshimath to Auli Ropeway & Snow Slopes", description: "Board the cable car to Auli (Cliff Top). Enjoy skiing, snow play, and walk by Auli artificial lake.", stay: "Auli / Joshimath Resort", meal: "Breakfast & Dinner" },
      { day: 3, title: "Gorson Bugyal Trek & Sunset Viewpoint", description: "Gentle 3 km trek to Gorson Bugyal meadows surrounded by towering peaks. Evening sunset over Nanda Devi.", stay: "Joshimath Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Joshimath to Dehradun / Rishikesh Departure", description: "Drive back along the mountain highway with unforgettable snow memories.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "3 Nights accommodation",
      "Daily breakfast and hot dinner",
      "Private AC transport from Dehradun/Rishikesh",
      "All driver allowance, parking, and toll taxes"
    ],
    exclusions: [
      "Cable car (ropeway) tickets and chairlift tickets",
      "Skiing equipment rental and ski instructor fees"
    ],
    faqs: [
      { question: "When is the best time for skiing in Auli?", answer: "Late December through early March has the deepest snow coverage for skiing." }
    ]
  },
  {
    sNo: 24,
    title: "Agra Taj Mahal Tour Package  2 Nights 3 Days",
    slug: "agra-tour-package-2-nights-3-days",
    primaryKeyword: "Agra Taj Mahal tour package 2 nights 3 days",
    metaTitle: "Agra Taj Mahal Tour Package 2N/3D | Fort & Fatehpur Sikri",
    metaDescription: "Book our 2 nights 3 days Agra Taj Mahal tour package. Experience sunrise at Taj Mahal, Agra Fort, Mehtab Bagh & Fatehpur Sikri with private cab. Book today!",
    metaKeywords: "agra taj mahal tour package 2 nights 3 days, 2 nights 3 days agra itinerary, taj mahal agra fort tour package, fatehpur sikri agra tour 3 days, agra trip 2n 3d, agra travel package",
    location: "Agra & Fatehpur Sikri, Uttar Pradesh",
    region: "Golden Triangle",
    duration: "3 Days / 2 Nights",
    price: 8999,
    originalPrice: 11999,
    badge: "World Wonder",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
    tagline: "Sunrise at the white marble wonder Taj Mahal, massive red sandstone Agra Fort & deserted Mughal city Fatehpur Sikri.",
    overview: "Marvel at the greatest monument of love. Watch the changing colors of the Taj Mahal at dawn, explore the UNESCO World Heritage Agra Fort, and wander the historic courtyards of Fatehpur Sikri.",
    highlights: [
      "Magical sunrise viewing of the iconic Taj Mahal",
      "Guided tour of red sandstone Agra Fort & Jahangir Mahal",
      "Excursion to the ghost city of Emperor Akbar — Fatehpur Sikri & Buland Darwaza",
      "Sunset view of Taj Mahal across Yamuna river from Mehtab Bagh",
      "Sample famous Agra Petha and visit Mughal marble inlay art workshops"
    ],
    itinerary: [
      { day: 1, title: "Delhi to Agra Drive & Mehtab Bagh Sunset", description: "Pickup from Delhi via Yamuna Expressway. Check in at Agra hotel. Evening visit to Mehtab Bagh for sunset view of Taj Mahal.", stay: "Agra Hotel", meal: "Dinner" },
      { day: 2, title: "Sunrise at Taj Mahal & Agra Fort", description: "Early morning visit to Taj Mahal at sunrise. Return for breakfast. Explore Agra Fort and Itimad-ud-Daulah (Baby Taj).", stay: "Agra Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Fatehpur Sikri Excursion & Return to Delhi", description: "Drive to Fatehpur Sikri, Buland Darwaza, and Salim Chishti Dargah. Proceed to Delhi Airport/Station.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "2 Nights stay in 3-star boutique hotel in Agra",
      "Daily breakfast and dinner",
      "Private AC transport from Delhi to Delhi",
      "All expressway tolls, parking, and driver allowance"
    ],
    exclusions: [
      "Taj Mahal and monument entry tickets",
      "Personal shopping and guide fees"
    ],
    faqs: [
      { question: "Is Taj Mahal closed on Fridays?", answer: "Yes, Taj Mahal is closed every Friday for general visitors." }
    ]
  },
  {
    sNo: 25,
    title: "Sikkim Darjeeling Tour Package 5 Nights 6 Days",
    slug: "sikkim-darjeeling-tour-package-5-nights-6-days",
    primaryKeyword: "Sikkim Darjeeling tour package 5 nights 6 days",
    metaTitle: "Sikkim Darjeeling Tour Package 5N/6D | Hills & Tea Gardens",
    metaDescription: "Book our 5 nights 6 days Sikkim Darjeeling tour package. Experience Tiger Hill sunrise, Batasia Loop, Gangtok sights & glacial Tsomgo Lake. Get quotes now!",
    metaKeywords: "sikkim darjeeling tour package 5 nights 6 days, 5 nights 6 days sikkim darjeeling itinerary, gangtok darjeeling tour package 6 days, tiger hill darjeeling tour, sikkim darjeeling holiday package 5n 6d",
    location: "Gangtok & Darjeeling, Sikkim & West Bengal",
    region: "Eastern Himalayas",
    duration: "6 Days / 5 Nights",
    price: 23999,
    originalPrice: 28999,
    badge: "Himalayan Sunrise",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    tagline: "Golden sunrise over Mt. Kanchenjunga from Tiger Hill, heritage Darjeeling Toy Train & glacial Tsomgo Lake in Sikkim.",
    overview: "Explore the jewels of the Eastern Himalayas. From aromatic tea gardens and British heritage in Darjeeling to vibrant Buddhist monasteries and high-altitude glacial lakes in Gangtok.",
    highlights: [
      "Spectacular 4:00 AM sunrise over Mt. Kanchenjunga from Tiger Hill",
      "Ride the UNESCO World Heritage Darjeeling Himalayan Toy Train",
      "High-altitude glacial Tsomgo Lake (12,400 ft) & Baba Harbhajan Mandir",
      "Visit Rumtek & Enchey Monasteries with peaceful prayer halls",
      "Stroll along vibrant pedestrian MG Marg in Gangtok"
    ],
    itinerary: [
      { day: 1, title: "Bagdogra / NJP to Gangtok Scenic Drive", description: "Pickup and scenic drive along Teesta river to Gangtok (5,500 ft). Evening walk on MG Marg.", stay: "Gangtok Hotel", meal: "Dinner" },
      { day: 2, title: "Excursion to Tsomgo Lake & Baba Mandir", description: "Drive up to glacial Tsomgo Lake (12,400 ft) and sacred Baba Mandir near Nathu La border pass.", stay: "Gangtok Hotel", meal: "Breakfast & Dinner" },
      { day: 3, title: "Gangtok Local Sights to Darjeeling", description: "Visit Do Drul Chorten, Namgyal Tibetology, and drive through tea hills to Darjeeling (6,700 ft).", stay: "Darjeeling Hotel", meal: "Breakfast & Dinner" },
      { day: 4, title: "Tiger Hill Sunrise & Darjeeling 7 Points", description: "Early morning Tiger Hill sunrise. Later visit Batasia Loop, Ghoom Monastery, Padmaja Naidu Zoo & Mountaineering Institute.", stay: "Darjeeling Hotel", meal: "Breakfast & Dinner" },
      { day: 5, title: "Mirik Lake & Pashupati Market Excursion", description: "Day trip to picturesque Mirik lake and Indo-Nepal border at Pashupati.", stay: "Darjeeling Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Departure to Bagdogra Airport (IXB)", description: "Transfer to Bagdogra Airport or New Jalpaiguri Railway Station with sweet tea memories.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "5 Nights accommodation (3N Gangtok + 2N Darjeeling)",
      "Daily breakfast and dinner",
      "Private vehicle for all transfers and excursions",
      "Tsomgo Lake permits"
    ],
    exclusions: [
      "Nathu La Pass permit (subject to army permits)",
      "Toy Train joyride ticket"
    ],
    faqs: [
      { question: "Do Indian nationals need permits for Sikkim?", answer: "Indian tourists need permits only for protected areas like Tsomgo Lake and Nathu La, which we arrange seamlessly." }
    ]
  },
  {
    sNo: 26,
    title: "Goa Tour Package 4 Nights 5 Days",
    slug: "goa-tour-package-4-nights-5-days",
    aliasSlugs: ["goa-tour-package"],
    primaryKeyword: "Goa tour package 4 nights 5 days",
    metaTitle: "Goa Tour Package 4 Nights 5 Days | Beach & Heritage Trip",
    metaDescription: "Book our 4 nights 5 days Goa tour package. Explore North & South Goa beaches, historic forts, Dudhsagar Falls, and Mandovi River cruise. Custom plans available!",
    metaKeywords: "goa tour package 4 nights 5 days, 5 days goa trip, north goa tour package, south goa holiday package, dudhsagar waterfall trip, goa vacation itinerary"
  },
  {
    sNo: 27,
    title: "Jaisalmer Desert Tour Package 2 Nights 3 Days",
    slug: "jaisalmer-desert-tour-2-nights-3-days",
    primaryKeyword: "Jaisalmer Desert Tour Package 2 Nights 3 Days",
    metaTitle: "Jaisalmer Desert Tour Package 2N/3D | Safari & Camp Stays",
    metaDescription: "Book our 2 nights 3 days Jaisalmer desert tour package. Enjoy Sam sand dunes camping, sunset camel safari, Rajasthani folk dance & fort tour. Book online!",
    metaKeywords: "jaisalmer desert tour package 2 nights 3 days, 2 nights 3 days jaisalmer desert itinerary, sam sand dunes tour package 3 days, jaisalmer desert camp safari package, jaisalmer trip 2n 3d, jaisalmer desert holiday package",
    location: "Jaisalmer & Sam Sand Dunes, Rajasthan",
    region: "Rajasthan",
    duration: "3 Days / 2 Nights",
    price: 9499,
    originalPrice: 12499,
    badge: "Desert Magic",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80",
    tagline: "Golden sandstone fort living city, sunset camel safari in rolling Sam dunes & royal Swiss tent camp with folk music.",
    overview: "Experience the timeless romance of the Thar Desert. Spend one night inside the historic golden city and one night under a million stars at luxury desert camps in Sam Sand Dunes.",
    highlights: [
      "Overnight luxury Swiss tent stay with bonfire & Rajasthani Kalbelia dance",
      "Sunset camel safari & thrilling 4x4 Jeep dune bashing on Sam Sand Dunes",
      "Guided tour of the living Golden Fort (Sonar Qila)",
      "Admire intricately carved Patwon Ki Haveli & Salim Singh Ki Haveli",
      "Boating at peaceful Gadisar Lake surrounded by chhatris"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaisalmer & Golden City Sights", description: "Pickup and check in to hotel. Visit Jaisalmer Golden Fort, Jain Temples, and sunset at Gadisar Lake.", stay: "Jaisalmer City Hotel", meal: "Dinner" },
      { day: 2, title: "Havelis & Sam Sand Dunes Desert Camp", description: "Visit Patwon Ki Haveli and drive to Sam Sand Dunes. Enjoy sunset camel safari, cultural dance show, and grand buffet dinner.", stay: "Sam Sand Dunes Swiss Camp", meal: "Breakfast & Dinner" },
      { day: 3, title: "Desert Sunrise & Departure", description: "Witness golden desert sunrise. Return to Jaisalmer for railway station / airport drop.", stay: "Return Journey", meal: "Breakfast" }
    ],
    inclusions: [
      "2 Nights stay (1N Hotel + 1N Desert Camp)",
      "Daily breakfast and dinner (with evening snacks and tea)",
      "Camel safari and cultural folk music show",
      "Private AC vehicle for all transfers"
    ],
    exclusions: [
      "Jeep dune bashing and quad biking (optional)",
      "Monument entrance fees"
    ],
    faqs: [
      { question: "Is desert camping safe for families?", answer: "Yes, our partner camps feature private enclosed luxury Swiss tents with attached bathrooms, electricity, and security." }
    ]
  },
  {
    sNo: 28,
    title: "Andaman Tour Package 5 Nights 6 Days",
    slug: "andaman-tour-package-5-nights-6-days",
    primaryKeyword: "Andaman tour package 5 nights 6 days",
    metaTitle: "Andaman Tour Package 5 Nights 6 Days | Havelock & Beaches",
    metaDescription: "Book our 5 nights 6 days Andaman tour package. Explore Cellular Jail, Radhanagar Beach, Havelock Island, coral reefs & water sports. Get the best rates now!",
    metaKeywords: "andaman tour package 5 nights 6 days, 5 nights 6 days andaman itinerary, port blair havelock tour package, andaman beach holiday package 6 days, andaman trip 5n 6d, andaman travel package",
    location: "Port Blair, Havelock Island & Neil Island, Andaman",
    region: "Andaman & Nicobar Islands",
    duration: "6 Days / 5 Nights",
    price: 29999,
    originalPrice: 35999,
    badge: "Tropical Beach Paradise",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    tagline: "Turquoise waters of Radhanagar Beach, Cellular Jail Light & Sound, private luxury cruise ferries & vibrant coral reefs.",
    overview: "Discover India's most breathtaking tropical paradise. Sail across the Bay of Bengal on high-speed private catamarans, snorkel over pristine coral gardens at Elephant Beach, and relax on Asia's best beach.",
    highlights: [
      "Sunset at Radhanagar Beach Havelock — voted Asia's best beach by TIME",
      "Moving Light and Sound show at historic Cellular Jail in Port Blair",
      "Snorkeling & water sports at vibrant coral reefs of Elephant Beach",
      "High-speed luxury catamaran cruise ferry transfers (Makruzz / Green Ocean)",
      "Explore natural rock formation bridge and Bharatpur beach at Neil Island"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Port Blair & Cellular Jail Light & Sound", description: "Arrive at Veer Savarkar Airport Port Blair. Check in and visit Cellular Jail. In the evening, witness the stirring Light & Sound show.", stay: "Port Blair Hotel", meal: "Dinner" },
      { day: 2, title: "Cruise to Havelock Island & Radhanagar Beach", description: "Board luxury ferry to Havelock Island. Afternoon sunset at world-famous Radhanagar Beach (Beach No. 7).", stay: "Havelock Beach Resort", meal: "Breakfast & Dinner" },
      { day: 3, title: "Elephant Beach Coral Reefs & Snorkeling", description: "Speed boat to Elephant Beach for complimentary snorkeling, sea walk, or jet ski rides.", stay: "Havelock Beach Resort", meal: "Breakfast & Dinner" },
      { day: 4, title: "Havelock to Neil Island (Shaheed Dweep)", description: "Cruise to tranquil Neil Island. Visit Bharatpur beach, Laxmanpur beach, and Natural Coral Rock Bridge.", stay: "Neil Island Resort", meal: "Breakfast & Dinner" },
      { day: 5, title: "Neil Island to Port Blair Return & Shopping", description: "Ferry return to Port Blair. Visit Sagarika cottage industries emporium for pearl and shell handicrafts.", stay: "Port Blair Hotel", meal: "Breakfast & Dinner" },
      { day: 6, title: "Port Blair Airport Departure", description: "Transfer to airport with tropical island memories.", stay: "Return Flight", meal: "Breakfast" }
    ],
    inclusions: [
      "5 Nights accommodation in verified beachfront resorts and hotels",
      "Daily breakfast and dinner",
      "All inter-island ferry tickets on premium private catamaran cruise",
      "Speed boat to Elephant Beach with basic snorkeling session",
      "All AC vehicle transfers on private basis"
    ],
    exclusions: [
      "Airfare to/from Port Blair",
      "Scuba diving / Sea walk charges (can be booked on site)"
    ],
    faqs: [
      { question: "Are passports or visas required for Indian nationals to visit Andaman?", answer: "No, valid government photo ID (Aadhaar / Voter ID / Passport) is sufficient for Indian citizens." }
    ]
  }
];

function runSync() {
  console.log('Starting sync for 28 spreadsheet packages...');
  
  // Load all-packages.json
  let packages = [];
  if (fs.existsSync(allPackagesPath)) {
    packages = JSON.parse(fs.readFileSync(allPackagesPath, 'utf8'));
  }
  console.log('Existing packages in all-packages.json:', packages.length);

  // Map existing packages by slug and aliases
  const pkgMap = new Map();
  packages.forEach((pkg, idx) => {
    const slug = (pkg.slug || '').toLowerCase().trim();
    pkgMap.set(slug, { pkg, idx });
  });

  let updatedCount = 0;
  let addedCount = 0;

  spreadsheetRows.forEach((row) => {
    const targetSlug = row.slug.toLowerCase().trim();
    let found = pkgMap.get(targetSlug);

    // Also check alias slugs if defined
    if (!found && row.aliasSlugs) {
      for (const alias of row.aliasSlugs) {
        if (pkgMap.has(alias.toLowerCase().trim())) {
          found = pkgMap.get(alias.toLowerCase().trim());
          break;
        }
      }
    }

    if (found) {
      // 1. Existing package: UPDATE ONLY META TAGS & KEYWORDS
      console.log(`[UPDATE META ONLY] Found existing package: "${found.pkg.name}" (${found.pkg.slug})`);
      found.pkg.metaTitle = row.metaTitle;
      found.pkg.metaDescription = row.metaDescription;
      found.pkg.metaKeywords = row.metaKeywords;
      found.pkg.primaryKeyword = row.primaryKeyword;
      // Ensure domestic packages stay cleanly classified as Domestic
      if (found.pkg.category === 'Domestic' || (found.pkg.categories && found.pkg.categories.includes('Domestic'))) {
        found.pkg.category = 'Domestic';
        if (!found.pkg.categories) found.pkg.categories = ['Domestic', 'Holiday Package'];
        if (!found.pkg.categories.includes('Domestic')) found.pkg.categories.unshift('Domestic');
      }
      updatedCount++;
    } else {
      // 2. New package from spreadsheet: ADD AS COMPLETE PACKAGE
      console.log(`[ADD NEW PACKAGE] Adding from spreadsheet: "${row.title}" (${row.slug})`);
      const newId = 1000 + row.sNo;
      const newPackage = {
        id: newId,
        slug: row.slug,
        name: row.title,
        category: "Domestic",
        categories: ["Domestic", "Holiday Package"],
        location: row.location || "India",
        region: row.region || "Domestic",
        duration: row.duration || "5 Nights / 6 Days",
        altitude: "Sightseeing",
        difficulty: "Leisure / Scenic",
        baseCamp: "Airport / Railway Station",
        distance: "Sightseeing Circuit",
        price: row.price || 14999,
        originalPrice: row.originalPrice || 19999,
        badge: row.badge || "Domestic Holiday",
        rating: 4.9,
        reviewCount: 45 + (row.sNo * 3),
        image: row.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
        gallery: [
          row.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80"
        ],
        tagline: row.tagline || `${row.title} with verified boutique stays, private transfers, and customized sightseeing.`,
        overview: row.overview || `Explore our premium ${row.title} designed for families, couples, and leisure explorers.`,
        highlights: row.highlights || [
          "Handpicked 3-star / 4-star boutique hotel accommodations",
          "Private sanitized vehicle for all airport transfers and sightseeing",
          "Daily breakfast and dinner included",
          "24/7 on-ground trip support from KRAD Global"
        ],
        itinerary: row.itinerary || [
          { day: 1, title: "Arrival & Check-in", description: "Arrival and hotel transfer.", meal: "Dinner" }
        ],
        inclusions: row.inclusions || [
          "Hotel accommodations on twin sharing",
          "Daily breakfast and dinner",
          "Private vehicle for all transfers and sightseeing",
          "All toll tax, parking, and driver allowance"
        ],
        exclusions: row.exclusions || [
          "Monument entry fees & personal expenses",
          "Airfare or train tickets"
        ],
        faqs: row.faqs || [
          {
            question: "Can this tour package be customized?",
            answer: "Yes! All tour packages can be customized based on your preferred travel dates, hotel choices, and group size."
          }
        ],
        batches: [
          { id: 1, startDate: "Upcoming Weekend", endDate: "Open Batch", slotsLeft: 12, price: row.price || 14999 }
        ],
        status: "Published",
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        metaKeywords: row.metaKeywords,
        primaryKeyword: row.primaryKeyword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      packages.push(newPackage);
      pkgMap.set(row.slug.toLowerCase().trim(), { pkg: newPackage, idx: packages.length - 1 });
      addedCount++;
    }
  });

  console.log(`\nSync Summary: ${updatedCount} packages updated with meta tags, ${addedCount} new packages added.`);
  console.log('Total packages now:', packages.length);

  // 1. Write back to data/all-packages.json
  fs.writeFileSync(allPackagesPath, JSON.stringify(packages, null, 2), 'utf8');
  console.log('Updated data/all-packages.json successfully.');

  // 2. Write to data/cms-store.json
  if (fs.existsSync(cmsStorePath)) {
    const store = JSON.parse(fs.readFileSync(cmsStorePath, 'utf8'));
    store.treks = packages;
    fs.writeFileSync(cmsStorePath, JSON.stringify(store, null, 2), 'utf8');
    console.log('Updated data/cms-store.json successfully.');
  }

  // 3. Update src/lib/travel-data.ts
  const tsContent = `// Autogenerated from official Google Docs content
export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude?: string;
  meal?: string;
  stay?: string;
  distance?: string;
  duration?: string;
  [key: string]: any;
}

export interface TrekBatch {
  id: number;
  startDate: string;
  endDate: string;
  slotsLeft: number;
  price: number;
  [key: string]: any;
}

export interface TrekFAQ {
  question: string;
  answer: string;
  [key: string]: any;
}

export interface TrekData {
  id: number;
  slug: string;
  name: string;
  category: string;
  categories: string[];
  location: string;
  region: string;
  duration: string;
  altitude: string;
  difficulty: string;
  price: number;
  originalPrice: number;
  badge: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  tagline?: string;
  overview?: string;
  highlights?: string[];
  itinerary?: TrekItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: TrekFAQ[];
  batches?: TrekBatch[];
  status?: "Published" | "Draft";
  file?: string;
  defaultHighlights?: string[];
  baseCamp?: string;
  distance?: string;
  imageAlt?: string;
  createdAt?: string;
  updatedAt?: string;
  travelTips?: any[];
  costFactors?: string[];
  bookingPolicy?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  primaryKeyword?: string;
  [key: string]: any;
}

export const treks: TrekData[] = ${JSON.stringify(packages, null, 2)};
`;
  fs.writeFileSync(travelDataPath, tsContent, 'utf8');
  console.log('Updated src/lib/travel-data.ts successfully.');

  // 4. Sync to MongoDB
  syncMongo(packages);
}

async function syncMongo(packages) {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('flight_search');
    const col = db.collection('kradind_treks');
    await col.deleteMany({});
    await col.insertMany(packages);
    console.log(`Successfully synced ${packages.length} packages to MongoDB kradind_treks!`);
    await client.close();
  } catch (err) {
    console.error('MongoDB sync notice:', err.message);
  }
}

runSync();
