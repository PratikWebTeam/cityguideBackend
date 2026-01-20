require('dotenv').config();
const mongoose = require("mongoose");
const Review = require("./models/Review");
const Place = require("./models/Place");

// 🔹 MongoDB connection from .env
const MONGO_URI = process.env.MONGO_URI;

// 🔹 You can change this to any place ID from your database
// To find place IDs, run: node list-places.js (we'll create this)
const PLACE_ID = new mongoose.Types.ObjectId("696a290297b1871c336a05a5");

// 🔹 Sample data pools
const comments = [
  "Amazing service and food! Highly recommend this place.",
  "Very clean and well maintained. Great experience.",
  "Good experience overall. Will visit again.",
  "Food was tasty and fresh. Loved the ambience.",
  "Staff was polite and helpful. Quick service.",
  "Worth the price. Good quality and quantity.",
  "Nice ambience and comfortable seating.",
  "Could improve service speed during peak hours.",
  "Average experience. Nothing special but decent.",
  "Loved the place! Perfect for family gatherings.",
  "Will definitely visit again. Exceeded expectations.",
  "Decent place with good facilities.",
  "Good for family outings. Kids friendly.",
  "Location is convenient and easy to find.",
  "Highly recommended! Best in the area."
];

const userNames = [
  "Rahul Sharma", "Amit Kumar", "Sneha Patel", "Pooja Singh", "Karan Mehta",
  "Neha Gupta", "Rohit Verma", "Anjali Reddy", "Vikas Joshi", "Priya Desai",
  "Sahil Khan", "Komal Agarwal", "Nikhil Rao", "Isha Malhotra", "Aditya Nair"
];

const ownerReplies = [
  "Thank you for your wonderful feedback!",
  "We're glad you enjoyed your visit!",
  "Thanks for choosing us. Hope to see you again!",
  "We appreciate your kind words!",
  "Thank you! We'll continue to serve you better.",
  "We're happy you had a great experience!",
  "Thanks for the review. We value your feedback!",
  "We'll work on improving our service speed. Thank you!",
  "Thank you for your honest feedback!",
  "So glad you loved it! Come back soon!"
];

async function seedReviews() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected\n");

    // Check if place exists
    const place = await Place.findById(PLACE_ID);
    if (!place) {
      console.error(`❌ Place with ID ${PLACE_ID} not found!`);
      console.log('\n💡 To find available place IDs, check your database or run:');
      console.log('   node list-places.js\n');
      process.exit(1);
    }

    console.log(`📍 Found place: ${place.name} (${place.city})\n`);

    // ❗ Remove old reviews for this place
    const deletedCount = await Review.deleteMany({ placeId: PLACE_ID });
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing reviews\n`);

    const reviews = [];
    const now = new Date();

    // Create reviews with varied dates (last 60 days)
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 60); // Random day in last 60 days
      const createdAt = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      const rating = Math.floor(Math.random() * 5) + 1;
      const hasReply = Math.random() > 0.4; // 60% chance of owner reply

      reviews.push({
        placeId: PLACE_ID,
        userId: new mongoose.Types.ObjectId(), // unique user each time
        userName: userNames[i],
        rating: rating,
        comment: comments[i],
        ownerReply: hasReply ? ownerReplies[Math.floor(Math.random() * ownerReplies.length)] : null,
        ownerReplyAt: hasReply ? new Date(createdAt.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000)) : null,
        createdAt: createdAt,
        updatedAt: createdAt
      });
    }

    // Sort by date before inserting
    reviews.sort((a, b) => a.createdAt - b.createdAt);

    await Review.insertMany(reviews);
    console.log("✅ 15 reviews seeded successfully\n");

    // Update place statistics
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    place.totalReviews = totalReviews;
    place.averageRating = averageRating;
    place.rating = averageRating;
    await place.save();

    console.log("📊 Updated place statistics:");
    console.log(`   Total Reviews: ${totalReviews}`);
    console.log(`   Average Rating: ${averageRating.toFixed(2)}⭐`);
    console.log(`   Rating Distribution:`);
    
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => ratingCounts[r.rating]++);
    
    for (let i = 5; i >= 1; i--) {
      console.log(`     ${i}⭐: ${ratingCounts[i]} reviews`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   1. Start your backend: node production-server.js");
    console.log("   2. Open Property Dashboard in your app");
    console.log("   3. View the analytics charts with seeded data\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();
