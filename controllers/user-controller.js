const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: 'username'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: 'username'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this ID' });
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this ID'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'No user found with this ID'});
            }
            return Thought.deleteMany({ username: deletedUser.username });
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this ID'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true })
            .populate({
                path: 'users',
                select: 'username'
            })
            .select('username')
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No User found with this ID'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId},
            { $pull: { friends: params.friendId } },
            { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No User found with this ID'});
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = userController;