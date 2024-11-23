import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users from "../model/users.js";
import Admins from '../model/admins.js';
import Managers from '../model/managers.js';
import Teachers from '../model/teachers.js';
import Students from '../model/students.js';

import { userIdGen } from '../util/idGen.js';
import { mailingService } from '../util/nodeMailer.js';

export const login = async (req, res) => {
	const { email, password } = req.body;
	
	if(!email || !password)
		return res.status(400).json({ message: 'Email and password are required' });

	try {
		const user = await Users.findOne({ email: email });

		if(!(user && (await bcrypt.compare(password, user.password))))
			return res.status(400).json({ message: 'Invalid Credentials' });
		
		const token = jwt.sign({
			userID: user.userID,
			email: user.email,
			name: user.name,
			role: user.role,
		}, process.env.JWT_SECRET, {
			expiresIn: '1d',
		})

		res.setHeader('Authorization', `Bearer ${token}`);
		res.cookie('userToken', token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		})

		res.status(200).json({ message: 'Login successfull' });
	}

	catch(err) {
		console.log(err);
		res.status(500).json({ message: 'Internal Server error while logging in' });
	}
}

export const logout = async (req, res) => {
	try{
		res.clearCookie('userToken');
		res.status(200).json({ message: 'Logout successfull' });
	}

	catch(err) {
		console.log(err);
		res.status(500).json({ message: 'Internal Server error during logout' });
	}
}

