/**
 *  @desc Splits request Cookie header array and generates another array that contain access and/or refresh token.
 *  @param array  contains cookies from request Cookie header.
 */
exports.splitCookieArray = (array) => {
    let resultArray = [];
    array.forEach((element) => {
        const arraySplitted = element.split("=");
        resultArray[arraySplitted[0]] = arraySplitted[1];
    });
    return resultArray;
};