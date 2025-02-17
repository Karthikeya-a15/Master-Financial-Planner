import mongoose from "mongoose";

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URI, {
            tls: true,
          })
        .then(() => {
            console.log('Connected to MongoDB');
        }).catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
        
    }catch(error){
        console.log(error.message);
    }
}

export default connectDB;