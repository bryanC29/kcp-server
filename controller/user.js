import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users from "../model/users.js";
import Admins from '../model/admins.js';
import Students from '../model/students.js';
import Notifications from '../model/notifications.js';

import { userIdGen } from '../util/idGen.js';
import { mailingService } from '../util/nodeMailer.js';
import {
	registerStudent,
	registerAdmin,
} from '../util/roleRegister.js';

export const login = async (req, res) => {
	// Destructure email and password from request body
	const { email, password } = req.body;

	// Check if email and password are provided in the request body
	if(!email || !password)
		return res.status(400).json({ message: 'Email and password are required' });

	try {
		// Find a user by email
		const user = await Users.findOne({ email: email });

		// If user not found or password is incorrect, return invalid credentials message
		if(!(user && (await bcrypt.compare(password, user.password))))
			return res.status(400).json({ message: 'Invalid Credentials' });

		// If account is pending confirmation, return error message
		if(user.accountStatus === 'Pending')
			return res.status(400).json({ message: 'Account not yet confirmed' });

		// If account is new, generate a token and prompt for profile update
		if(user.accountStatus === 'New') {
			const token = jwt.sign({
				userId: user.userID,
				role: user.role,
			}, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});

			// Set authorization header with token
			res.setHeader('Authorization', `Bearer ${token}`);
			// Set a cookie with the token
			res.cookie('userToken', token, {
				httpOnly: true,
				maxAge: 60 * 60 * 1000, // Token expiration time set to 1 hour
			});

			// Return response to indicate profile update is required
			return res.status(200).json({
				message: 'Login successfull. Please update your profile',
				accountUpdateRequired: true
			});
		}

		// If account is confirmed, generate a token and proceed with login
		if(user.accountStatus === 'Confirmed') {
			const token = jwt.sign({
				userID: user.userID,
				role: user.role,
			}, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});

			// Set authorization header with token
			res.setHeader('Authorization', `Bearer ${token}`);
			// Set a cookie with the token
			res.cookie('userToken', token, {
				httpOnly: true,
				maxAge: 60 * 60 * 1000, // Token expiration time set to 1 hour
			});

			// Return response for successful login
			return res.status(200).json({ message: 'Login successfull' });
		}

		// If account status is not recognized, return server error
		return res.status(500).json({ message: 'Internal Server error while logging in' });
	}

	catch(err) {
		// Return error response if an exception occurs
		res.status(500).json({ message: 'Internal Server error while logging in' });
	}
}

export const logout = async (req, res) => {
	try {
		// Clear the 'userToken' cookie to log the user out
		res.clearCookie('userToken');
		
		// Send a response indicating successful logout
		res.status(200).json({ message: 'Logout successfull' });
	}

	catch(err) {
		// Return an error response if there is a server issue during logout
		res.status(500).json({ message: 'Internal Server error during logout' });
	}
}

export const register = async (req, res) => {
	// Destructure input fields from request body
	const { name, email, password, role, contactNumber } = req.body;

	// Check if all required fields are provided in the request body
	if(!name || !email || !password || !contactNumber)
		return res.status(400).json({ message: 'Enter all credentials' });

	try {
		// Check if a user with the provided email already exists
		const existingUser = await Users.findOne({ email: email });
		if(existingUser)
			return res.status(400).json({ message: 'Failed to register. Please try again later' });

		// Generate a salt for password hashing
		const salt = await bcrypt.genSalt(10);
		// Hash the password
		const hash = await bcrypt.hash(password, salt);
		// Generate a unique userID
		const uid = userIdGen(name, role);

		// Create a new user object
		const newUser = new Users({ 
			userID: uid,
			name,
			email,
			password: hash,
			role,
			contactNumber,
		});
		// Save the new user to the database
		await newUser.save();

		// Create a welcome notification for the new user
		const newNotification = new Notifications({
			userID: uid,
			body: 'Welcome to the platform. Please update your profile',
		});
		await newNotification.save();

		// Handle registration logic based on user role
		if(role === 'Student') {
			// Register the new student
			await registerStudent(newUser.userID);
		}
		else if(role === 'Admin') {
			// Register the new admin
			await registerAdmin(newUser.userID);

			// Set the account status to 'New' for the admin
			newUser.accountStatus = 'New';
			await newUser.save();
		}

		// Generate a JWT token for the new user
		const token = jwt.sign({
			userID: newUser.userID,
			role: newUser.role,
		}, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		// Set the authorization header with the JWT token
		res.setHeader('Authorization', `Bearer ${token}`);
		// Set the JWT token as a cookie
		res.cookie('userToken', token, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000, // Token expiration time set to 1 hour
		});

		// Return a success message with the user's role
		return res.status(201).json({ message: `Successfully registered as ${newUser.role}` });
	}

	catch(err) {
		// Return an error response if there is an issue during signup
		res.status(500).json({ message: 'Internal Server error during Signup' });
	}
}

