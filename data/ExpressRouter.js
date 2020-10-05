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

// router.post("/api/posts", (req, res) => {
//     if(!req.body) {
//         console.log("No request body")
//     }
    
// 	// if (!req.body.title || !req.body.contents) {
// 	// 	return res.status(400).json({
// 	// 		errorMessage: "Missing title or content",
// 	// 	})
// 	// }
//     database.insert(req.body)
// 		.then((post) => {
// 			return res.status(201).json(post)
// 		})
// 		.catch((error) => {
// 			console.log(error)
// 			return res.status(500).json({
// 				message: "Error adding the post",
// 			})
// 		})
// })

router.delete("/api/posts/:id", (req, res) => {
	database.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The post has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The post could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the post",
			})
		})
})

module.exports = router