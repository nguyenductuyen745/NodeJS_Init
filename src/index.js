const path = require('path');
const dayjs = require('dayjs');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const { DATE_FORMAT } = require('./constants');

const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/SortMiddleware');

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
app.use(SortMiddleware);

// Templates engine
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const icons = {
          default: 'bi bi-funnel-fill',
          asc: 'bi bi-sort-down-alt',
          desc: 'bi bi-sort-down',
        };
        const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc',
        };

        const sortType = field === sort.column ? sort.type : 'default';
        const icon = icons[sortType];
        const newType = types[sortType];

        return `
          <a href='?_sort&column=${field}&type=${newType}'><i class="${icon}"></i></a>
        `;
      },
      dateFormater: (date) => {
        return dayjs(date).format(DATE_FORMAT);
      },
    },
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
