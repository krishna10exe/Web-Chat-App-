import mongoose from "mongoose"

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log("DB Connected!!! DB HOST: ",connectionInstance.connection.host)
    }
    catch(error){
        console.log("DB Connection Failed",error)
        throw error;
    }
}

export default connectDB