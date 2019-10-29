var stock = {
    randomAroundOne: function () {
        // Return a value between 0.95 and 0.1 more (1.05)
        const lowest = 0.95;
        return Math.random() / 10 + lowest;
    },

    getStockPrice: function (price) {
        balance = 1;
        if (price > 50) {
            balance = 0.9;
        } else if (price < 5) {
            balance = 1.2
        }
        return price * stock.randomAroundOne() * balance;
    }
};

module.exports = stock;