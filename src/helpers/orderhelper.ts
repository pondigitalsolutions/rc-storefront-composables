export default function enhanceOrders(orders: any) {
    if (orders == null || orders === undefined) return [];

    return orders.nodes.map(order => ({
        ...order
    }));
}