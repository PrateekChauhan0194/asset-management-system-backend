const connectMongo = require('./db');
const { check, validationResult } = require('express-validator');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

connectMongo();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('This is asset management app backend.');
})

// Request to add data based on loanSchema
app.post('/add',
    [
        check('serviceNumber').isLength({ min: 1 }).withMessage('Service number is required'),
        check('rank').isLength({ min: 1 }).withMessage('Rank is required'),
        check('fullName').isLength({ min: 1 }).withMessage('Full name is required'),
        check('department').isLength({ min: 1 }).withMessage('Department is required'),
        check('itemName').isLength({ min: 1 }).withMessage('Item name is required'),
        check('itemSerialNumber').isLength({ min: 1 }).withMessage('Item serial number is required'),
        check('itemModel').isLength({ min: 1 }).withMessage('Item model is required'),
        check('dateOfIssue').isLength({ min: 1 }).withMessage('Date of issue is required'),
    ],
    (req, res) => {
        console.log(req.body);
        //START - Return 400 status code in the response if request validation is failed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //END - Return 400 status code in the response if request validation is failed

        const { serviceNumber, rank, fullName, department, itemName, itemSerialNumber, itemModel, dateOfIssue } = req.body;
        res.send(req.body);
    });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});