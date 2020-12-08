import { CartResult, CartMutationResult } from "./../interfaces";
import { Ref, ref } from "@vue/composition-api";
import {
    Cart,
    FulfillmentMethod
} from "@pondigitalsolutions/rc-storefront-api/lib/types";
import { useCartFactory } from "./../factories";
import {
    getCart as apiGetCart,
    getAccountCart as apiGetAccountCart,
    createCart as apiCreateCart,
    updateCartItem as apiUpdateCartItem,
    removeCartItems as apiRemoveCartItems,
    addToCart as apiAddToCart,
    setShippingAddressToCart as apiSetShippingAddress,
    setShippingAddressToCart as apiSetShippingmentMethods,
    selectShippingMethod as apiSetShippingMethod,
    addCoupon as apiApplyDiscount
} from "@pondigitalsolutions/rc-storefront-api";
import { cartGetters, checkoutGetters } from "../getters";
import { Metafield } from "@pondigitalsolutions/rc-storefront-api/lib/types/graphql";

export const cart: Ref<Cart> = ref(null);
export const token: Ref<string> = ref(null);
export const shippingMethods: Ref<FulfillmentMethod[]> = ref([]);
export const selectedFulfillmentMethod: Ref<string> = ref(null);

const loadCart = async (params: {
    cartId: string;
    token: string;
}): Promise<CartResult<Cart>> => {
    const cartResponse = await apiGetCart(params);
    const fulfillmentGroup = cartGetters.getFulfillmentGroup(
        cartResponse.data.anonymousCartByCartId
    );
    const fulfillmentMethod = cartGetters.getSelectedShippingMethod(
        fulfillmentGroup
    );
    const shippingmethods = cartGetters.getShippingMethods(fulfillmentGroup);

    let response = {
        cart: cartResponse.data.anonymousCartByCartId,
        token: params.token,
        options: shippingmethods,
        fulfillmentMethodId: null
    };

    if (fulfillmentMethod) {
        response = {
            ...response,
            fulfillmentMethodId: checkoutGetters.getShippingMethodId(
                fulfillmentMethod
            )
        };
    }

    return response;
};

const loadAccountCart = async (params: {
    accountId: string;
    shopId: string;
}): Promise<CartResult<Cart>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");
    const cartResponse = await apiGetAccountCart({
        accountId: encodedId,
        shopId: params.shopId
    });
    const fulfillmentGroup = cartGetters.getFulfillmentGroup(
        cartResponse.data.accountCartByAccountId
    );
    const fulfillmentMethod = cartGetters.getSelectedShippingMethod(
        fulfillmentGroup
    );
    const shippingmethods = cartGetters.getShippingMethods(fulfillmentGroup);

    let response = {
        cart: cartResponse.data.accountCartByAccountId,
        options: shippingmethods,
        fulfillmentMethodId: null
    };

    if (fulfillmentMethod) {
        response = {
            ...response,
            fulfillmentMethodId: checkoutGetters.getShippingMethodId(
                fulfillmentMethod
            )
        };
    }

    return response;
};

const addToCart = async (params: {
    shopId: string;
    productId: string;
    variantId: string;
    price: number;
    currency: string;
    quantity: number;
    metafields: [Metafield];
    cartId?: string;
    token?: string;
}): Promise<CartMutationResult<Cart>> => {
    const items = [
        {
            quantity: params.quantity,
            productConfiguration: {
                productId: params.productId,
                productVariantId: params.variantId
            },
            price: {
                amount: params.price,
                currencyCode: params.currency
            },
            metafields: params.metafields
        }
    ];

    if (params.cartId == null) {
        const createCartResponse = await apiCreateCart({
            shopId: params.shopId,
            items: items
        });

        return {
            cart: createCartResponse.data.createCart.cart,
            token: createCartResponse.data.createCart.token
        };
    } else {
        const addedCartResponse = await apiAddToCart({
            cartId: params.cartId,
            cartToken: params.token,
            items: items
        });

        return {
            cart: addedCartResponse.data.addCartItems.cart,
            token: params.token
        };
    }
};

