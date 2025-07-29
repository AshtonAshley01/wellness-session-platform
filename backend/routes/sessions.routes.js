const express = require('express');
const router = express.Router();
// Ensure this line does NOT use curly braces {}
const auth = require('../middleware/auth.middleware');
const Session = require('../models/session.model');

// @route   POST api/sessions/save-draft
// @desc    Create or update a session draft
// @access  Private
router.post('/save-draft', auth, async (req, res) => {
    const { title, tags, json_file_url } = req.body;

    try {
        // The 'auth' middleware adds the user object (with id) to the request.
        const newSession = new Session({
            title,
            tags,
            json_file_url,
            user_id: req.user.id,
            status: 'draft' // Explicitly set status to draft
        });

        const session = await newSession.save();
        res.status(201).json(session);
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

        // Make sure user owns the session
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

        // Make sure user owns the session
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
