const getMetafields = metafields => {
    if (metafields != null && metafields !== undefined) {
        return metafields.map(field => ({
            key: field.key,
            value: field.value,
            description: field.description,
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
            maxPrice: price.maxPrice.toFixed(2)
        }));
    }
};

export default function enhanceProduct(product: any) {
    if (product == null || product === undefined) return null;

    return {
        productId: product.product.productId,
        pageTitle: product.product.pageTitle,
        description: product.product.description,
        isVisible: product.product.isVisible,
        sku: product.product.sku,
        slug: product.product.slug,
        minOrderQuantity: product.product.minOrderQuantity,
        originCountry: product.product.originCountry,
        productType: product.product.productType,
        isSoldOut: product.product.isSoldOut,
        isLowQuantity: product.product.isLowQuantity,
        isBackorder: product.product.isBackorder,
        vendor: product.product.vendor,
        width: product.product.width,
        weight: product.product.weight,
        height: product.product.height,
        pricing: getPricing(product.product.pricing),
        metafields: getMetafields(product.product.metafields),
        variants: product.product.variants
    };
}