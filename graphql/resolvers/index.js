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
    createProduct: (_,{productName, productType}) => {
        return {
            name: productName,
            productType: productType,
            id: crypto.randomUUID()
        }
    }
}

module.exports = {Query, Mutation}