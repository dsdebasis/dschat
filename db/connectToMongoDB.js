import mongoose from "mongoose";

const connectToMongoDB = async () => {
	const uri = process.env.MONGODB_URI
	try {
		const conn = await mongoose.connect( uri);
		console.log("Connected to MongoDB",conn.connection.host);
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
		process.exit(1)
	}
};


export default connectToMongoDB;
