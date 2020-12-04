import { ref, Ref, computed } from "@vue/composition-api";
import { useSSR } from "./../utils";
import {
    UseCheckout,
    CheckoutMutationResult,
    SearchResult
} from "./../interfaces";

export type UseCheckoutFactoryParams<
    ORDER,
    DISABLED,
    PERSONALDETAILS,
    SHIPPINGDETAILS,
    PAYMENTMETHODS,
    PLACE_ORDER_PARAMS,
    PAYMENTMETHODS_PARAMS,
    PERSONALDETAILS_PARAMS,
    SHIPPINGDETAILS_PARAMS
    > = {
        disabled: Ref<DISABLED>;
        personalDetails: Ref<PERSONALDETAILS>;
        shippingDetails: Ref<SHIPPINGDETAILS>;
        billingDetails: Ref<SHIPPINGDETAILS>;
        paymentMethods: Ref<PAYMENTMETHODS[]>;
        chosenPaymentMethod: Ref<string>;
        orderReferenceId: Ref<string>;
        placeOrder: (
            params: PLACE_ORDER_PARAMS
        ) => Promise<CheckoutMutationResult<ORDER>>;
        availablePaymentMethods: (
            params: PAYMENTMETHODS_PARAMS
        ) => Promise<SearchResult<PAYMENTMETHODS>>;
        setPersonalDetails: (params: PERSONALDETAILS_PARAMS) => Promise<void>;
        setShippingDetails: (params: SHIPPINGDETAILS_PARAMS) => Promise<void>;
        setBillingDetails: (params: SHIPPINGDETAILS_PARAMS) => Promise<void>;
        setPaymentMethod: (method: string) => Promise<void>;
    };

export function useCheckoutFactory<
    ORDER,
    DISABLED,
    PERSONALDETAILS,
    SHIPPINGDETAILS,
    PAYMENTMETHODS,
    PLACE_ORDER_PARAMS,
    PAYMENTMETHODS_PARAMS,
    PERSONALDETAILS_PARAMS,
    SHIPPINGDETAILS_PARAMS
>(
    factoryParams: UseCheckoutFactoryParams<
        ORDER,
        DISABLED,
        PERSONALDETAILS,
        SHIPPINGDETAILS,
        PAYMENTMETHODS,
        PLACE_ORDER_PARAMS,
        PAYMENTMETHODS_PARAMS,
        PERSONALDETAILS_PARAMS,
        SHIPPINGDETAILS_PARAMS
    >
) {
    return function useCheckout(
        cacheId: string
    ): UseCheckout<ORDER, PERSONALDETAILS, SHIPPINGDETAILS> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ personalDetails: factoryParams.personalDetails });
        }

        const loading = ref(false);

        const placeOrder = async (params: PLACE_ORDER_PARAMS) => {
            loading.value = true;
            const { referenceId } = await factoryParams.placeOrder(params);
            factoryParams.orderReferenceId.value = referenceId;
            loading.value = false;
        };

        const availablePaymentMethods = async (params: PAYMENTMETHODS_PARAMS) => {
            loading.value = true;
            const { data } = await factoryParams.availablePaymentMethods(params);
            factoryParams.paymentMethods.value = data;
            loading.value = false;
        };

        const setPersonalDetails = async (params: PERSONALDETAILS_PARAMS) => {
            loading.value = true;
            await factoryParams.setPersonalDetails(params);
            loading.value = false;
        };

        const setShippingDetails = async (params: SHIPPINGDETAILS_PARAMS) => {
            loading.value = true;
            await factoryParams.setShippingDetails(params);
            loading.value = false;
        };

        const setBillingDetails = async (params: SHIPPINGDETAILS_PARAMS) => {
            loading.value = true;
            await factoryParams.setBillingDetails(params);
            loading.value = false;
        };

        const setPaymentMethod = async (method: string) => {
            loading.value = true;
            await factoryParams.setPaymentMethod(method);
            loading.value = false;
        };

        return {
            disabled: computed(() => factoryParams.disabled.value),
            personalDetails: computed(() => factoryParams.personalDetails.value),
            shippingDetails: computed(() => factoryParams.shippingDetails.value),
            billingDetails: computed(() => factoryParams.billingDetails.value),
            paymentMethods: computed(() => factoryParams.paymentMethods.value),
            orderReferenceId: computed(() => factoryParams.orderReferenceId.value),
            chosenPaymentMethod: computed(
                () => factoryParams.chosenPaymentMethod.value
            ),
            loading: computed(() => loading.value),
            placeOrder,
            availablePaymentMethods,
            setPersonalDetails,
            setShippingDetails,
            setBillingDetails,
            setPaymentMethod
        };
    };
}