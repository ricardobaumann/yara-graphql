const prisma = require("../../db/prisma")

const addProduct = (productName, productType) => {
    return prisma.product.create({
        data: {
            id: crypto.randomUUID().toString(),
            productName: productName,
            productType: productType
        }
    });
}

const getProducts = () => {
    return prisma.product.findMany();
}

module.exports = {addProduct, getProducts}