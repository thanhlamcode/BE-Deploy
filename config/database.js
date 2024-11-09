import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect success!!");
  } catch (error) {
    console.error(error);
    console.log("connect error");
  }
};

export default connect;
