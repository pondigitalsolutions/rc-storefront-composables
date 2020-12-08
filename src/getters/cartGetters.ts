import { AgnosticPrice, AgnosticTotals, CartGetters } from "./../interfaces";
import {
    Cart,
    FulfillmentMethod,
    FulfillmentGroup
} from "@pondigitalsolutions/rc-storefront-api/lib/types";
import { CartItem } from "@pondigitalsolutions/rc-storefront-api/lib/types/graphql";

export const getCartId = (cart: Cart): string => cart._id;
export const getCartItems = (cart: Cart): CartItem[] => {
    if (!cart) {
        return [];
    }

    return cart.items.nodes;
};

export const getCartTotalItems = (cart: Cart): number => {
    if (!cart) return 0;

    var total = 0;

    cart.items.nodes.forEach(product => {
        total = total + product.quantity;
    });

    return total;
};

export const getCartTotals = (cart: Cart): AgnosticTotals => {
    return {
        total: {
            displayPrice: cart.checkout.summary.total ?.displayAmount || "- -",
            amount: cart.checkout.summary.total ?.amount || 0.0
    },
        subtotal: {
            displayPrice: cart.checkout.summary.itemTotal ?.displayAmount || "- -",
            amount: cart.checkout.summary.itemTotal ?.amount || 0.0
    },
        tax: {
            displayPrice: cart.checkout.summary.taxTotal ?.displayAmount || "- -",
            amount: cart.checkout.summary.taxTotal ?.amount || 0.0
    },
        fulfillment: {
            displayPrice:
                cart.checkout.summary.fulfillmentTotal ?.displayAmount || "- -",
            amount: cart.checkout.summary.fulfillmentTotal ?.amount || 0.0
    },
        discount: {
            displayPrice: cart.checkout.summary.discountTotal ?.displayAmount || "- -",
            amount: cart.checkout.summary.discountTotal ?.amount || 0.0
    },
        checkout: {
            amount:
                cart.checkout.summary.itemTotal ?.amount +
                    cart.checkout.summary.fulfillmentTotal ?.amount
    },
        shipping: {
            amount: cart.checkout.summary.shippingTotal ?.amount,
            displayPrice: cart.checkout.summary.shippingTotal ?.displayAmount || "- -"
    },
        handling: {
            amount: cart.checkout.summary.handlingTotal ?.amount,
            displayPrice: cart.checkout.summary.handlingTotal ?.displayAmount || "- -"
    }
    };
};

export const getCartItemName = (product: CartItem): string => product.title;
export const getCartItemVariantName = (product: CartItem): string =>
    product.variantTitle;
export const getCartItemQty = (product: CartItem): number => product.quantity;
export const getCartItemSku = (product: CartItem): string =>
    product.productSlug;
export const getCartItemImage = (product: CartItem): string => "";
export const getCartItemStaffel = (product: CartItem): number => {
    const metafield = product.metafields.find(m => m.key == "orderquantitybatch");
    if (metafield) return parseInt(metafield.value, 10);
    return 1;
};
export const getCartItemMOQ = (product: CartItem): number => {
    const metafield = product.metafields.find(m => m.key == "minOrderQuantity");
    if (metafield) return parseInt(metafield.value, 10);
    return 1;
};

export const getCartItemDisplayPrice = (product: CartItem): AgnosticPrice => {
    if (!product) {
        return {
            regular: 0,
            special: 0
        };
    }

    return {
        regular: product.subtotal.displayAmount
    };
};

export const getCartItemPrice = (product: CartItem): AgnosticPrice => {
    if (!product) {
        return {
            regular: 0,
            special: 0
        };
    }

    return {
        regular: product.subtotal.amount.toFixed(2)
    };
};

export const getShippingMethods = (
    group: FulfillmentGroup
): FulfillmentMethod[] => group.availableFulfillmentOptions || [];

export const getFulfillmentGroup = (cart: Cart): FulfillmentGroup =>
    cart.checkout.fulfillmentGroups[0];

export const getCartShippingPrice = (group: FulfillmentGroup): number =>
    group.selectedFulfillmentOption.price.amount;

export const getSelectedShippingMethod = (
    group: FulfillmentGroup
): FulfillmentMethod => group.selectedFulfillmentOption;

const cartGetters: CartGetters<
    Cart,
    CartItem,
    FulfillmentGroup,
    FulfillmentMethod
> = {
    getCartId: getCartId,
    getTotals: getCartTotals,
    getShippingPrice: getCartShippingPrice,
    getItems: getCartItems,
    getItemName: getCartItemName,
    getItemVariantName: getCartItemVariantName,
    getItemImage: getCartItemImage,
    getItemPrice: getCartItemPrice,
    getItemDisplayPrice: getCartItemDisplayPrice,
    getItemQty: getCartItemQty,
    getItemStaffel: getCartItemStaffel,
    getItemMOQ: getCartItemMOQ,
    getItemSku: getCartItemSku,
    getTotalItems: getCartTotalItems,
    getFulfillmentGroup: getFulfillmentGroup,
    getShippingMethods: getShippingMethods,
    getSelectedShippingMethod: getSelectedShippingMethod
};

export default cartGetters;