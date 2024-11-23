import jwt from 'jsonwebtoken';

import Users from '../model/users.js';

import { mailingService } from '../util/nodeMailer.js';

export const verifyEmail = async (req, res) => {
	const { token } = req.params;

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	
		if(!decodedToken) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	
		const user = Users.findOne({ userID: decodedToken.userID });
	
		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}
	
		user.emailVerified = true;
	
		await user.save();
	
		return res.status(200).json({ message: 'Email verification successful' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export const verifyUser = async (req, res) => {
	const { userID } = req.body;

	try {
		const user = Users.findOne({ userID: userID });

		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		const verifiedUser = {
			userID: user.userID,
			name: user.name,
			role: user.role,
		}

		return res.status(200).json({ message: 'User verification successful', verifiedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal server error occurred during user verification. Please try again later' });
	}
}

export const requestEmailVerify = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = Users.findOne({ userID: userID });

		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const emailVerificationToken = jwt.sign({
			userID: user.userID,
		}, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		const verifyUser = { userID: user.userID };

		const verifyMessage = {
			subject: 'Email Verification',
			text: `Alternatively you can copy and paste this link in your browser https://localhost/${emailVerificationToken}`,
			html: `<p>Please verify by clicking <a href='https://localhost/${emailVerificationToken}' target='_blank'> here </a></p>`,
		}

		await mailingService(verifyUser, verifyMessage);
		
		return res.status(201).json({ message: 'Email Verification email sent successfully' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Could not initiate email verification at the moment' });
	}
}

export const requestNumberVerify = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = Users.findOne({ userID: userID });
		
		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		const emailVerificationToken = jwt.sign({
			userID: user.userID,
		}, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		
		return res.status(201).json({ message: 'Phone Verification initiated successfully', emailVerificationToken });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Could not initiate phone verification at the moment' });
	}
}

export const validateOTP = async (req, res) => {
	const { token } = req.params;
	
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	
		if(!decodedToken) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	
		const user = Users.findOne({ userID: decodedToken.userID });
	
		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}
	
		user.contactNumberVerified = true;
	
		await user.save();
	
		return res.status(200).json({ message: 'Contact number verification successful' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Could not initiate contact number verification at the moment' });
	}
}

export const aadharAuth = async (req, res) => {
	const { aadharNumber, userID } = req.body;

	try {
		const user = await Users.findOne({ userID: userID });

		if(!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.aadhar = aadharNumber;
		await user.save();

		return res.status(200).json({ message: 'Aadhar updation and verification successful' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Could not initiate email verification at the moment' });
	}
}