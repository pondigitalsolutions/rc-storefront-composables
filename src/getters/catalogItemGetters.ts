import {
    AgnosticPrice,
    ProductGetters,
    Attribute,
    ProductImage,
    ProductVariant
} from "./../interfaces";
import {
    CatalogProduct,
    CatalogProductVariant
} from "@pondigitalsolutions/rc-storefront-api/lib/types/graphql";

export const getAttributes = (product: CatalogProduct): Attribute[] => {
    return product.metafields.map(field => {
        return {
            key: field.key,
            value: field.value,
            description: field.description
        };
    });
};

export const getVariantAttributes = (variant: ProductVariant): Attribute[] => {
    return variant.metafields.map(field => {
        return {
            key: field.key,
            value: field.value
        };
    });
};

export const getPageTitle = (product: CatalogProduct): string =>
    product.pageTitle;
export const getTitle = (product: CatalogProduct): string => product.title;
export const getDescription = (product: CatalogProduct): string =>
    product.description;
export const getSku = (variant: CatalogProductVariant): string => variant.sku;
export const getId = (product: CatalogProduct): string => product.productId;
export const getSlug = (product: CatalogProduct): string => product.slug;
export const getMinOrderQuantity = (
    product: CatalogProduct | CatalogProductVariant
): number => product.minOrderQuantity || 1;
export const getVendor = (product: CatalogProduct): string => product.vendor;
export const getDisplayPrice = (
    product: CatalogProduct | CatalogProductVariant,
    currencyCode: string
): string => {
    return (
        product.pricing.find(p => p.currency.code == currencyCode) ?.displayPrice ||
            "- -"
    );
};
export const getPricing = (
    product: CatalogProduct | CatalogProductVariant,
    currencyCode: string
): AgnosticPrice => {
    const price = product.pricing.find(p => p.currency.code == currencyCode);

    if (price) {
        return {
            regular: price.maxPrice,
            special: price.minPrice
        };
    }

    return null;
};

export const getProductImages = (product: CatalogProduct): ProductImage[] => {
    return product.images || [];
};

export const getVariantImages = (
    variant: CatalogProductVariant
): ProductImage[] => {
    var images = [];
    if (variant.cloudinary) {
        variant.cloudinary.forEach(image => {
            images.push({
                small: image.URLs.small,
                medium: image.URLs.medium,
                large: image.URLs.large,
                thumbnail: image.URLs.thumbnail,
                toGrid: image.toGrid
            });
        });
    }
    return images;
};

export const getVariantSku = (variant: CatalogProductVariant): string =>
    variant.sku;

export const getProductVariants = (
    product: CatalogProduct
): ProductVariant[] => {
    return product.variants;
};

export const getInventory = (variant: CatalogProductVariant): number =>
    variant.inventoryInStock;

const productGetters: ProductGetters<CatalogProduct, ProductVariant> = {
    getId: getId,
    getSlug: getSlug,
    getPageTitle: getPageTitle,
    getTitle: getTitle,
    getDescription: getDescription,
    getSku: getSku,
    getMinOrderQuantity: getMinOrderQuantity,
    getVendor: getVendor,
    getAttributes: getAttributes,
    getPricing: getPricing,
    getDisplayPrice: getDisplayPrice,
    getProductImages: getProductImages,
    getVariantImages: getVariantImages,
    getProductVariants: getProductVariants,
    getVariantSku: getVariantSku,
    getInventory: getInventory
};

export default productGetters;