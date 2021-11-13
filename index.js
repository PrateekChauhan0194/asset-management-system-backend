const connectMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

connectMongo();

app.use(express.json());
app.use(cors());

// Available routes
app.use('/api/v1/borrower', require('./routes/borrower'));
// app.use('/api/v1/item', require('./routes/item'));

// // Request to add data based on loanSchema
// app.post('/add',
//     [
//         check('serviceNumber').isLength({ min: 1 }).withMessage('Service number is required'),
//         check('rank').isLength({ min: 1 }).withMessage('Rank is required'),
//         check('fullName').isLength({ min: 1 }).withMessage('Full name is required'),
//         check('department').isLength({ min: 1 }).withMessage('Department is required'),
//         check('itemName').isLength({ min: 1 }).withMessage('Item name is required'),
//         check('itemSerialNumber').isLength({ min: 1 }).withMessage('Item serial number is required'),
//         check('itemModel').isLength({ min: 1 }).withMessage('Item model is required'),
//         check('dateOfIssue').isLength({ min: 1 }).withMessage('Date of issue is required'),
//     ],
//     async (req, res) => {
//         //START - Return 400 status code in the response if request validation is failed
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         //END - Return 400 status code in the response if request validation is failed

//         try {
//             const { serviceNumber, rank, fullName, department, itemName, itemSerialNumber, itemModel, dateOfIssue } = req.body;

//             // Check if the service number is already in the databaseßßßß
//             const loan = await Loan.findOne({ serviceNumber: req.body.serviceNumber });
//             if (loan) {
//                 return res.status(409).json({
//                     error: `${loan.serviceNumber} already exists.`
//                 });
//             }

//             // If the service number is not in the database, then create a new loan
//             const newAsset = { serviceNumber, rank, fullName, department, itemName, itemSerialNumber, itemModel, dateOfIssue };
//             const newLoan = new Loan(newAsset);
//             newLoan.save();
//             res.json(newAsset);
//         } catch (error) {
//             console.error(error.message);
//             return res.status(500).send('Server Error');
//         }
//     });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});