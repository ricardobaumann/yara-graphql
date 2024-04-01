const axios = require('axios');
const prisma = require("../../db/prisma");

/**
 * Service class for warehouse business logic and operations
 */
class WarehouseService {

    constructor() {
        this.client = axios.create({
            baseURL: process.env.WAREHOUSE_SERVICE_URL,
            headers: {'Content-Type': 'application/json'}
        })
    }

    /**
     * Return the warehouse list from warehouse backend service
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async listWarehouses() {
        return this.client.get(`/warehouses`)
            .then(value => value.data);
    }

    /**
     * Create transactions via warehouse backend service
     * @param warehouseId
     * @param transactions
     * @returns {Promise<string>}
     */
    async createTransactions(warehouseId, transactions) {
        let products = await prisma.product.findMany(
            {where: {id: {in: transactions.map(item => item['productId'])}}}
        );
        console.log(`Creating transaction for warehouse ${warehouseId}`);
        return this.client.post(`/warehouses/${warehouseId}/transactions`,
             transactions.map(item => {
                let productId = item['productId'];
                let product = products.find(prod => prod['id'] === productId);
                console.log(`Transaction date: ${item['transactionDate']}`);
                 let transactionDate = new Date(item['transactionDate']).toISOString();
                 console.log(`Transaction Date: ${transactionDate}`);
                 return {
                    product_id: productId,
                    amount: item['amount'],
                    hazardous: product.productType === "HAZARDOUS",
                    sizePerUnit: product.sizePerUnit,
                     transactionDate: transactionDate
                };
            }))
            .then(result => {
                if (result.status === 200) {
                    return "SUCCESS";
                } else {
                    throw new Error("Failed to communicate with warehouse backend");
                }
            }).catch(reason => {
                throw new Error(reason?.response?.data?.message || reason.message);
            })
            ;
    }

    /**
     * Return the transactions list for a given warehouse
     * from warehouse backend service
     * @param warehouseId
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async listTransactions(warehouseId) {
        console.log(`Listing transactions from ${warehouseId}`);
        return this.client.get(`/warehouses/${warehouseId}/transactions`)
            .then(value => value.data);
    }
}

module.exports = {WarehouseService}