import mongoose from "mongoose";

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Connection to database succesful");
            }).catch(() => {
                console.log("Connection to database Failed");
            })

    }catch(error){
        console.log(error.message);
    }
}

export default connectDB;