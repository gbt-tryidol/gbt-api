const User = require("../models/user.model.js");
const Statement = require("../models/statement.model.js");

const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");

exports.updateStatement = catchAsyncErrors(async (userid) => {
	const statement = await Statement.create({
		orderId: "ID-" + new Date().toString().split("T")[0],
		amount: 580,
		details: "580 Recieved from User Registration",
		user: userid,
	});
	console.log(statement);
});
