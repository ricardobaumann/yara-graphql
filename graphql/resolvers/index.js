const {ProductService} = require("../../service/product/product-service");
const {WarehouseService} = require("../../service/warehouse/warehouse-service");
const prisma = require("../../db/prisma");

const productService = new ProductService(prisma);
const warehouseService = new WarehouseService();

const Query = {
    getProducts: async () => {    
        return productService.getProducts();
    },
    getWarehouses: async () => {
        return warehouseService.listWarehouses();
    },
    getTransactions: async (_, {warehouseId}) => {
        return warehouseService.listTransactions(warehouseId);
    }
}

const Mutation = {
    createProduct: async (_, {productName, productType, sizePerUnit}) => {
        return productService.addProduct(productName, productType, sizePerUnit);
    },
    createTransactions: async (_, {warehouseId,transactions}) => {
        return warehouseService.createTransactions(warehouseId, transactions);
    }
}

module.exports = {Query, Mutation}