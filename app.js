const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use('/', authRoutes);
app.use('/posts', postRoutes);

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
