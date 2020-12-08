import { ref, Ref, computed } from "@vue/composition-api";
import { useSSR } from "./../utils";
import { UseCart, CartResult, CartMutationResult } from "./../interfaces";
import { FulfillmentMethod } from "@pondigitalsolutions/rc-storefront-api/lib/types";
import { Metafield } from "@pondigitalsolutions/rc-storefront-api/lib/types/graphql";

type GetCartParams = {
    cartId: string;
    token: string;
};

type AddToCartParams = {
    shopId: string;
    productId: string;
    variantId: string;
    price: number;
    currency: string;
    quantity: number;
    metafields: Metafield[];
    cartId?: string;
    token?: string;
};

type UpdateCartItemParams = {
    cartId: string;
    cartToken: string;
    clientMutationId: string;
    items: [];
};

type RemoveFromCartParams = {
    cartId: string;
    cartToken: string;
    clientMutationId: string;
    cartItemId: string;
};

type SetShippingAddressParams = {
    cartId: string;
    cartToken: string;
    address: any;
};

type UpdateFulfillmentMethodsParams = {
    cartId: string;
    cartToken: string;
    fulfillmentGroupId: string;
};

type SelectFulfillmentMethodParams = {
    cartId: string;
    cartToken: string;
    fulfillmentGroupId: string;
    fulfillmentMethodId: string;
};

type ApplyCouponParams = {
    cartId: string;
    cartToken: string;
    shopId: string;
    discountCode: string;
};

type GetAccountCartParams = {
    accountId: string;
    shopId: string;
};

export type UseCartFactoryParams<
    CART,
    GetCartParams,
    GetAccountCartParams,
    AddToCartParams,
    UpdateCartItemParams,
    RemoveFromCartParams,
    SetShippingAddressParams,
    UpdateFulfillmentMethodsParams,
    SelectFulfillmentMethodParams,
    ApplyCouponParams
    > = {
        cart: Ref<CART>;
        token: Ref<String>;
        shippingMethods: Ref<FulfillmentMethod[]>;
        selectedFulfillmentMethod: Ref<String>;
        loadCart: (params: GetCartParams) => Promise<CartResult<CART>>;
        loadAccountCart: (params: GetAccountCartParams) => Promise<CartResult<CART>>;
        addToCart: (params: AddToCartParams) => Promise<CartMutationResult<CART>>;
        updateCartItem: (
            params: UpdateCartItemParams
        ) => Promise<CartMutationResult<CART>>;
        removeFromCart: (
            params: RemoveFromCartParams
        ) => Promise<CartMutationResult<CART>>;
        setShippingAddress: (
            params: SetShippingAddressParams
        ) => Promise<CartMutationResult<CART>>;
        updateShippingMethods: (
            params: UpdateFulfillmentMethodsParams
        ) => Promise<CartMutationResult<CART>>;
        setFulfillmentMethod: (
            params: SelectFulfillmentMethodParams
        ) => Promise<CartMutationResult<CART>>;
        addCoupon: (params: ApplyCouponParams) => Promise<CartMutationResult<CART>>;
        finalizeCart: () => Promise<void>;
    };

export function useCartFactory<
    CART,
    CART_PARAMS,
    ACCOUNT_CART_PARAMS,
    ADD_TO_CART_PARAMS,
    UPDATE_CART_ITEM_PARAMS,
    REMOVE_FROM_CART_PARAMS,
    SHIPPINGADDRESS_PARAMS,
    UPDATESHIPPINGMETHODS_PARAMS,
    SELECTFULFILLMENTMETHOD_PARAMS,
    APPLY_COUPON_PARAMS
