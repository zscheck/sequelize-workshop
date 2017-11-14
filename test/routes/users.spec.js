/* global define, it, describe, beforeEach, document */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/app');

const { fakeAuthor, createAuthorInDB, createBlogsInDB, createAuthorsInDB, nonExistentObjectId } = require('../lib/fake');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/authors', function () {
    this.timeout(6500);

    // 1. /api/authors
    it('GET /api/authors should respond with all authors', (done) => {
        chai.request(app)
            .get('/api/authors')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    // 2. /api/authors/:id
    it('GET /api/authors/:id should respond with a author when a valid ID is passed', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .get(`/api/authors/${author.id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.id).to.equal(author.id);
                    done();
                });
        });
    });
    it('GET /api/authors/:id should respond with 404 when an invalid ID is passed', (done) => {
        chai.request(app)
            .get(`/api/authors/${nonExistentObjectId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    // 3. /api/authors
    it('POST / should save a new author to the database', (done) => {
        chai.request(app)
            .post('/api/authors')
            .send(fakeAuthor)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.not.be.null;
                expect(res.body.id).to.exist;

                const savedAuthorId = res.body.id;

                chai.request(app)
                    .get(`/api/authors/${res.body.id}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        expect(res.body.id).to.exist;
                        expect(res.body.id).to.equal(savedAuthorId)

                        done();
                    });
            });
    });

    // 4. /api/authors/:id
    it('PUT /:id should update a author', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .put(`/api/authors/${author.id}`)
                .send({ firstName: 'Jane', lastName: 'Doe' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);

                    chai.request(app)
                        .get(`/api/authors/${author.id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            expect(res.body.id).to.equal(author.id);
                            expect(res.firstName).to.not.equal('John');
                            expect(res.lastName).to.not.equal('Smith');
                            done();
                        });
                });
        });
    });

    // 5. /api/authors/:id
    it('DELETE /:id should delete a author', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .delete(`/api/authors/${author.id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    chai.request(app)
                        .get(`/api/authors/${author.id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        })
                });
        })
    });

    // 6. /api/authors/:id/blogs
    it('GET /api/authors/:id/blogs should only respond with blogs for the requested author', (done) => {
        let authorId = null;

        createAuthorsInDB(3)
            .then(authors => {
                authorId = authors[0].id;

                return authors.map(author => createBlogsInDB(author, 5));
            })
            .then(() => {
                chai.request(app)
                    .get(`/api/authors/${authorId}/blogs`)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);

                        expect(res.body).to.be.instanceOf(Array);
                        expect(res.body.every(blog => blog.authorId === authorId)).to.equal(true);

                        done();
                    })
            });
    })
});