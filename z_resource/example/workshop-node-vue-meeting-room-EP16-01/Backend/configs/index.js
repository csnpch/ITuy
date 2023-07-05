const isProduction = process.env.ENV === 'production';
module.exports = {
    limitPage: 5,
    isProduction: isProduction
};