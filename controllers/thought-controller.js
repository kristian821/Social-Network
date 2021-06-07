const { Thought, User } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this ID'});
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

    getOneThought({ params }, res) {
        Thought.findOne(
            { _id: params.thoughtId }
        )
        .populate({
            path: 'replies',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this ID'});
            }
            res.json(dbThoughtData);
        })
    },

    addThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId},
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No User found with this ID'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    updateThought({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { thoughtText: body.thoughtText },
            { new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this ID'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought=> {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought found with this ID'});
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this ID'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $push: { reactions: body } },
            { new: true, runValidators: true}
        )
        .populate({
            path: 'replies',
            select: '-__v'
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No Thought found with this ID'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No Thought found with this ID'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;