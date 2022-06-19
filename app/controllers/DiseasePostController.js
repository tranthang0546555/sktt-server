const DiseasePost = require('../models/DiseasePost')
const DiseaseGroup = require('../models/DiseaseGroup')
const ObjectId = require('mongodb').ObjectId

class DiseasePostController {

    async index(req, res, next) {
        const option = req.query.option || 'newest'
        let page = 1
        if (parseInt(req.query.page)) page = parseInt(req.query.page) > 1 ? parseInt(req.query.page) : 1

        const limit = 10
        let sort = {}
        let skip = limit * (page - 1)
        switch (option) {
            case 'newest': sort = { 'createdAt': -1 }; break;
            case 'popular': sort = { 'viewCount': -1 }; break;
            case 'rate': sort = { 'numLike': -1 }; break;
            default: sort = { 'createdAt': -1 }
        }

        const data = await DiseasePost.aggregate([
            {
                $project: {
                    slug: 1,
                    title: 1,
                    description: 1,
                    contents: 1,
                    createdBy: 1,
                    groupBy: 1,
                    viewCount: 1,
                    likeList: 1,
                    numLike: { $add: { $size: '$likeList' } },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                avatar: 1,
                            }
                        }
                    ],
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $lookup: {
                    from: 'diseasegroups',
                    localField: 'groupBy',
                    foreignField: '_id',
                    as: 'groupBy'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments',

                    pipeline: [
                        {
                            $lookup: {
                                from: 'uses',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'comment'
                            }
                        }
                    ]
                }
            },

            {
                $sort: sort,
            },
            {
                $skip: skip,
            },

        ]).limit(limit)

        const countPost = await DiseasePost.find({}).sort(sort).count()
        // console.log(data)
        res.json(
            {
                // data,
                data,
                page,
                sort,
                countPost,
                limit,
            }
        )
    }

    async getDiseasePost(req, res, next) {

        const slug = req.params.slug

        // const data = await DiseasePost.find({ slug: slug }).exec()

        const data = await DiseasePost.aggregate([

            {
                $match: { slug: slug }
            },

            {
                $project: {
                    slug: 1,
                    title: 1,
                    description: 1,
                    modeContent: 1,
                    content: 1,
                    createdBy: 1,
                    groupBy: 1,
                    viewCount: 1,
                    likeList: 1,
                    numLike: { $add: { $size: '$likeList' } },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            }
                        }
                    ],
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $lookup: {
                    from: 'diseasegroups',
                    localField: 'groupBy',
                    foreignField: '_id',
                    as: 'groupBy'
                }
            },

            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments'
                }
            },

            {
                $sort: {
                    createdAt: 1,
                }
            }
        ])

        if (data.length) {
            await DiseasePost.updateOne({ slug: slug }, { viewCount: (data[0].viewCount + 1) })
            return res.json(data)
        }

        return res.status(404).send({ message: 'Không tìm thấy bài viết chứng bệnh này' })
    }

    async vote(req, res) {
        const { userId, postId } = req.body
        const post = await DiseasePost.find({ _id: ObjectId(postId) })
        let likeList = post[0].likeList
        const exist = likeList.includes(userId)

        if (exist) {
            likeList = likeList.filter(id => id !== userId)
            await DiseasePost.updateOne({ _id: ObjectId(postId) }, { likeList: likeList })
            res.json({ message: 'Đã bỏ thích bài viết' })
        }
        else {
            likeList.push(userId)
            await DiseasePost.updateOne({ _id: ObjectId(postId) }, { likeList: likeList })
            res.json({ message: 'Đã thích bài viết' })
        }
    }
}

module.exports = new DiseasePostController