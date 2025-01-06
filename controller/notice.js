import notices from "../model/notices.js"

export const allPublicNotice = async (req, res) => {
    try {
        const newNotices = await notices.find({ type: 'public' });
        return res.status(200).json(newNotices);
    }
    
    catch (err) {
        return res.status(500).json({ message: "Notices cannot be fetched at this moment" });
    }
}

export const allNotice = async (req, res) => {
    const { role } = req.body;

    if(role == 'authority') {
        try {
            const newNotices = await notices.find();
            
            return res.status(200).json(newNotices);
        }
        
        catch (err) {
            return res.status(500).json({ message: "Notices cannot be fetched at this moment" });
        }
    } else {
        if(role == 'public' || role == 'closed') {
            try {
                const newNotices = await notices.find({
                    $or: [
                        { type: 'public' },
                        { type: 'closed' }
                    ]
                })
    
                return res.status(200).json(newNotices);
            }

            catch (err) {
                return res.status(500).json({ message: 'Cannot fetch notices at this moment' });
            }
        } else {
            return res.status(401).json({ message: "You are not authorized to view this page" });
        }
    }
}

export const createNotice = async (req, res) => {
    const { title, description, type } = req.body;

    try {
        const newNotice = new notices({
            title,
            description,
            type
        });

        await newNotice.save();

        if(!newNotice) {
            return res.status(404).json({ message: "Notice cannot be created at this moment" });
        } else {
            return res.status(201).json({ message: "Notice created successfully", newNotice });
        }
    }

    catch(err) {
        return res.status(500).json({ message: 'Cannot create notice at this moment' });
    }
}

export const editNotice = async (req, res) => {
    const { id, title, description, type } = req.body;
    
    try {
        const oldNotice = await notices.findById(id);

        if(!oldNotice) {
            return res.status(404).json({ message: 'Cannot find specified notice' });
        }

        oldNotice.title = title;
        oldNotice.description = description;
        oldNotice.type = type;

        await oldNotice.save();

        return res.status(201).json({ message: 'Notice updated successfully', oldNotice });
    }
    
    catch(err) {
        return res.status(500).json({ message: 'Cannot create notice at this moment' });
    }
}

export const deleteNotice = async (req, res) => {
    const { id } = req.body;

    try {
        const deletedNotice = await notices.findByIdAndDelete(id);

        if(!deletedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        } else {
            return res.status(200).json({ message: "Notice deleted successfully" });
        }
    }

    catch(err) {
        return res.status(500).json({ message: 'Cannot delete notice at this moment' });
    }
}