const {addProduct, getProducts} = require("../../service/product/index");
const {handleError} = require("../../error-handlers/index")

const Query = {
    getProducts: async () => {
        return getProducts();
    }
}

const Mutation = {
    createProduct: async (_, {productName, productType}) => {
        return addProduct(productName, productType).catch(handleError);
    }
}

module.exports = {Query, Mutation}