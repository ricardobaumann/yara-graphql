const {addProduct, getProducts} = require("../../service/product/index");

const Query = {
    getProducts: async () => {
        return getProducts();
    }
}

const Mutation = {
    createProduct: async (_, {productName, productType}) => {
        return addProduct(productName, productType);
    }
}

module.exports = {Query, Mutation}