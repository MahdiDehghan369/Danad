import connectDB from "./config/database";
import app from "./app"


async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://127.0.0.1:${process.env.PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    } else {
      console.error("Unknown error:", error);
      process.exit(1);
    }
  }
}

startServer()
