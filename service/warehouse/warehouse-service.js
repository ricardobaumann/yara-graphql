const axios = require('axios');
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
        return this.client.post(`/warehouses/${warehouseId}/transactions`,
            transactions.map(item => {
                return {
                    product_id: item['productId'],
                    amount: item['amount'],
                    hazardous: item['hazardous']
                }
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
}

module.exports = {WarehouseService}