export const forgotPassword = async (req, res) => {
    // Destructure email from the request body
    const { email } = req.body;
    
    try {
        // Find the user by the provided email
        const user = await Users.findOne({ email: email });

        // If no user is found, return a 404 error response
        if(!user)
            return res.status(404).json({ message: 'User not found' });
                
        // Generate a JWT token for password reset with a short expiration time (5 minutes)
        const token = jwt.sign({
            userID: user.userID,
        }, process.env.JWT_SECRET, {
            expiresIn: '5m',  // Token expiration time set to 5 minutes
        });

        // Define the message for the password reset email
        const resetMessage = {
            subject: 'Password reset',
            // Text version of the message with a reset link
            text: `Alternatively you can copy and paste this link in your browser ${process.env.HOST}/user/updatepassword/${token}`,
            // HTML version with a clickable link
            html: `<p>Please reset by clicking <a href='${process.env.HOST}/user/updatepassword/${token}' target='_blank'> here </a></p>`,
        };

        // Send the password reset email using the mailing service
        await mailingService(resetUser, resetMessage);

        // Return a success response once the email has been sent
        return res.status(201).json({ message: 'Password reset link successfully sent' });
    }

    catch(err) {
        // Return an error response if there was an issue processing the request
        return res.status(500).json({ message: 'Cannot reset password at the moment. Please try again later' });
    }
}

