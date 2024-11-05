import Leaves from "../model/leaves.js";
import Users from "../model/users.js";

export const allLeaves = async (req, res) => {
    try {
        const leaves = await Leaves.find();

        if(leaves) {
            return res.status(200).json(leaves);
        } else {
            return res.status(404).json({ message: "No leaves found" });
        }
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be fetched at the moment. Try again later' });
    }
}

export const watchLeaves = async (req, res) => {
    const { userID } = req.body;

    try {
        const leaves = await Leaves.find({ userID: userID });

        if(leaves) {
            return res.status(200).json(leaves);
        } else {
            return res.status(404).json({ message: "No leaves found" });
        }
    }
    
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be fetched at the moment. Try again later' });
    }
}

export const status = async (req, res) => {
    const { leaveID } = req.body;
    
    try {
        const leave = await Leaves.findById(leaveID);
        
        if(leave) {
            return res.status(200).json(leave);
        } else {
            return res.status(404).json({ message: "Leave not found" });
        }
    }
    
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be fetched at the moment. Try again later' });
    }
}

export const approveLeave = async (req, res) => {
    const { leaveID } = req.body;
    
    try {
        const leave = await Leaves.findById(leaveID);

        leave.leaveStatus = 'Approved';
        await leave.save();
        
        if(leave) {
            return res.status(200).json({ message: 'Leave successfully approved', leave });
        } else {
            return res.status(404).json({ message: "Leave not found" });
        }
    }
    
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be approved at the moment. Try again later' });
    }
}

export const declineLeave = async (req, res) => {
    const { leaveID } = req.body;
    
    try {
        const leave = await Leaves.findById(leaveID);
    
        leave.leaveStatus = 'Rejected';
        await leave.save();
        
        if(leave) {
            return res.status(200).json({ message: 'Leave declined', leave });
        } else {
            return res.status(404).json({ message: "Leave not found" });
        }
    }
    
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be fetched at the moment. Try again later' });
    }
}

export const applyLeave = async (req, res) => {
    const { userID, leaveType, leaveReason } = req.body;

    try {
        const user = await Users.findOne({ userID: userID });

        if(user) {
            const leave = new Leaves({
                userID,
                leaveType,
                leaveReason,
            });

            await leave.save();

            if(leave) {
                return res.status(201).json({ message: 'Leave applied successfully', leave });
            } else {
                return res.status(502).json({ message: "Leave cannot be created at the moment" });
            }
        }
    }
    
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Leaves cannot be fetched at the moment. Try again later' });
    }
}