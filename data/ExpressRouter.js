const express = require('express');
const postData = require('./seeds/01-posts')
const database = require('./db')

const router = express.Router();

router.get('/api/posts', (req, res) => {
    database.find()
        .then(post=>{res.status(200).json(post)})
        .catch(err=>{res.status(500).json({message: "The posts information could not be retrieved."})})
})

router.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    database.findById(id)
        .then (postId=>{res.status(200).json(postId)})
        .catch (err=>{return res.status(500).json({error: "The post information could not be retrieved."})})
})

router.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    database.findPostComments(id)
        .then (postId=>{
            if (postId.length > 0){
                return res.status(200).json(postId)
            } else {
                return res.status(404).json({message: "Comments not found"})
            }
        })
        .catch (err=>{return res.status(500).json({error: "The post's comments could not be retrieved."})})
})

router.post("/api/posts/", (req, res) => {
    if (!req.body.title || !req.body.contents) {
      return res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    } else if (req.body.title || req.body.contents) {
      database.insert(req.body)
        .then((post) => {
          res.status(201).json(post);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    }
  });

  router.post("/api/posts/:id/comments", (req,res) => {
    if (!req.body.text) {
        return res.status(400).json({
            errorMessage: "Please provide text for the comment"
        })
    }

    database.insertComment({post_id: req.params.id, ...req.body})
    .then((comment) => {
        if (comment > 0){
        res.status(201).json(comment)} else {
            return res.status(404).json({error: "Post not found"})
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({
            errorMessage: "There was an error while saving the comment to the database."
        })
    })
})

router.delete("/api/posts/:id", (req, res) => {
	database.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The post has been deleted",
				})
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist.",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "The post could not be removed.",
			})
		})
})


router.put ('/api/posts/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {return res.status(400).json({errorMessage: "Please provide title and contents for the post"})};
    database.update(req.params.id, req.body)
        .then (update => { if (update > 0) {return res.status(200).json("Successful update")} else {return res.status(404).json({message: "The post with the specified ID does not exist."})}})
        .catch (error => {console.log(error); return res.status(500).json({error: "The post information could not be modified."})})
})

module.exports = router