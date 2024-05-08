const User = require("../models/user.model.js");
const Statement = require("../models/statement.model.js");

let lastInvoiceNumber = 0;
exports.generateStatement = catchAsyncErrors(async (req, res) => {    
	
    const user = User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    try {
        // Generate new invoice ID
        lastInvoiceNumber++;
        const newId = 'INV-' + String('000' + lastInvoiceNumber).slice(-3);
        
        const statement = await Statement.create({
            user: user._id,
            details: req.body.details,
            amount: req.body.amount,
            orderId: newId,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

    

    const newId = 'INV-' + String('000' + lastInvoiceNumber).slice(-3);
    if (!statement) {
        const newStatement = await Statement.create({
            user: userId,
            details,
            amount,
            orderId: uuidv4(),
        });
        if (!newStatement) {
            throw new ApiError(500, "Something went wrong");
        }

        res.status(201).json(new ApiResponse(201, newStatement, "Success"));
    } else {
        res.status(200).json(new ApiResponse(200, statement, "Success"));
    }
});