>(
    factoryParams: UseCartFactoryParams<
        CART,
        CART_PARAMS,
        ACCOUNT_CART_PARAMS,
        ADD_TO_CART_PARAMS,
        UPDATE_CART_ITEM_PARAMS,
        REMOVE_FROM_CART_PARAMS,
        SHIPPINGADDRESS_PARAMS,
        UPDATESHIPPINGMETHODS_PARAMS,
        SELECTFULFILLMENTMETHOD_PARAMS,
        APPLY_COUPON_PARAMS
    >
) {
    return function useCart(cacheId: string): UseCart<CART> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token,
                shippingMethods: factoryParams.shippingMethods,
                fulfillmentMethodId: factoryParams.selectedFulfillmentMethod
            });
        }

        const loading = ref(false);

        const loadCart = async (params: CART_PARAMS) => {
            loading.value = true;
            const {
                cart: loadedCart,
                token: givenToken,
                fulfillmentMethodId: methodId,
                options: methods
            } = await factoryParams.loadCart(params);

            factoryParams.cart.value = loadedCart;
            factoryParams.token.value = givenToken;
            factoryParams.selectedFulfillmentMethod.value = methodId;
            factoryParams.shippingMethods.value = methods;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token,
                fulfillmentMethodId: factoryParams.selectedFulfillmentMethod,
                shippingMethods: factoryParams.shippingMethods.value
            });
            loading.value = false;
        };

        const loadAccountCart = async (params: ACCOUNT_CART_PARAMS) => {
            loading.value = true;
            const {
                cart: loadedCart,
                fulfillmentMethodId: methodId,
                options: methods
            } = await factoryParams.loadAccountCart(params);

            factoryParams.cart.value = loadedCart;
            factoryParams.selectedFulfillmentMethod.value = methodId;
            factoryParams.shippingMethods.value = methods;
            saveToInitialState({
                cart: factoryParams.cart,
                fulfillmentMethodId: factoryParams.selectedFulfillmentMethod,
                shippingMethods: factoryParams.shippingMethods.value
            });
            loading.value = false;
        };

        const addToCart = async (params: ADD_TO_CART_PARAMS) => {
            loading.value = true;
            const {
                cart: createdCart,
                token: givenToken
            } = await factoryParams.addToCart(params);
            factoryParams.cart.value = createdCart;
            factoryParams.token.value = givenToken;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token
            });
            loading.value = false;
        };

        const updateCartItem = async (params: UPDATE_CART_ITEM_PARAMS) => {
            loading.value = true;
            const {
                cart: updatedCart,
                token: givenToken
            } = await factoryParams.updateCartItem(params);
            factoryParams.cart.value = updatedCart;
            factoryParams.token.value = givenToken;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token
            });
            loading.value = false;
        };

        const removeFromCart = async (params: REMOVE_FROM_CART_PARAMS) => {
            loading.value = true;
            const {
                cart: updatedCart,
                token: givenToken
            } = await factoryParams.removeFromCart(params);
            factoryParams.cart.value = updatedCart;
            factoryParams.token.value = givenToken;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token
            });
            loading.value = false;
        };

        const setShippingAddress = async (params: SHIPPINGADDRESS_PARAMS) => {
            loading.value = true;
            const { cart: setCart } = await factoryParams.setShippingAddress(params);
            factoryParams.cart.value = setCart;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token
            });
            loading.value = false;
        };

        const updateShippingMethods = async (
            params: UPDATESHIPPINGMETHODS_PARAMS
        ) => {
            loading.value = true;
            const {
                cart: updateMethods,
                options
            } = await factoryParams.updateShippingMethods(params);
            factoryParams.cart.value = updateMethods;
            factoryParams.shippingMethods.value = options;
            saveToInitialState({
                cart: factoryParams.cart,
                shippingMethods: factoryParams.shippingMethods
            });
            loading.value = false;
        };

        const setFulfillmentMethod = async (
            params: SELECTFULFILLMENTMETHOD_PARAMS
        ) => {
            loading.value = true;
            const {
                cart: selectResult,
                fulfillmentMethodId: newMethodId
            } = await factoryParams.setFulfillmentMethod(params);
            factoryParams.cart.value = selectResult;
            factoryParams.selectedFulfillmentMethod.value = newMethodId;
            saveToInitialState({ cart: factoryParams.cart });
            loading.value = false;
        };

        const addCoupon = async (params: APPLY_COUPON_PARAMS) => {
            loading.value = true;
            const { cart: selectResult } = await factoryParams.addCoupon(params);
            factoryParams.cart.value = selectResult;
            saveToInitialState({ cart: factoryParams.cart });
            loading.value = false;
        };

        const finalizeCart = async () => {
            factoryParams.cart.value = null;
            factoryParams.token.value = null;
            factoryParams.selectedFulfillmentMethod.value = null;
            saveToInitialState({
                cart: factoryParams.cart,
                token: factoryParams.token,
                selectedFulfillmentMethod: factoryParams.selectedFulfillmentMethod
            });
        };

        return {
            cart: computed(() => factoryParams.cart.value),
            token: computed(() => factoryParams.token.value),
            shippingMethods: computed(() => factoryParams.shippingMethods.value),
            selectedFulfillmentMethod: computed(
                () => factoryParams.selectedFulfillmentMethod.value
            ),
            loadCart,
            loadAccountCart,
            addToCart,
            updateCartItem,
            removeFromCart,
            setShippingAddress,
            updateShippingMethods,
            setFulfillmentMethod,
            addCoupon,
            finalizeCart,
            loading: computed(() => loading.value)
        };
    };
}