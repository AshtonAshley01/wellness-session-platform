const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const Session = require('../models/session.model');

// @route   POST api/sessions/save-draft
// @desc    Create or update a session draft
// @access  Private
router.post('/save-draft', auth, async (req, res) => {
    const { title, tags, json_file_url } = req.body;

    try {
        
        const newSession = new Session({
            title,
            tags,
            json_file_url,
            user_id: req.user.id,
            status: 'draft' 
        });

        const session = await newSession.save();
        res.status(201).json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/sessions/draft/:id
// @desc    Update an existing session draft
// @access  Private
router.put('/draft/:id', auth, async (req, res) => {
    const { title, tags, json_file_url } = req.body;

    try {
        let session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        
        if (session.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        
        session.title = title;
        session.tags = tags;
        session.json_file_url = json_file_url;

        const updatedSession = await session.save();
        res.json(updatedSession);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/sessions/publish
// @desc    Publish a session
// @access  Private
router.post('/publish', auth, async (req, res) => {
    const { id } = req.body;

    try {
        let session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        
        if (session.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        session.status = 'published';
        await session.save();

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/sessions/my-sessions
// @desc    Get all sessions for the logged-in user (drafts and published)
// @access  Private
router.get('/my-sessions', auth, async (req, res) => {
    try {
        const sessions = await Session.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sessions/my-sessions/:id
// @desc    Get a single session by ID
// @access  Private
router.get('/my-sessions/:id', auth, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        
        if (session.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/sessions
// @desc    Get all published sessions (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
