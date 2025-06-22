import { CronJob } from "cron";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const SERVER_URL =
  NODE_ENV === "production"
    ? "https://apprise.rauchrodrigues.in"
    : "http://localhost:3000";

const keepServerAlive = async () => {
  try {
    console.log(`🏃 Keep-alive ping at ${new Date().toISOString()}`);

    const response = await fetch(`${SERVER_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Keep-alive successful (health api check):", data.message);
    } else {
      console.log("⚠️ Keep-alive response not OK:", response);
    }
  } catch (error) {
    console.error("❌ Keep-alive failed:", error.message);
  }
};

// Create and start cron job
const startKeepAlive = () => {
  console.log("🚀 Starting keep-alive cron job (every 14 minutes)");

  // Run immediately on startup
  keepServerAlive();

  //cron job to run every 14 minutes
  const job = new CronJob(
    "*/14 * * * *", // Every 14 minutes
    keepServerAlive, // Function to run
    null, // onComplete
    true, // Start immediately
    "IST" // Timezone
  );

  console.log("⏰ Cron job scheduled successfully");
  console.log("Next execution:", job.nextDate().toISOTime());

  return job;
};

export { startKeepAlive, keepServerAlive };
