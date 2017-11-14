const db = require('../../server/db/models');

const fakeAuthor = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@gmail.com'
};

const fakeBlogs = [{
    title: 'Helo World',
    article: `Brian Kernighan wrote the first "hello, world" program as part of the
        documentation for the BCPL programming language developed by Martin Richards. 
        BCPL was used while C was being developed at Bell Labs a few years before the 
        publication of Kernighan and Ritchie's C book in 1972.`,
    published: Date.now(),
    featured: false
}, {
    title: 'Yak Shaving',
    article: `Yak shaving is programming lingo for the seemingly endless series of small
        tasks that have to be completed before the next step in a project can move forward.`,
    published: null,
    featured: true
}];

const nonExistentObjectId = 3590351935895;

const createAuthorInDB = () => db.Author.create(fakeAuthor);
const createBlogInDB = (author) => db.Blog.create(fakeBlogs[0]).then(newBlog => {
    newBlog.authorId = author.id;

    return newBlog.save();
});

const createAuthorsInDB = (count) => Promise.all(new Array(count).fill(0).map(createAuthorInDB));
const createBlogsInDB = (author, count) => Promise.all(new Array(count).fill(0).map(i => createBlogInDB(author)));

module.exports = {
    fakeAuthor,
    fakeBlogs,
    nonExistentObjectId,
    createAuthorInDB,
    createBlogInDB,
    createAuthorsInDB,
    createBlogsInDB
};