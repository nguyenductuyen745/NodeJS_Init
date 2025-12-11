const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

const handlebars = require('./helpers/handlebars');
const sortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

// Override method
app.use(methodOverride('_method'));

// Https logging
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

// Custom Middleware
app.use(sortMiddleware);

// Templates engine
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    helpers: handlebars,
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Middleware để parse dữ liệu từ form (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware để parse JSON (application/json)
app.use(express.json());

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
