const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Item = require('../models/Item');
const Borrower = require('../models/Borrower');
const fetchUser = require('../middleware/fetchUser');

// Route 1: Get all items
router.get('/getAll', fetchUser, async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Route 2: Get items based on serviceNumber
router.get('/getItems/:serviceNumber', fetchUser, async (req, res) => {
    try {
        const items = await Item.find({ serviceNumber: req.params.serviceNumber });
        res.json(items);
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Route 3: Get item based on id
router.get('/getItem/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Route 4: Add new item
router.post('/addItem', [
    check('serviceNumber', 'Service number is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('serialNumber', 'Serial number is required').not().isEmpty(),
    check('model', 'Model is required').not().isEmpty(),
    check('gigNumber', 'GIG number is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { serviceNumber, name, serialNumber, model, gigNumber } = req.body;

    try {
        let item = await Item.findOne({ serviceNumber, name, serialNumber, model, gigNumber });

        if (item) {
            return res.status(400).json({ errors: [{ msg: 'Item already exists' }] });
        }

        const itemBySerialNumber = await Item.findOne({ serialNumber });
        if (itemBySerialNumber) {
            return res.status(400).json({ errors: [{ msg: 'Item with this serial number already exists' }] });
        }

        const itemByGigNumber = await Item.findOne({ gigNumber });
        if (itemByGigNumber) {
            return res.status(400).json({ errors: [{ msg: 'Item with this GIG number already exists' }] });
        }

        item = new Item({
            serviceNumber,
            name,
            serialNumber,
            model,
            gigNumber,
        });

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Route 5: Update item based on id
router.put('/updateItem/:id', [
    check('serviceNumber', 'Service number is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('serialNumber', 'Serial number is required').not().isEmpty(),
    check('model', 'Model is required').not().isEmpty(),
    check('gigNumber', 'GIG number is required').not().isEmpty(),
], async (req, res) => {
    const { serviceNumber, name, serialNumber, model, gigNumber } = req.body;

    try {
        let item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
        }

        if (serviceNumber !== 'inventory') {
            const borrower = await Borrower.findOne({ serviceNumber });
            if (!borrower) {
                return res.status(404).json({ errors: [{ msg: `Loan card not found` }] });
            }
        }

        item.serviceNumber = serviceNumber;
        item.name = name;
        item.serialNumber = serialNumber;
        item.model = model;
        item.gigNumber = gigNumber;
        item.dataCreationDate = Date.now();

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Route 6: Delete item based on id
router.delete('/deleteItem/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
        }

        await item.delete();
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

module.exports = router;