export const userPasswordUpdate = async (req, res) => {
    // Extract userID from the authenticated user and password fields from the request body
    const { userID } = req.user;
    const { newPassword, oldPassword } = req.body;
    const { resetToken } = req.params;

    // Check if newPassword and oldPassword are provided
    if(!newPassword || !oldPassword)
        return res.status(400).json({ message: 'Enter all credentials' });

    // Check if resetToken is provided (for password reset via email link)
    if(resetToken) {
        try {
            // Verify the resetToken to extract userID
            const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
            const decodedUserID = decoded.userID;

            // If decodedUserID is missing or invalid, return an error response
            if(!decodedUserID)
                return res.status(400).json({ message: 'Invalid or expired token' });

            // Find the user by decoded userID
            const user = await Users.findOne({ userID: decodedUserID });

            // If user not found, return error message
            if(!user)
                return res.status(400).json({ message: 'User not found' });

            // Generate a salt and hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update user's password and save the changes
            user.password = hashedPassword;
            await user.save();

			// Create a notification for the user about the password reset
			const resetPasswordNotification = new Notifications({
				userID: user.userID,
				body: 'Your password has been reset successfully',
			});
			await resetPasswordNotification.save();

            // Return success message
            return res.status(200).json({ message: 'Password updated successfully' });
        }
        
        catch(err) {
            // Return error response if the token is invalid or expired
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    }

    else {
        try {
            // Find the user by userID
            const user = await Users.findOne({ userID: userID });

            // If user not found, return error message
            if(!user)
                return res.status(400).json({ message: 'User not found' });

            // Check if the old password provided matches the stored password
            if(!(await bcrypt.compare(oldPassword, user.password)))
                return res.status(400).json({ message: 'Invalid credentials' });

            // Generate a salt and hash the new password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            // Update user's password and save the changes
            user.password = hash;
            await user.save();

			// Create a notification for the user about the password reset
			const resetPasswordNotification = new Notifications({
				userID: user.userID,
				body: 'Your password has been reset successfully',
			});
			await resetPasswordNotification.save();

            // Return success message
            return res.status(200).json({ message: 'Password reset successfully' });
        }
        
        catch(err) {
            // Return server error if something goes wrong
            return res.status(500).json({ message: 'Cannot reset password at the moment. Please try again later' });
        }
    }    
}

export const getBankDetails = async (req, res) => {
	const { userID } = req.user;
	
	try{
		const user = await Users.findOne({ userID: userID });
		
		if(!user)
			return res.status(400).json({ message: 'User not found' });
		const returnedUser = {
			userID: user.userID,
			name: user.name,
			role: user.role,
			centre: user.centre,
			accountNumber: user.bankDetail.accNo ? user.bankDetail.accNo: 'Not provided',
			ifsc: user.bankDetail.ifscCode ? user.bankDetail.ifscCode: 'Not provided',
			bank: user.bankDetail.bankName ? user.bankDetail.bankName: 'Not provided',
			upi: user.bankDetail.upiID ? user.bankDetail.upiID: 'Not provided',
		}
		
		return res.status(200).json({ message: 'User fetched successfully', returnedUser });
	}

	catch(err) {
		return res.status(500).json({ message: 'Cannot get profile bank details at the moment. Please try again later' });
	}
}

export const userProfileUpdate = async (req, res) => {
    // Extract userID from the authenticated user and profile details from the request body
    const { userID } = req.user;
    const { address, gender, dateOfBirth, highestEducation } = req.body;
    
    try {
        // Find the user by their userID
        const user = await Users.findOne({ userID: userID });

        // If the user is not found, return an error response
        if(!user)
            return res.status(400).json({ message: 'User not found' });
        
        // Update the user's profile information
        user.address = address;
        user.gender = gender;
        user.dateOfBirth = dateOfBirth;
        user.highestEducation = highestEducation;
        user.accountStatus = 'Confirmed';  // Set the account status to 'Confirmed'
        await user.save();

        // Create a notification to inform the user that their profile was updated
        const updatedNotification = new Notifications({
            userID: userID,
            body: 'Profile updated successfully',
        });
        await updatedNotification.save();
        
        // Return a success response
        return res.status(200).json({ message: 'Profile updation successful' });
    }
    
    catch(err) {
        // Return an error response if there was an issue updating the profile
        return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
    }
}

export const userBankDetailUpdate = async (req, res) => {
    // Extract userID from the authenticated user and bank details from the request body
    const { userID } = req.user;
    const { accNo, ifscCode, bankName, upiID } = req.body;
    
    try {
        // Find the user by their userID
        const user = await Users.findOne({ userID: userID });

        // If the user is not found, return an error response
        if(!user)
            return res.status(400).json({ message: 'User not found' });
        
        // Update the user's bank details
        user.bankDetail.accNo = accNo;
        user.bankDetail.ifscCode = ifscCode;
        user.bankDetail.bankName = bankName;
        user.bankDetail.upiID = upiID;
        await user.save();
        
        // Return a success response after successfully updating the bank details
        return res.status(200).json({ message: 'Bank detail updation successful' });
    }
    
    catch(err) {
        // Return an error response if there was an issue updating the bank details
        return res.status(500).json({ message: 'Cannot update bank details at the moment. Please try again later' });
    }
}

export const getProfile = async (req, res) => {
	const { userID } = req.user;

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
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}

export const getAdminProfile = async (req, res) => {
	const { userID } = req.user;
	
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
		return res.status(500).json({ message: 'Cannot update profile at the moment. Please try again later' });
	}
}