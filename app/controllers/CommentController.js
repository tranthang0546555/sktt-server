const Comment = require('../models/Comment')
const ObjectId = require('mongodb').ObjectId

class CommentController {

    async getComment(req, res, next) {

        const postId = req.query.postId

        // const data = await Comment.find({ postId: ObjectId(postId) }).exec()

        const data = await Comment.aggregate([
            {
                $match: { postId: ObjectId(postId) }
            },
            {
                $project: {
                    message: 1,
                    postId: 1,
                    commentedBy: 1,
                    createdAt: 1,
                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: 'commentedBy',
                    foreignField: '_id',
                    as: 'commentedBy',

                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                avatar: 1,
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ]).exec()

        return res.json(data)
    }

    async postComment(req, res, next) {
        const { postId, message, commentedBy } = req.body
        // console.log(req.body)
        await Comment.create({ postId, message, commentedBy })
        res.send({ message: 'Bình luận thành công' })
    }

    async deleteComment(req, res) {
        const { commentId } = req.body
        await Comment.deleteOne({ _id: ObjectId(commentId) })
        console.log(commentId)
        res.send({ 'message': 'Xoá thành công' })
    }
}

module.exports = new CommentController