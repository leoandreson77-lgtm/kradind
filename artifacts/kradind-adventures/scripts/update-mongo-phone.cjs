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

    // 1. Check and update kradind_config (homeSections)
    const configCol = db.collection("kradind_config");
    const configs = await configCol.find({}).toArray();
    console.log(`Found ${configs.length} documents in kradind_config.`);

    for (const doc of configs) {
      let docStr = JSON.stringify(doc);
      let changed = false;

      if (docStr.includes("7500222141")) {
        console.log(`Found 7500222141 in config doc ${doc._id}`);
        docStr = docStr.replace(/7500222141/g, "9797941414");
        changed = true;
      }
      if (docStr.includes("support@kradind.com")) {
        console.log(`Found support@kradind.com in config doc ${doc._id}`);
        docStr = docStr.replace(/support@kradind\.com/g, "info@kradind.com");
        changed = true;
      }
      if (docStr.includes("hello@kradind.com")) {
        console.log(`Found hello@kradind.com in config doc ${doc._id}`);
        docStr = docStr.replace(/hello@kradind\.com/g, "info@kradind.com");
        changed = true;
      }
      if (docStr.includes("https://wa.link/n3u8c0")) {
        console.log(`Found wa.link in config doc ${doc._id}`);
        docStr = docStr.replace(/https:\/\/wa\.link\/n3u8c0/g, "https://wa.me/919797941414");
        changed = true;
      }

      if (changed) {
        const updatedDoc = JSON.parse(docStr);
        const { _id, ...rest } = updatedDoc;
        await configCol.updateOne({ _id: doc._id }, { $set: rest });
        console.log(`Successfully updated kradind_config doc: ${doc._id}`);
      }
    }

    // 2. Also check if homeSections exists directly
    const homeDoc = await configCol.findOne({ configKey: "homeSections" });
    if (homeDoc) {
      console.log("Current homeSections in MongoDB:");
      console.log("topBar:", JSON.stringify(homeDoc.topBar));
      console.log("contactAndFooter:", JSON.stringify(homeDoc.contactAndFooter));

      let needsUpdate = false;
      const updates = {};

      if (homeDoc.topBar?.supportPhone !== "+91 9797941414") {
        updates["topBar.supportPhone"] = "+91 9797941414";
        needsUpdate = true;
      }
      if (homeDoc.topBar?.whatsappNumber !== "+91 9797941414") {
        updates["topBar.whatsappNumber"] = "+91 9797941414";
        needsUpdate = true;
      }
      if (homeDoc.contactAndFooter?.supportPhone !== "+91 9797941414") {
        updates["contactAndFooter.supportPhone"] = "+91 9797941414";
        needsUpdate = true;
      }
      if (homeDoc.contactAndFooter?.whatsappLink !== "https://wa.me/919797941414") {
        updates["contactAndFooter.whatsappLink"] = "https://wa.me/919797941414";
        needsUpdate = true;
      }
      if (homeDoc.contactAndFooter?.supportEmail !== "info@kradind.com") {
        updates["contactAndFooter.supportEmail"] = "info@kradind.com";
        needsUpdate = true;
      }

      if (needsUpdate) {
        await configCol.updateOne({ configKey: "homeSections" }, { $set: updates });
        console.log("Explicitly updated homeSections in MongoDB:", updates);
      } else {
        console.log("homeSections in MongoDB already has latest values!");
      }
    }

    // 3. Check all other collections in the database for 7500222141
    const collections = await db.listCollections().toArray();
    for (const colInfo of collections) {
      const colName = colInfo.name;
      const col = db.collection(colName);
      const cursor = col.find({});
      let colUpdated = 0;

      while (await cursor.hasNext()) {
        const item = await cursor.next();
        let itemStr = JSON.stringify(item);
        if (itemStr.includes("7500222141")) {
          itemStr = itemStr.replace(/7500222141/g, "9797941414");
          const { _id, ...rest } = JSON.parse(itemStr);
          await col.updateOne({ _id: item._id }, { $set: rest });
          colUpdated++;
        }
      }
      if (colUpdated > 0) {
        console.log(`Updated ${colUpdated} items in collection: ${colName}`);
      }
    }

    console.log("Done checking and updating MongoDB!");
  } catch (err) {
    console.error("MongoDB update error:", err);
  } finally {
    await client.close();
  }
}

run();
