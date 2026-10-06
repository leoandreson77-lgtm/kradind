const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority";

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const db = client.db("flight_search");
    const col = db.collection("kradind_treks");

    // 1. Fix Jaisalmer image to authentic desert dunes
    await col.updateOne(
      { slug: "jaisalmer-tour-package" },
      {
        $set: {
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85",
          badge: "Desert Safari Special",
        },
      }
    );
    console.log("Updated Jaisalmer image.");

    // 2. Ensure rajasthan-tour-package-6-days is in MongoDB
    const rajasthanPkg = {
      id: 99201,
      slug: "rajasthan-tour-package-6-days",
      name: "Rajasthan Tour Package – 6 Days / 5 Nights",
      category: "Rajasthan",
      categories: ["Rajasthan", "Domestic", "Road Trip", "Heritage", "Cultural"],
      location: "Jaipur, Jodhpur & Udaipur, Rajasthan",
      region: "Rajasthan",
      duration: "6 Days / 5 Nights",
      altitude: "Ground Elevation",
      difficulty: "Easy",
      price: 42999,
      originalPrice: 49999,
      badge: "Couple Special",
      rating: 4.9,
      reviewCount: 184,
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80",
      ],
      tagline: "Private 6-day royal journey through Jaipur, Jodhpur, and Udaipur in a dedicated Swift Dzire with verified 3-star stays.",
      defaultHighlights: [
        "Private Swift Dzire reserved exclusively for 2 adults for all 6 days.",
        "Explore Amber Fort, Jaigarh, Nahargarh, City Palace, Mehrangarh, and Lake Pichola.",
        "Includes 5 nights in verified 3-star hotels with breakfast and optional dinner.",
        "Scenic highway road trip with stop at the 15th-century Ranakpur Jain Temple.",
      ],
      highlights: [
        "Amber Fort & Nahargarh sunset views in Jaipur",
        "Mehrangarh Fort & blue-painted old city lanes in Jodhpur",
        "Ranakpur marble temple with 1,444 uniquely carved pillars",
        "Lake Pichola lakeside ghats & Udaipur City Palace",
      ],
      itinerary: [
        {
          day: 1,
          title: "Jaipur Arrival & Pink City Sightseeing",
          description: "Meet driver at Jaipur Airport/Railway Station, check-in, visit City Palace, Jantar Mantar, Hawa Mahal and Old City Bazaars.",
          stay: "Jaipur 3-Star Hotel",
          meal: "Breakfast / +Dinner",
        },
        {
          day: 2,
          title: "Jaipur Forts & City Sightseeing",
          description: "Explore Amber Fort, Jaigarh Fort, Jal Mahal photo stop, Nahargarh Fort sunset, and Birla Mandir.",
          stay: "Jaipur 3-Star Hotel",
          meal: "Breakfast / +Dinner",
        },
        {
          day: 3,
          title: "Jaipur to Jodhpur (via Ajmer/Pushkar optional)",
          description: "Scenic 6-hour highway drive to the Blue City Jodhpur. Check-in and evening walk at Clock Tower & Sardar Market.",
          stay: "Jodhpur 3-Star Hotel",
          meal: "Breakfast / +Dinner",
        },
        {
          day: 4,
          title: "Jodhpur Sightseeing & Mehrangarh",
          description: "Visit majestic Mehrangarh Fort, Jaswant Thada royal marble cenotaph, and Umaid Bhawan Palace museum.",
          stay: "Jodhpur 3-Star Hotel",
          meal: "Breakfast / +Dinner",
        },
        {
          day: 5,
          title: "Jodhpur to Udaipur via Ranakpur",
          description: "Drive to Udaipur stopping at Ranakpur Jain Temple, evening stroll at Lake Pichola and Gangaur Ghat.",
          stay: "Udaipur 3-Star Hotel",
          meal: "Breakfast / +Dinner",
        },
        {
          day: 6,
          title: "Udaipur Sightseeing & Departure Drop",
          description: "Visit Udaipur City Palace, Jagdish Temple, Saheliyon Ki Bari, and transfer to Udaipur Airport/Railway Station.",
          stay: "Departure",
          meal: "Breakfast",
        },
      ],
      inclusions: [
        "5 nights accommodation in selected 3-star hotels for 2 adults",
        "Private AC Swift Dzire for the full route with Jaipur pickup and Udaipur drop",
        "Daily breakfast (plus dinner if selecting the ₹49,999 plan)",
        "Driver allowance, fuel, road taxes, tolls, and standard parking",
      ],
      exclusions: [
        "Airfare or train tickets",
        "Monument, fort, museum entry tickets",
        "Lake Pichola boat ride",
        "Lunches and personal shopping",
      ],
      status: "Published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await col.updateOne(
      { slug: "rajasthan-tour-package-6-days" },
      { $set: rajasthanPkg },
      { upsert: true }
    );
    console.log("Upserted rajasthan-tour-package-6-days in MongoDB.");

    // 3. Ensure Nainital has unique ID if needed
    await col.updateOne(
      { slug: "nainital-tour-package-3-nights-4-days" },
      { $set: { id: 1201 } }
    );
    console.log("Ensured unique ID for nainital-tour-package-3-nights-4-days.");

    // Print all Rajasthan matching packages
    const rajasthanTrips = await col.find({
      $or: [
        { category: /rajasthan/i },
        { location: /rajasthan/i },
        { categories: /rajasthan/i },
      ],
    }).toArray();
    console.log(`Total Rajasthan trips in MongoDB: ${rajasthanTrips.length}`);
    rajasthanTrips.forEach((t) => {
      console.log(`- ${t.name} (slug: ${t.slug}, status: ${t.status}, image: ${t.image?.substring(0, 50)}...)`);
    });

    console.log("MongoDB sync complete!");
  } catch (err) {
    console.error("MongoDB error:", err);
  } finally {
    await client.close();
  }
}

run();
