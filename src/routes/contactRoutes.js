import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validateContact.js';

const router = express.Router();

// Apply validation middleware before controller
router.post('/', validateContact, submitContactForm);

export default router;
