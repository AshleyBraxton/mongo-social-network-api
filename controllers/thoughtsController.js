const { User } = require('../models/user');
const { Thought } = require('../models/thought');

module.exports = {
    async getThoughts(req, res) {
        try{
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try{
            const thought = await Thought.findOne({_id: req.params.thoughtId}).select(
                '-__v'
            );
            if (!thought) {
                return res.status(404).json({message:'No thought with that ID' });
            }

            res.json(thought);
        }catch (err) {
            res.status(500).json(err);
          }
    },
    async createThought(req, res) {
        const newThought = await Thought.create(req.body);
        const userData = await User.findOneAndUpdate(
          {_id:req.body.userId},
          {$push:{ thoughts:newThought._id}},
          {new:true}
        );
      
        res.json(userData);
    },
    async updateThought(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndDelete({
            _id: req.params.thoughtId,
          });
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async addReaction(req, res) {
        const thought = await Thought.findOneAndUpdate({
          _id: req.params.thoughtId
        }, {
          $addToSet: {
            reactions: req.body
          }
        }, {
          runValidators: true,
          new: true
        });
      
        if (!thought) {
          res.status(404).json({ message: 'No thought found with that ID' });
        } else {
          res.json(thought);
        }
    },
    async deleteReaction(req, res) {
        console.log(req.params);
      
        const thought = await Thought.findOneAndUpdate({
          _id: req.params.thoughtId
        }, {
          $pull: {
            reactions: {
              reactionId: req.params.reactionId
            }
          }
        }, {
          runValidators: true,
          new: true
        });
      
        if (!thought) {
          res.status(404).json({ message: 'No thought found with that ID' });
        } else {
          res.json(thought);
        }
    }
      
}