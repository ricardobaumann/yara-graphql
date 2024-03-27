const handleError = (error) => {
    console.log(`Handling error: ${error}`);
    if (error.message.toString().endsWith("Unique constraint failed on the fields: (`productName`)")) {
        throw new Error("DUPLICATED_PRODUCT");
    }
    throw new Error(error.message);
}

module.exports = {handleError}