export const register = async (req, res) => {
	const { name, email, password, role, contactNumber, centre } = req.body;

	if(!name || !email || !password || !contactNumber || !centre)
		return res.status(400).json({ message: 'Enter all credentials' });

	try{

		const existingUser = await Users.findOne({ email: email });
		if(existingUser)
			return res.status(400).json({ message: 'Failed to register. Please try again later' });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const uid = userIdGen(name, role);

		const newUser = new Users({ 
			userID: uid,
			name,
			email,
			password: hash,
			role,
			contactNumber,
			centre
		});
		await newUser.save();
		
		const token = jwt.sign({
			userID: newUser.userID,
			email: newUser.email,
			name: newUser.name,
			role: newUser.role,
		}, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.setHeader('Authorization', `Bearer ${token}`);
		res.cookie('userToken', token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(201).json({ message: `Successfully registered as ${newUser.role}` });
	}
	
	catch(err) {
		console.log(err);
		res.status(500).json({ message: 'Internal Server error during Signup' });
	}
}

export const forgotPassword = async (req, res) => {
	const { newPassword, resetToken, email } = req.body;
	
	try {
		if(resetToken && newPassword) {
			const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
		
			if(!decodedToken)
				return res.status(400).json({ message: 'Invalid reset token' });
		
			const uid = decodedToken.userID;
			const user = await Users.findOne({ userID: uid });
			
			if(!user)
				return res.status(404).json({ message: 'User not found' });
			
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(newPassword, salt);
			
			user.password = hash;
			await user.save();
		
			res.status(200).json({ message: 'Password reset successfully' });
		
		} else {
			if(!email)
				return res.status(400).json({ message: 'Invalid request' });
			
			const user = await Users.findOne({ email: email });

			if(!user)
				return res.status(404).json({ message: 'User not found' });

			const resetUser = { email: user.email };
					
			const token = jwt.sign({
				userID: user.userID,
			}, process.env.JWT_SECRET, {
				expiresIn: '1d',
			});

			const resetMessage = {
				subject: 'Password reset',
				text: `Alternatively you can copy and paste this link in your browser https://localhost/${token}`,
				html: `<p>Please reset by clicking <a href='https://localhost/${token}' target='_blank'> here </a></p>`,
			}

			await mailingService(resetUser, resetMessage);

			return res.status(200).json({ message: 'Password reset link successfully sent' });
		}
	}

	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot reset password at the moment. Please try again later' });
	}
}

export const getProfile = async (req, res) => {
	const { userID } = req.body;

	try{
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });

		const returnedUser = {
			userID: user.userID,
			name: user.name,
			email: user.email,
			role: user.role,
			contactNumber: user.contactNumber,
			gender: user.gender,
			DOB: user.dateOfBirth,
			aadhar: user.aadhar,
			address: user.address,
			qualification: user.highestEducation,
			centre: user.centre,
		}

		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getAdminProfile = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = await Users.findOne({ userID: userID });
		const admin = await Admins.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			email: user.email,
			role: user.role,
			contactNumber: user.contactNumber,
			gender: user.gender,
			DOB: user.dateOfBirth,
			aadhar: user.aadhar,
			address: user.address,
			qualification: user.highestEducation,
			centre: user.centre,
			salary: admin.salary,
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getManagerProfile = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = await Users.findOne({ userID: userID });
		const management = await Managers.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			email: user.email,
			role: user.role,
			contactNumber: user.contactNumber,
			gender: user.gender,
			DOB: user.dateOfBirth,
			aadhar: user.aadhar,
			address: user.address,
			qualification: user.highestEducation,
			centre: user.centre,
			salary: management.salary,
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getTeacherProfile = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = await Users.findOne({ userID: userID });
		const teacher = await Teachers.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			email: user.email,
			role: user.role,
			contactNumber: user.contactNumber,
			gender: user.gender,
			DOB: user.dateOfBirth,
			aadhar: user.aadhar,
			address: user.address,
			qualification: user.highestEducation,
			centre: user.centre,
			course: teacher.courseTeaching,
			specialization: teacher.specialization,
			salary: teacher.salary,
			experience: teacher.yearsOfExperience,
			timing: teacher.timingsAllotted,
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getStudentProfile = async (req, res) => {
	const { userID } = req.body;
	
	try {
		const user = await Users.findOne({ userID: userID });
		const student = await Students.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			email: user.email,
			role: user.role,
			contactNumber: user.contactNumber,
			gender: user.gender,
			DOB: user.dateOfBirth,
			aadhar: user.aadhar,
			address: user.address,
			qualification: user.highestEducation,
			centre: user.centre,
			course: student.courseEnrolled,
			timing: student.timeAllotted,
			certificate: student.certificates,
			fees: student.fee,
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getBankDetails = async (req, res) => {
	const { userID } = req.body;
	
	try{
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			role: user.role,
			centre: user.centre,
			accountNumber: user.bankDetail.accNo,
			ifsc: user.bankDetail.ifscCode,
			bank: user.bankDetail.bankName,
			upi: user.bankDetail.upiID,
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}

	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const userProfileUpdate = async (req, res) => {
	const { userID, address, gender, dateOfBirth, highestEducation } = req.body;
	
	try {
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		user.address = address;
		user.gender = gender;
		user.dateOfBirth = dateOfBirth;
		user.highestEducation = highestEducation;
		await user.save();
		
		res.status(200).json({ message: 'Profile updation successful' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const userBankDetailUpdate = async (req, res) => {
	const { userID, accNo, ifscCode, bankName, upiID } = req.body;
	
	try {
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		user.bankDetail.accNo = accNo;
		user.bankDetail.ifscCode = ifscCode;
		user.bankDetail.bankName = bankName;
		user.bankDetail.upiID = upiID;
		await user.save();
		
		res.status(200).json({ message: 'Bank detail updation successful' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot update bank details at the moment. Please try again later' });
	}
}

export const userPasswordUpdate = async (req, res) => {
	const { userID, newPassword, oldPassword } = req.body;
	
	try {
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		
		if(!(await bcrypt.compare(oldPassword, user.password)))
			return res.status(400).json({ message: 'Invalid Old Password' });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);
		
		user.password = hash;
		await user.save();
		
		res.status(200).json({ message: 'Password reset successfully' });
	}
	
	catch(err) {
		console.log(err);
		return res.status(500).json({ message: 'Cannot reset password at the moment. Please try again later' });
	}
}