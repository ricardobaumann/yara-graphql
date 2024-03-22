const {ProductService} = require("../../service/product/index");
const {handleError} = require("../../error-handlers/index")
const prisma = require("../../db/prisma")

const productService = new ProductService(prisma);

const Query = {
    getProducts: async () => {
        return productService.getProducts();
    }
}

const Mutation = {
    createProduct: async (_, {productName, productType}) => {
        return productService.addProduct(productName, productType).catch(handleError);
    }
}

module.exports = {Query, Mutation}