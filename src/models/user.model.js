const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

// user Schema
const userSchema = new Schema(
	{
		activeStatus: {
			type: String,
			enum: ["active", "inactive"],
			default: "inactive",
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
		userId: {
			type: String,
			unique: true,
		},
		firstName: {
			type: String,
			required: [true, "Name is required"],
		},
		lastName: {
			type: String,
			required: [true, "Last Name is required"],
			// minLength: [6, "name should be atleast 6 character long"],
		},
		contact: {
			type: String,
			required: [true, "Contact is required"],
			minLength: [10, "Contact should be atleast 10 character long"],
			maxLength: [10, "Contact must not be exceed 10 character long"],
		},
		whatsapp: {
			type: String,
			minLength: [10, "whatsapp should be atleast 10 character long"],
			maxLength: [10, "whatsapp must not be exceed 10 character long"],
		},
		linkedin: {
			type: String,
		},
		facebook: {
			type: String,
		},
		city: {
			type: String,
			required: [true, "City is required"],
			maxLength: [30, "City must not be exceed 30 character long"],
		},
		postalCode: {
			type: String,
			required: [true, "Postal Code is required"],
			minLength: [6, "Postal Code must be 6 character long"],
			maxLength: [6, "Postal Code must be 6 character long"],
		},
		state: {
			type: String,
			required: [true, "State is required"],
			minLength: [3, "State must be 3 character long"],
			maxLength: [20, "State must not exceed 20 character long"],
		},
		email: {
			type: String,
			unique: true,
			reqired: [true, "Email is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
			//match:[]
		},
		avatar: {
			type: String,
			default: "https://cdn.vectorstock.com/i/1000x1000/62/59/default-avatar-photo-placeholder-profile-icon-vector-21666259.webp",
		},
		aadharCard: {
			type: String,
			required: [true, "Aadhar Card is required"],
		},
		panCard: {
			type: String,
			required: [true, "Pan Card is required"],
		},
		membershipPakage: {
			type: String,
			default: "free",
		},
		membershipExpiry: {
			type: Date,
			default: Date.now() + 30 * 24 * 60 * 60 * 1000,
		},
		rank: {
			type: String,
			default: "joining",
		},
		level: {
			type: String,
			default: "0",
		},
		referralCode: {
			type: String,
			// unique: true,
		},
		events: [
			{
				type: Schema.Types.ObjectId,
				ref: "event",
			},
		],
		referralUrl: {
			type: String,
			// unique: true,
		},
		refers: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "user",
				},
			],
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		// REFER TO AND REFER BY
		totalBonus: {
			type: Number,
			default: 0,
		},
		amountWithdrawn: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		gender: {
			type: String,
			enum: ["male", "female", "others"],
		},
		dob: {
			type: Date,
		},
		levelBonus: {
			type: Number,
			default: 0,
		},
		referralIncome: {
			type: Number,
			default: 0,
		},
		epinUser: {
			type: Schema.Types.ObjectId,
			ref: "epin",
		},
		currentBalance: {
			type: Number,
			default: 0,
		},
		withdrawableBalance: {
			type: Number,
			default: 0,
		},
		tdsDeduction: {
			type: Number,
			default: 0,
		},
		serviceCharge: {
			type: Number,
			default: 0,
		},
		childrens: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
		resetPasswordToken: {
			type: String,
			default: "0",
		},
		plan: {
			type: String,
			enum: ["free", "premium", "gold", "platinum"],
			default: "free",
		},
		verified: {
			type: String,
			enum: ["approved", "pending", "rejected"],
			default: "pending",
		},
		track: {
			code: String,
			step: Number,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

const generateRandomCode = () => {
	const length = 3; // Adjust the length of the random code as needed
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let code = "";
	for (let i = 0; i < length; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return code;
};

userSchema.pre("save", async function (next) {
	if (this.isNew) {
		this.userId = "GBT" + generateRandomCode();
	}

	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJwtToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName,
			role: this.role,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

userSchema.methods.getResetPasswordToken = function () {
	// hashed token
	const resetToken = crypto.randomBytes(20).toString("hex");
	// further hashed token
	this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
	return resetToken;
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
