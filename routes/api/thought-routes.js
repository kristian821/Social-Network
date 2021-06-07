const router = require('express').Router();
const { getAllThoughts, getOneThought, addThought, updateThought, deleteThought, addReaction, removeReaction } = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts).post(addThought);

router.route('/:thoughtId').get(getOneThought).put(updateThought);

router.route('/:userId/:thoughtId').delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;