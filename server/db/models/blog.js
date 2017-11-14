'use strict';
module.exports = (sequelize, DataTypes) => {
  var Blog = sequelize.define('Blog', {
    authorId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    article: DataTypes.TEXT,
    featured: DataTypes.BOOLEAN,
    published: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Blog.belongsTo(models.Author, {
          as: 'author',
          foreignKey: 'authorId',
          targetKey: 'id'
        });
      }
    }
  });
  return Blog;
};