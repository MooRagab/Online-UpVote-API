import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then((res) => { 
      console.log("Connected to database "); 
    })
    .catch((err) => console.log(`Fail to connect to database  ${err}`));
};

export default connectDB; 