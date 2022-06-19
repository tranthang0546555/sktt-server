const router = require('express').Router()
const CommentController = require('../../app/controllers/CommentController')

router.get('/get', CommentController.getComment)
router.post('/post', CommentController.postComment)
router.post('/delete', CommentController.deleteComment)

module.exports = router