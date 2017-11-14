const express = require('express');
const router = express.Router();
const db = require('../models/index');

// GET	/api/authors/ Retrieve all authors 
router.get('/', (req, res) => {
    db.Author
        .findAll()
        .then(authors => {
            res.status(200).send(authors);
        })
        .catch(console.error);
});

//GET /api/authors/:id Retrieve author ID Information
router.get('/:id', (req, res) => {
    db.Author
        .findById(req.params.id)
        .then(author => {
            if (!author) res.status(404).send(null);
            res.status(200).send(author);
            // console.log(author);
        })
        .catch(console.error);
})

router.get('/:id/blogs', (req, res) => {
    db.Blog
        .findAll({
            where:{
                authorId: req.params.id
            }
        })
        .then(authors => {
            res.status(200).send(authors);
        })
        .catch(console.error);
});

//POST /api/authors Create a new author
router.post('/', (req, res) => {
    db.Author
        .create({
            firstName: req.params.firstName,
            lastName: req.params.lastName,
            email: req.params.email
        })
        .then(author => {
            res.status(201).send(author);
        })
        .catch(console.error);
});

//PUT /api/authors/:id Update a author
router.put('/:id', (req, res) => {
    db.Author
        .update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
            },{
            where: { id: { $eq: req.params.id } }
        })
        .then(author => {
            res.status(204).send(author);
        })
        .catch(console.error);
});

//DELETE /api/authors/:id Delete a author
router.delete('/:id', (req, res) => {
        db.Author.findById(req.params.id)
            .then(author => {
                return author.destroy();
            })
            .then(()=>{
                res.status(200).send();
            })
            .catch(console.error);
    });

module.exports = router;