// const User = require("../models/user.model.js");
const Statement = require("../models/statement.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");

exports.updateStatement = catchAsyncErrors(async (userid) => {
	const statement = await Statement.create({
		orderId: "ID-" + generateRandomCode() + new Date().getTime(),
		amount: 580,
		type: "credited",
		user: userid,
		details: "580 Recieved from User Registration",
		user: userid,
	});
	if (!statement) {
		throw new ApiError(404, "Statement not created");
	}
});

const generateRandomCode = () => {
	const length = 5; // Adjust the length of the random code as needed
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let code = "";
	for (let i = 0; i < length; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return code;
};

exports.updateUserStatement = catchAsyncErrors(async (userid, amount, username) => {
	const statement = await Statement.create({
		orderId: "ID-" + generateRandomCode() + new Date().getTime(),
		amount,
		type: "debited",
		user: userid,
		details: `${amount} withdrwan by ${username}`,
		user: userid,
	});
	if (!statement) {
		throw new ApiError(404, "Statement not created");
	}
});

exports.updateAwardStatement = catchAsyncErrors(async (userid, amount, award, username) => {
	const statement = await Statement.create({
		orderId: "ID-" + generateRandomCode() + new Date().getTime(),
		amount,
		award,
		type: "debited",
		user: userid,
		details: `${award} is approved`,
		user: userid,
	});

	if (!statement) {
		throw new ApiError(404, "Statement not created");
	}
});

exports.getStatements = catchAsyncErrors(async (req, res) => {
	const statements = await Statement.find().populate("user");
	if (!statements || statements.length === 0) {
		throw new ApiError(404, "Statement not found");
	}
	return res.status(200).json(new ApiResponse(200, statements, "statement found successfully"));
});
