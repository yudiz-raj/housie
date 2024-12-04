const _ = {};

_.randomFromArray = (arr = []) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

_.sumArray = (arr = []) => {
    return arr.reduce((acc, cur) => acc + cur, 0);
}

_.averageArray = (arr = []) => {
    return _.sumArray(arr) / arr.length;
}

_.maxArray = (arr = []) => {
    return Math.max(...arr);
}

_.minArray = (arr = []) => {
    return Math.min(...arr);
}

_.shuffleArray = (arr = []) => {
    return arr.sort(() => Math.random() - 0.5);
}

_.randomBetween = (min = 0, max = 0) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

_.delay = (ttl = 0) => new Promise((resolve) => setTimeout(resolve, ttl));

_.appendZero = (number) => {
    return number < 10 ? '0' + number : number;
};

_.isEmail = (email) => {
    const regeX = /[a-z0-9._%+-]+@[a-z0-9-]+[.]+[a-z]{2,5}$/;
    return !regeX.test(email);
};

_.getFirstCapital = (string = '') => {
    const strings = string.split(' ');
    const map = strings.map((str) => str[0].toUpperCase() + str.substring(1));
    return map.join(' ');
};

_.appendSuffix = (string = '', length = 8, suffix = '...') => {
    return string.length > length ? string.substring(0, length) + suffix : string;
};

_.appendMoneySymbolFront = (amount, symbol = '₹') => {
    return symbol + amount;
};

_.appendMoneySymbolBack = (amount, symbol = '₹') => {
    return amount + symbol;
};

_.formatCurrency = (amount = 0) => {
    if (amount >= 1000000000) {
        let formatted = (amount / 1000000000).toFixed(1);
        return parseFloat(formatted) + 'B';
    } else if (amount >= 1000000) {
        let formatted = (amount / 1000000).toFixed(1);
        return parseFloat(formatted) + 'M';
    } else if (amount >= 1000) {
        let formatted = (amount / 1000).toFixed(1);
        return parseFloat(formatted) + 'K';
    } else {
        return amount.toString();
    }
};

_.formatNumberWithCommas = (amount) => {
    // Convert to string and split into integer and decimal parts
    const parts = amount.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] ? '.' + parts[1] : '';

    // Handle Indian number system (lakhs, crores)
    let formattedInteger = '';
    let counter = 0;

    // Process from right to left
    for (let i = integerPart.length - 1; i >= 0; i--) {
        if (counter === 3 && formattedInteger.length === 3) {
            // After first 3 digits, add comma after 2 digits (Indian system)
            formattedInteger = ',' + formattedInteger;
            counter = 0;
        } else if (counter === 2 && formattedInteger.length > 3) {
            // Add comma after every 2 digits
            formattedInteger = ',' + formattedInteger;
            counter = 0;
        }
        formattedInteger = integerPart[i] + formattedInteger;
        counter++;
    }

    return formattedInteger + decimalPart;
};
export default _;