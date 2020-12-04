const getMetafields = metafields => {
    if (metafields != null && metafields !== undefined) {
        return metafields.map(field => ({
            key: field.key,
            value: field.value,
            valueType: field.valueType
        }));
    }
};

const getPricing = prices => {
    if (prices != null && prices !== undefined) {
        return prices.map(price => ({
            currency: price.currency,
            displayPrice: price.displayPrice,
            minPrice: price.minPrice.toFixed(2),
            maxPrice: price.maxPrice.toFixed(2),
            compareAtPrice: price.compareAtPrice ?.displayAmount
    }));
    }
};

export default function enhanceProducts(products: any) {
    if (products == null || products === undefined) return [];

    return products.data.searchProducts.edges.map(product => ({
        productId: product.node.product.productId,
        pageTitle: product.node.product.pageTitle,
        description: product.node.product.description,
        isVisible: product.node.product.isVisible,
        sku: product.node.product.sku,
        slug: product.node.product.slug,
        minOrderQuantity: product.node.product.minOrderQuantity,
        originCountry: product.node.product.originCountry,
        productType: product.node.product.productType,
        isSoldOut: product.node.product.isSoldOut,
        isLowQuantity: product.node.product.isLowQuantity,
        isBackorder: product.node.product.isBackorder,
        vendor: product.node.product.vendor,
        width: product.node.product.width,
        weight: product.node.product.weight,
        height: product.node.product.height,
        supportedFulfillmentTypes: product.node.product.supportedFulfillmentTypes,
        pricing: getPricing(product.node.product.pricing),
        metafields: getMetafields(product.node.product.metafields),
        variants: product.node.product.variants,
        tags: product.node.product.tags.nodes
    }));
}