const express = require('express');
const app = express();
const port = 1338;
const http = require('http').Server(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project');

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
    const morgan = require('morgan');
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// external routes
const auth = require('./routes/auth');
app.use('/auth', auth);

// app.use('/', index);
app.get('/', async (req, res) => {
    return res.status(200).send();
});

const stock = require('./models/rate');
var brands = [
    {
        label: "Discmania",
        data: [20],
        borderColor: ['#3886da'],
        borderWidth: 3
    },
    {
        label: "Innova",
        data: [20],
        borderColor: ['#38da8e'],
        borderWidth: 3
    },
    {
        label: "Discraft",
        data: [20],
        borderColor: ['#cfda38'],
        borderWidth: 3
    },
    {
        label: "DynamicDiscs",
        data: [20],
        borderColor: ['#cd38da'],
        borderWidth: 3
    }
];

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
    });
});

setInterval(function () {
    brands.map((brand) => {
        if (brand.data.length > 20) {
            brand.data.shift();
        }
        brand.data.push(stock.getStockPrice(brand.data[brand.data.length - 1]));
        return brands;
    });

    io.emit("stocks", brands);
}, 5000);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
http.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = http;
