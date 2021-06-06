const express = require('express');
const checkAuth = require('../Middleware/Authenticate.js');
const router = express.Router();
const User = require("../Models/user");
const Notes = require("../Models/Notes");

router.post('/userDetails', checkAuth, async (req, res) => {
	const userId = req.user.userId;
	const user = await User.findById(userId);
	if (user) {
		var obj = {
			username: user.username,
			name: user.name,
			mobile_number: user.mobile_number,
			email: user.email,
		}
		res.status(200).send({
			status: true,
			message: "Found",
			user: obj,
		});
	} else {
		res.status(400).send({
			status: false,
			message: "Bad request",
		});
	}
});

router.post('/createNotes', checkAuth, async (req, res) => {
	console.log("notes req", req.body);
	if (!req.body.text || !req.body.name) {
		return res.status(400).send({ 'status': false, 'message': 'missing fields' })
	}
	const userId = req.user.userId;
	const user = await User.findById(userId);
	if (user) {
		var text = req.body.text;
		var name = req.body.name;
		var obj = {
			text: text,
			name: name,
			userId: userId
		}
		var note = new Notes(obj);
		note.save().then((note_res) => {
			if (note_res) {
				res.status(200).send({
					status: true,
					message: "notes created successfully",
					notes: note_res
				});
			} else {
				res.status(400).send({
					status: false,
					message: "failed to create note"
				});
			}
		});
	} else {
		res.status(400).send({
			status: false,
			message: "user not found",
		});
	}
});

router.get('/getNotesofUser', checkAuth, async (req, res) => {
	const userId = req.user.userId;
	console.log(req.body)
	const user = await User.findById(userId);
	if (user) {
		var notes = await Notes.find({ userId: userId });
		if (notes.length != 0) {
			res.status(200).send({
				status: true,
				message: "Notes Found",
				Notes: notes,
			});
		}
		else {
			res.status(400).send({
				status: false,
				message: "notes not found for this user",
			});
		}
	} else {
		res.status(400).send({
			status: false,
			message: "user not found",
		});
	}
});

router.post('/updateNotes', checkAuth, async (req, res) => {
	const userId = req.user.userId;
	console.log(req.body)
	if (!req.body.text || !req.body.notesId) {
		return res.status(400).send({ 'status': false, 'message': 'missing fields' })
	}
	const user = await User.findById(userId);
	if (user) {
		var notes = await Notes.findOne({ _id: req.body.notesId });
		if (notes) {
			if (notes.userId != userId) {
				res.status(400).send({
					status: false,
					message: "access denied to update"
				});
			}
			else {
				var text = req.body.text ? req.body.text : notes.text;
				Notes.findOneAndUpdate({ _id: req.body.notesId }, { $set: { text: text } }, { new: true }).then((notesRes) => {
					if (notesRes) {
						res.status(200).send({
							status: true,
							message: "Notes updated",
							Notes: notesRes,
						});
					}
					else {
						res.status(400).send({
							status: false,
							message: "unable to update notes"
						});
					}
				});
			}
		}
		else {
			res.status(400).send({
				status: false,
				message: "notes not found"
			});
		}
	} else {
		res.status(400).send({
			status: false,
			message: "user not found",
		});
	}
});

router.delete('/deleteNotes/:notesId', checkAuth, async (req, res) => {
	const userId = req.user.userId;
	var notesId = req.params.notesId;
	if (!notesId) {
		return res.status(400).send({ 'status': false, 'message': 'missing notesId' })
	}
	const user = await User.findById(userId);
	if (user) {
		var notes = await Notes.findOne({ _id: notesId });
		if (notes) {
			if (notes.userId != userId) {
				res.status(400).send({
					status: false,
					message: "access denied to delete"
				});
			}
			else {
				Notes.findOneAndDelete({ _id: notesId }).then((notesRes) => {
					if (notesRes) {
						res.status(200).send({
							status: true,
							message: "Notes deleted successfully",
							Notes: notesRes,
						});
					}
					else {
						res.status(400).send({
							status: false,
							message: "unable to delete notes"
						});
					}
				});
			}
		}
		else {
			res.status(400).send({
				status: false,
				message: "notes not found"
			});
		}
	} else {
		res.status(400).send({
			status: false,
			message: "user not found",
		});
	}
});

module.exports = router;