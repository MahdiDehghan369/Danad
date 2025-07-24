import mongoose from "mongoose"

const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Databse connected successfully :)");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


export default connect
