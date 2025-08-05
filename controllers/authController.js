const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    return res.redirect('/posts');
  }
  res.render('login', { error: 'Invalid credentials' });
};

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hash, passwordHistory: { create: [{ password: hash }] } }
    });
    req.session.userId = user.id;
    res.redirect('/posts');
  } catch {
    res.render('signup', { error: 'User already exists' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.getChangePassword = (req, res) => {
  res.render('change-password');
};

exports.postChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    include: { passwordHistory: { orderBy: { createdAt: 'desc' }, take: 3 } }
  });
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    return res.render('change-password', { error: 'Incorrect old password' });
  }
  for (const ph of user.passwordHistory) {
    if (await bcrypt.compare(newPassword, ph.password)) {
      return res.render('change-password', { error: 'Cannot reuse last 3 passwords' });
    }
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hash,
      passwordHistory: { create: { password: hash } }
    }
  });
  res.redirect('/posts');
};
