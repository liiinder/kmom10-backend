// let value = 20;

// const randomAroundOne = function () {
//     // Return a value between 0.99505 and 0.01 more (1.00505)
//     // added the extra 0.00005 for it to be a bit weighted towards gaining value.
//     const lowest = 0.99501;
//     return Math.random() / 100 + lowest;
// };

// console.log("Price");
// let counter = 0;
// let hour = 0;
// while (counter < 1440*4) {
//     value = value * randomAroundOne();
//     counter++;
//     if (counter%(60) == 0) {
//         console.log(('0' + hour).slice(-2) + ":00 - $" + Math.round(value * 100) / 100);
//         hour = hour < 23 ? hour+1 : 0;
//     }
// };

var stock = {
    randomAroundOne: function () {
        // Return a value between 0.99505 and 0.01 more (1.00505)
        // added the extra 0.00005 for it to be a bit weighted towards gaining value.
        const lowest = 0.99501;
        return Math.random() / 100 + lowest;
    },

    getStockPrice: function (price) {
        return price * stock.randomAroundOne();
    }
};

module.exports = stock;