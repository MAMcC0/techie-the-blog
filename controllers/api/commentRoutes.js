const router = require('express').Router();
const { Comment, Post } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/comments', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [
                {
                    model: Post,
                    attributes: ["username", "content", "user_id"]
                },
            ],
        });

        const comments = commentData.map((comment) => comment.get({plain:true}));

        res.render('homepage', {
            comments,
            logged_in: req.session.logged_in,
        });
    } catch (err){
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/comments/:id', withAuth, async (req,res) => {
    try{
        const commentData = await Comment.findbyPk(req.params.id);

        const comment = commentData.get({plain:true});

        res.render('post', {
            comment,
            logged_in: req.session.logged_in,
        });
    } catch (err){
        res.status(500).json(err);
    }
});

router.post('/comment', async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        });

        res.status(200).json(newComment);
    }catch(err){
        res.status(400).json(err);
    }
});

module.exports = router;