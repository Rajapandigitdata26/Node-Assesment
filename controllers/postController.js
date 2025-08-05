const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { OR: [{ isPublic: true }, { userId: req.session.userId }] },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  res.render('posts', { posts });
};

exports.getMyPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { userId: req.session.userId },
    orderBy: { createdAt: 'desc' }
  });
  res.render('my-posts', { posts });
};

exports.getCreatePost = (req, res) => {
  res.render('create-post');
};

exports.postCreatePost = async (req, res) => {
  const { content, isPublic } = req.body;
  await prisma.post.create({
    data: {
      content,
      isPublic: isPublic === 'on',
      userId: req.session.userId
    }
  });
  res.redirect('/posts');
};
