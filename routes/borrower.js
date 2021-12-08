const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Borrower = require('../models/Borrower');
const Item = require('../models/Item');
const fetchUser = require('../middleware/fetchUser');

// Route 1: Get all borrowers
router.get('/getAll', fetchUser, async (req, res) => {
    try {
        const borrowers = await Borrower.find();
        res.json(borrowers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route 3: Get a borrower by id
router.get('/getById/:id', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);
        if (!borrower) {
            return res.status(404).json({ msg: 'Borrower not found' });
        }
        res.json(borrower);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Borrower not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Route 4: Add a borrower
router.post('/add', [
    check('serviceNumber', 'Service Number is required').not().isEmpty(),
    check('rank', 'Rank is required').not().isEmpty(),
    check('fullName', 'Full Name is required').not().isEmpty(),
    check('department', 'Department is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { serviceNumber, rank, fullName, department } = req.body;

    try {
        let borrower = await Borrower.findOne({ serviceNumber });

        if (borrower) {
            return res.status(400).json({ errors: [{ msg: 'Loan card already exists' }] });
        }

        borrower = new Borrower({
            serviceNumber,
            rank,
            fullName,
            department,
        });

        await borrower.save();

        res.json(borrower);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route 5: Update a borrower
router.put('/update/:id', [
    check('serviceNumber', 'Service Number is required').not().isEmpty(),
    check('rank', 'Rank is required').not().isEmpty(),
    check('fullName', 'Full Name is required').not().isEmpty(),
    check('department', 'Department is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { serviceNumber, rank, fullName, department } = req.body;

    try {
        const borrower = await Borrower.findById(req.params.id);

        if (!borrower) {
            return res.status(404).json({ errors: [{ msg: 'Borrower does not exist' }] });
        }

        // const item = await Item.findOne({ serviceNumber: borrower.serviceNumber });
        // if (item) {
        //     return res.status(400).json({ errors: [{ msg: 'Unable to edit. Person has one or more loaned assets.' }] });
        // }

        const borrower2 = await Borrower.findOne({ serviceNumber });
        if (borrower2 && borrower2.id != req.params.id) {
            return res.status(400).json({ errors: [{ msg: 'Another borrower with same service number already exists.' }] });
        }

        borrower.serviceNumber = serviceNumber;
        borrower.rank = rank;
        borrower.fullName = fullName;
        borrower.department = department;

        await borrower.save();

        res.json(borrower);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route 7: Delete a borrower
router.delete('/delete/:id', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);

        if (!borrower) {
            return res.status(400).json({ errors: [{ msg: 'Borrower does not exist' }] });
        }

        const item = await Item.findOne({ serviceNumber: borrower.serviceNumber });
        if (item) {
            return res.status(400).json({ errors: [{ msg: 'Unable to delete. Person has one or more loaned assets.' }] });
        }

        await Borrower.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Loan card deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;