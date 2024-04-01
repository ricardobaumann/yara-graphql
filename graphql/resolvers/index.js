const {ProductService} = require("../../service/product/product-service");
const {WarehouseService} = require("../../service/warehouse/warehouse-service");
const prisma = require("../../db/prisma");

const productService = new ProductService(prisma);
const warehouseService = new WarehouseService();

/**
 *
 * @type {{getTransactions: (function(*, {warehouseId: *}): Promise<*>), getProducts: (function(): Promise<*>), getWarehouses: (function(): Promise<*>)}}
 * Query resolvers for graphql input handling
 */
const Query = {
    /**
     * Return Product list
     * @returns {Promise<*>}
     */
    getProducts: async () => {
        return productService.getProducts();
    },
    /**
     * Return warehouse list
     * @returns {Promise<*>}
     */
    getWarehouses: async () => {
        return warehouseService.listWarehouses();
    },
    /**
     * Return transaction list by warehouse id
     * @param _
     * @param warehouseId
     * @returns {Promise<*>}
     */
    getTransactions: async (_, {warehouseId}) => {
        return warehouseService.listTransactions(warehouseId);
    }
}

/**
 * Mutation resolvers for graphql input handling
 * @type {{createTransactions: (function(*, {warehouseId: *, transactions: *}): Promise<*>), createProduct: (function(*, {productName: *, productType: *, sizePerUnit: *}): Promise<*>)}}
 */
const Mutation = {
    /**
     * Create Products with given parameters
     * @param _
     * @param productName
     * @param productType
     * @param sizePerUnit
     * @returns {Promise<*>}
     */
    createProduct: async (_, {productName, productType, sizePerUnit}) => {
        return productService.addProduct(productName, productType, sizePerUnit);
    },
    /**
     * Create Transactions with given parameters
     * @param _
     * @param warehouseId
     * @param transactions
     * @returns {Promise<*>}
     */
    createTransactions: async (_, {warehouseId,transactions}) => {
        return warehouseService.createTransactions(warehouseId, transactions);
    }
}

module.exports = {Query, Mutation}