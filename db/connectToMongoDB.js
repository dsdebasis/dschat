import mongoose from "mongoose";

const connectToMongoDB = async () => {
	// console.log(process.env.MONGODB_URI)
	try {
		const conn = await mongoose.connect( process.env.MONGODB_URI);
		console.log("Connected to MongoDB",conn.connection.host);
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
		process.exit(1)
	}
};


export default connectToMongoDB;
