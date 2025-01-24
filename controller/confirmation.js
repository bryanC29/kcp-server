import Users from "../model/users.js";
import Students from "../model/students.js";
import Teachers from "../model/teachers.js";
import Centres from "../model/centres.js";

export const acceptStudentHandler = async (req, res) => {
	// Destructuring necessary data from the request body and the authenticated user's data
	const { studentId, courseID, courseStart, timeAllotted } = req.body;
	const { userID } = req.user;

	// Check if all required fields are provided
	if(!studentId || !courseID || !timeAllotted)
		return res.status(400).json({ message: "Please fill all fields" });

	// Try to perform the database operations
	try {
		// Find the user and student by the studentId
		const user = await Users.findOne({ userID: studentId });
		const student = await Students.findOne({ userID: studentId });

		// If user not found, return error
		if (!user)
			return res.status(404).json({ message: "Student not found" });

		// Check if the student's account is in "Pending" state, meaning they haven't been accepted yet
		if(user.accountStatus != "Pending")
			return res.status(400).json({ message: "Student is already accepted" });

		// Find the centre the user belongs to
		const centre = await Centres.findOne({ centreID: user.centre });

		// If the centre is not found, return error
		if (!centre)
			return res.status(404).json({ message: "Centre not found" });

		// Check if the current user is authorized to manage the centre
		if (centre.managerID != userID)
			return res.status(401).json({ message: "Unauthorized" });

		// Check if the student is already enrolled in the centre
		const studentExists = centre.students.includes(studentId);
		if (studentExists)
			return res.status(400).json({ message: "Student already accepted" });

		// Get the current month and year for setting the course start date
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const date = new Date();
		const month = date.getMonth();
		const year = date.getFullYear();
		const monthYear = `${months[month]}-${year}`;

		// Prepare the course enrollment data
		const courseEnrolled = { 
			courseID, 
			courseStart : courseStart ? courseStart : monthYear, // Use provided courseStart or the current month-year if not provided
		};

		// Add student to the centre, update user account status and enroll student in the course
		centre.students.push(studentId);
		user.accountStatus = "New"; // Mark the user's account as 'New'
		student.courseEnrolled.push(courseEnrolled); // Add the course to the student's courses
		student.timeAllotted = timeAllotted; // Set the time allotted to the student

		// Start a database session for a transactional operation
		const session = await mongoose.startSession();
		session.startTransaction();

		// Perform the save operations within the transaction
		try {
			await centre.save({ session }); // Save the updated centre
			await user.save({ session }); // Save the updated user
			await student.save({ session }); // Save the updated student
			await session.commitTransaction(); // Commit the transaction to apply all changes
		}
		catch (error) {
			await session.abortTransaction(); // Abort the transaction if there's an error
			throw error; // Rethrow the error to be caught by the outer catch block
		}
		finally {
			session.endSession(); // End the session whether or not the transaction was successful
		}

		// Return success response indicating the student was accepted
		return res.status(200).json({ message: "Student accepted" });
	}

	// Catch any errors and return an internal server error response
	catch (error) {
		return res.status(500).json({ message: "Internal Server error occurred while accepting Student" });
	}
}

export const acceptTeacherHandler = async (req, res) => {
	// Destructuring necessary data from the request body and the authenticated user's data
	const { teacherId, courseID, specialization, yoe, timeAllotted } = req.body;
	const { userID } = req.user;

	// Check if all required fields are provided
	if(!teacherId || !courseID || !specialization || !yoe || !timeAllotted)
		return res.status(400).json({ message: "Please fill all fields" });

	// Try to perform the database operations
	try {
		// Find the user and teacher by the teacherId
		const user = await Users.findOne({ userID: teacherId });
		const teacher = await Teachers.findOne({ userID: teacherId });

		// If user not found, return error
		if (!user)
			return res.status(404).json({ message: "Teacher not found" });

		// Check if the teacher's account is in "Pending" state, meaning they haven't been accepted yet
		if(user.accountStatus != "Pending")
			return res.status(400).json({ message: "Teacher is already accepted" });

		// Find the centre the user belongs to
		const centre = await Centres.findOne({ centreID: user.centre });

		// If the centre is not found, return error
		if (!centre)
			return res.status(404).json({ message: "Centre not found" });

		// Check if the current user is authorized to manage the centre
		if (centre.managerID != userID)
			return res.status(401).json({ message: "Unauthorized" });

		// Check if the teacher is already enrolled in the centre
		const teacherExists = centre.teachers.includes(teacherId);
		if (teacherExists)
			return res.status(400).json({ message: "Teacher already accepted" });

		// // Get the current month and year for setting the course start date
		// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		// const date = new Date();
		// const month = date.getMonth();
		// const year = date.getFullYear();
		// const monthYear = `${months[month]}-${year}`;

		// // Prepare the course enrollment data
		// const courseEnrolled = { 
		// 	courseID, 
		// 	courseStart : courseStart ? courseStart : monthYear, // Use provided courseStart or the current month-year if not provided
		// };

		// Add student to the centre, update user account status and enroll student in the course
		centre.teachers.push(teacherId);
		user.accountStatus = "New"; // Mark the user's account as 'New'
		student.courseEnrolled.push(courseEnrolled); // Add the course to the student's courses
		student.timeAllotted = timeAllotted; // Set the time allotted to the student

		// Start a database session for a transactional operation
		const session = await mongoose.startSession();
		session.startTransaction();

		// Perform the save operations within the transaction
		try {
			await centre.save({ session }); // Save the updated centre
			await user.save({ session }); // Save the updated user
			await student.save({ session }); // Save the updated student
			await session.commitTransaction(); // Commit the transaction to apply all changes
		}
		catch (error) {
			await session.abortTransaction(); // Abort the transaction if there's an error
			throw error; // Rethrow the error to be caught by the outer catch block
		}
		finally {
			session.endSession(); // End the session whether or not the transaction was successful
		}

		// Return success response indicating the student was accepted
		return res.status(200).json({ message: "Student accepted" });
	}

	// Catch any errors and return an internal server error response
	catch (error) {
		return res.status(500).json({ message: "Internal Server error occurred while accepting Student" });
	}
}
