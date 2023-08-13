const User  = require('../models/user.js');
const Thought = require('../models/thought');

module.exports = {
    async getUsers(req, res) {
        try{
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try{
            const user = await User.findOne({_id: req.params.userId}).select(
                '-__v'
            );
            if (!user) {
                return res.status(404).json({message:'No user with that ID' });
            }

            res.json(user);
        }catch (err) {
            res.status(500).json(err);
          }
    },
    async createUser(req, res) {
        try {
          const user = await User.create(req.body);
          res.json(user);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      }, 
      async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
          }
    
          res.json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async deleteUser(req, res) {
        try {
          const user = await User.findOneAndDelete({
            _id: req.params.userId,
          });
    
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
    
          await Thought.deleteMany({ _id: { $in: user.toughts } });
          res.json({ message: 'User and thoughts deleted!' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async addFriend(req, res) {
        const { userId, friendId } = req.params;
      
        const user = await User.findById(userId);
      
        if (!user) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
      
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { friends: friendId } },
          { new: true, runValidators: true }
        );
      
        if (!updatedUser) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
      
        res.json(updatedUser);
      },
      async removeFriend(req, res) {
        const { userId, friendId } = req.params;
      
        const user = await User.findById(userId);
      
        if (!user) {
          return res.status(404).json({ message: "No user with this id!" });
        }
      
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { friends: friendId } },
          { new: true }
        );
      
        if (!updatedUser) {
          return res.status(404).json({ message: "No user with this id!" });
        }
      
        res.json(updatedUser);
      }
}