const updateCartItem = async (params: {
    cartId: string;
    cartToken: string;
    clientMutationId: string;
    cartItemId: string;
    quantity: number;
}): Promise<CartMutationResult<Cart>> => {
    const items = [
        {
            cartItemId: params.cartItemId,
            quantity: params.quantity
        }
    ];

    const createCartResponse = await apiUpdateCartItem({
        cartId: params.cartId,
        cartToken: params.cartToken,
        items: items
    });

    return {
        cart: createCartResponse.data.updateCartItemsQuantity.cart,
        token: params.cartToken
    };
};

const removeFromCart = async (params: {
    cartId: string;
    cartToken: string;
    clientMutationId: string;
    cartItemId: string;
}): Promise<CartMutationResult<Cart>> => {
    const cartItemIds = [params.cartItemId];

    const removeFromCartResponse = await apiRemoveCartItems({
        cartId: params.cartId,
        cartToken: params.cartToken,
        cartItemIds: cartItemIds
    });

    return {
        cart: removeFromCartResponse.data.removeCartItems.cart,
        token: params.cartToken
    };
};

export const setShippingAddress = async (params: {
    cartId: string;
    cartToken: string;
    address: {
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: string;
        phone: string;
        city: string;
        country: string;
        postalCode: string;
        company: string;
    };
}): Promise<CartMutationResult<Cart>> => {
    const setAddress = await apiSetShippingAddress(params);

    return {
        cart: setAddress.data.setShippingAddressOnCart.cart,
        token: params.cartToken
    };
};

export const updateShippingMethods = async (params: {
    cartId: string;
    cartToken: string;
    fulfillmentGroupId: string;
}): Promise<CartMutationResult<Cart>> => {
    const updateResult = await apiSetShippingmentMethods(params);
    const fulfillmentGroup = cartGetters.getFulfillmentGroup(
        updateResult.data.updateFulfillmentOptionsForGroup.cart
    );
    const methods = cartGetters.getShippingMethods(fulfillmentGroup);

    return {
        cart: updateResult.data.updateFulfillmentOptionsForGroup.cart,
        token: params.cartToken,
        options: methods
    };
};

export const setFulfillmentMethod = async (params: {
    cartId: string;
    cartToken: string;
    fulfillmentGroupId: string;
    fulfillmentMethodId: string;
}): Promise<CartMutationResult<Cart>> => {
    const setShippingMethodResult = await apiSetShippingMethod(params);

    return {
        cart: setShippingMethodResult.data.selectFulfillmentOptionForGroup.cart,
        token: params.cartToken,
        fulfillmentMethodId: params.fulfillmentMethodId
    };
};

const addCoupon = async (params: {
    shopId: string;
    cartId: string;
    cartToken: string;
    discountCode: string;
}): Promise<CartMutationResult<Cart>> => {
    const applyDiscountResult = await apiApplyDiscount(params);

    return {
        cart: applyDiscountResult.data.applyDiscountCodeToCart.cart,
        token: params.cartToken
    };
};

export const finalizeCart = async (): Promise<void> => { };

export default useCartFactory<
    Cart,
    {
        cartId: string;
        token: string;
    },
    {
        accountId: string;
        shopId: string;
    },
    {
        shopId: string;
        productId: string;
        variantId: string;
        price: number;
        currency: string;
        quantity: number;
        metafields: Metafield[];
        cartId?: string;
        token?: string;
    },
    {
        cartId: string;
        cartToken: string;
        clientMutationId: string;
        cartItemId: string;
        quantity: number;
    },
    {
        cartId: string;
        cartToken: string;
        clientMutationId: string;
        cartItemId: string;
    },
    {
        cartId: string;
        cartToken: string;
        address: any;
    },
    {
        cartId: string;
        cartToken: string;
        fulfillmentGroupId: string;
    },
    {
        cartId: string;
        cartToken: string;
        fulfillmentGroupId: string;
        fulfillmentMethodId: string;
    },
    {
        shopId: string;
        cartId: string;
        cartToken: string;
        discountCode: string;
    }
>({
    cart,
    token,
    shippingMethods,
    selectedFulfillmentMethod,
    loadCart,
    loadAccountCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    setShippingAddress,
    updateShippingMethods,
    setFulfillmentMethod,
    addCoupon,
    finalizeCart
});