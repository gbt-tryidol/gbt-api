const mongoose = require("mongoose");

const { Schema } = mongoose;

// car Schema
const statementSchema = new Schema(
	{
		orderId: {
			type: String,
			required: [true, "Event Name is required"],
			unique: true,
		},
		details: {
			type: String,
			required: [true, "Event Purpose is required"],
		},
		amount: {
			type: Number,
			required: [true, "Event Budget is required"],
		},
		award: {
			type: String,
		},
		type: {
			type: String,
			enum: ["credited", "debited"],
			required: [true, "Transaction type is required"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true }
);

const Statement = mongoose.model("statement", statementSchema);
module.exports = Statement;
