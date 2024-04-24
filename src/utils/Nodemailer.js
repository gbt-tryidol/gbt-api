const nodemailer = require("nodemailer");
const { ApiError } = require("./ApiError.js");
const dotenv = require("dotenv");

dotenv.config({
	path: "../.env",
});

const transport = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	post: 465,
	auth: {
		user: "rajkm9111@gmail.com",
		pass: "Pankhudi@1112",
	},
});

exports.sendRegistrationConfirmation = async (user) => {
	console.log(1);
	console.log(user);
	const mailOptions = {
		from: "Ganpati Balaji Trust",
		to: user.email,
		subject: "Payment Successful Confirmation",
		html: `
            <h1>Welcome to GBT Family!</h1><br>
            <p>Dear ${user.name},</p><br>
            <p>Congratulations! You have successfully registered with GBT Family.</p><br>
            <p>We are thrilled to have you as a part of our community.</p><br>
            <p>Feel free to explore our platform and engage with other members.</p><br>
            <p>Thank you for joining us!</p><br>
            <p>Best regards,<br>GBT Family Team</p><br>
            `,
	};
	console.log(2);
	transport.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(3);
			console.log(err);
			return;
		} else {
			console.log(info);
			console.log(4);
			return;
		}
	});
};

exports.sendReferralEmail = (user) => {
	const mailOptions = {
		from: "Ganpati Balaji Trust",
		to: user.senderMail,
		subject: "Invite to Join GBT Family!",
		html: `
            <h1>Join GBT Family Today!</h1>
            <p>Hello, ,</p>
            <p>You've been invited to join GBT Family by your friend ${user.name}.</p>
            <p>Use the referral code <strong>${user.referralCode}</strong> during registration to unlock special benefits.</p>
            <p>Join us now and become a part of our community!</p>
            <p>Best regards,<br>GBT Family Team</p>
        `,
	};

	transport.sendMail(mailOptions, (err, info) => {
		if (err) {
			return next(new ErrorHandler(err, 500));
		} else {
			console.log(info);
			return res.status(200).json({
				message: "Referral email sent successfully",
			});
		}
	});
};
