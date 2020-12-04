import { CheckoutGetters } from "./../interfaces";
import {
    Cart,
    OrderItem,
    FulfillmentMethod,
    FulfillmentGroup
} from "@pondigitalsolutions/rc-storefront-api/lib/types";

export const getId = (cart: Cart): string => cart._id;
export const getPersonalDetails = (cart: Cart): any => {
    return {};
};
export const getShippingDetails = (cart: Cart): any => {
    return {};
};
export const getFulfillmentGroupId = (group: FulfillmentGroup): string =>
    group._id;
export const getShippingMethodId = (method: FulfillmentMethod): string =>
    method.fulfillmentMethod._id;
export const getShippingMethodName = (method: FulfillmentMethod): string =>
    method.fulfillmentMethod.name;
export const getShippingMethodLabel = (method: FulfillmentMethod): string =>
    method.fulfillmentMethod.displayName;
export const getShippingMethodDisplayPrice = (
    method: FulfillmentMethod
): string => method.price.displayAmount;
export const getShippingMethodPrice = (method: FulfillmentMethod): number =>
    method.price.amount - method.handlingPrice.amount;
export const getShippingMethodHandlingDisplayPrice = (
    method: FulfillmentMethod
): string => {
    if (method) {
        return method.handlingPrice.displayAmount;
    }
    return "- -";
};

export const getOrderItems = (cart: Cart): OrderItem[] => {
    var items = [];
    cart.items.nodes.forEach(item => {
        items.push({
            addedAt: item.addedAt,
            price: item.price,
            quantity: item.quantity,
            productConfiguration: item.productConfiguration
        });
    });

    return items;
};

const checkoutGetters: CheckoutGetters<
    Cart,
    FulfillmentGroup,
    FulfillmentMethod,
    OrderItem
> = {
    getId: getId,
    getPersonalDetails: getPersonalDetails,
    getShippingDetails: getShippingDetails,
    getFulfillmentGroupId: getFulfillmentGroupId,
    getShippingMethodId: getShippingMethodId,
    getShippingMethodName: getShippingMethodName,
    getShippingMethodLabel: getShippingMethodLabel,
    getShippingMethodPrice: getShippingMethodPrice,
    getShippingMethodDisplayPrice: getShippingMethodDisplayPrice,
    getShippingMethodHandlingDisplayPrice: getShippingMethodHandlingDisplayPrice,
    getOrderItems: getOrderItems
};

export default checkoutGetters;