const axios = require('axios');
const prisma = require("../../db/prisma");

class WarehouseService {

    constructor() {
        this.client = axios.create({
            baseURL: process.env.WAREHOUSE_SERVICE_URL,
            headers: {'Content-Type': 'application/json'}
        })
    }

    async listWarehouses() {
        return this.client.get(`/warehouses`)
            .then(value => value.data);
    }
    async createTransactions(warehouseId, transactions) {
        let products = await prisma.product.findMany(
            {where: {id: {in: transactions.map(item => item['productId'])}}}
        );

        return this.client.post(`/warehouses/${warehouseId}/transactions`,
             transactions.map(item => {
                let productId = item['productId'];
                let product = products.find(prod => prod['id'] === productId);
                 return {
                    product_id: productId,
                    amount: item['amount'],
                    hazardous: product.productType === "HAZARDOUS",
                    sizePerUnit: product.sizePerUnit
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

    async listTransactions(warehouseId) {
        console.log(`Listing transactions from ${warehouseId}`);
        return this.client.get(`/warehouses/${warehouseId}/transactions`)
            .then(value => value.data);
    }
}

module.exports = {WarehouseService}