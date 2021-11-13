const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Borrower = require('../models/Borrower');

// Route 1: Get all borrowers
router.get('/getAll', async (req, res) => {
    try {
        const borrowers = await Borrower.find();
        res.json(borrowers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route 2: Add a borrower
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
            return res.status(400).json({ errors: [{ msg: 'Borrower already exists' }] });
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

// Route 3: Update a borrower
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

// Route 4: Delete a borrower
router.delete('/delete/:id', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);

        if (!borrower) {
            return res.status(400).json({ errors: [{ msg: 'Borrower does not exist' }] });
        }

        await Borrower.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Borrower deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;