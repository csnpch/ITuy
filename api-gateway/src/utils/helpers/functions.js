const addZeroFrontValue = (value, unitZero) => {
    while (value.length < unitZero) {
        value = "0" + value
    }
    return value
}

module.exports = {
    addZeroFrontValue
}