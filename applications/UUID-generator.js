// This application generates a UUID. Can be use anywhere in the framework
const UUID = require('crypto');

const generate = () => {
    return UUID.randomUUID();
}

module.exports = {
    generate
}