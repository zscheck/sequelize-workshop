const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', (req, res) => {
  db.Blog.findAll().then(blogs => {
    res.status(200).send(blogs);
  });
});
router.get('/featured', (req, res) => {
  db.Blog.findAll({
      where: {
        featured: true
      }
    }).then(blogs => {
      res.status(200).send(blogs);
    })
    .catch(console.error);
});
router.get('/:id', (req, res) => {
  db.Blog
    .findById(req.params.id)
    .then(blogs => {
      if (blogs) return res.status(200).send(blogs);
      else return res.status(404).send();
    })
    .catch(console.error);
});
router.post('/', (req, res) => {
  db.Blog
    .create({
      authorId: req.query.authorId,
      title: req.params.title,
      article: req.params.article,
      published: req.params.published,
      featured: req.params.featured,
      _id: req.query.authorId
    })
    .then(blog => {
      console.log('Inserted blog');
      res.status(201).send(blog);
    })
    .catch(console.error);
});
router.put('/:id', (req, res) => {
  db.Blog
    .update(
      {
        title: req.body.title,
        article: req.body.article,
        published: req.body.published,
        featured: req.body.featured
      },
      { where: { id: { $eq: req.params.id } } }
    )
    .then(blogs => {
      console.log('Saved blog');
      res.status(204).send(blogs);
    });
});
router.delete('/:id', (req, res) => {
  db.Blog
    .findById(req.params.id)
    .then(blogs => {
      return blogs.destroy();
    })
    .then(() => {
      console.log('Removed blog');
      res.status(200).send();
    })
    .catch(console.error);
});

module.exports = router;