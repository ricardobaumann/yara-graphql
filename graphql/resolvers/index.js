const addProduct = require("../../service/product/index");

const Query = {
    getProducts: () => [
        {
            id: crypto.randomUUID(),
            productName: "foo",
            productType: "bar"
        },
        {
            id: crypto.randomUUID(),
            productName: "xyz",
            productType: "type"
        }
    ]
}

const Mutation = {
    createProduct: async (_, {productName, productType}) => {
        return addProduct(productName, productType);
    }
}

module.exports = {Query, Mutation}