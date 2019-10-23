const express = require('express');
const app = express();
const port = 1338;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const morgan = require('morgan');

// const mongoose = require('mongoose');
// const Stocks = require('./models/stock');
const stock = require('./models/rate')

// mongoose.connect('mongodb://localhost:27017/project');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// external routes
const auth = require('./routes/auth');
// const stocks = require('./routes/stocks');
app.use('/auth', auth);
// app.use('/stocks', stocks);

// app.use('/', index);
app.get('/', async (req, res) => {
    return res.status(200).send();
});

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

var brands = [
    {
        name: "Discmania",
        price: 20,
    },
    {
        name: "Innova",
        price: 20,
    },
    {
        name: "Discraft",
        price: 20,
    },
    {
        name: "DynamicDiscs",
        price: 20,
    }
];

setInterval(function () {
    brands.map((brand) => {
        brand.price = stock.getStockPrice(brand.price);

        return brand;
    });
    console.log(brands);
    
    io.emit("stocks", brands);
}, 5000); 

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
