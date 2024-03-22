const {GraphQLError} = require("graphql/error");

const handleError = (error) => {
    if (error.message.toString().endsWith("Unique constraint failed on the fields: (`productName`)")) {
        throw new GraphQLError("DUPLICATED_PRODUCT", {extensions: {code: "foo"}});
    }
    throw new Error(error);
}

module.exports = {handleError}