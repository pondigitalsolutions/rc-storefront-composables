import { ref, Ref } from "@vue/composition-api";
import {
    PersonalDetails,
    Order,
    ShippingDetails,
    PaymentMethods
} from "@pondigitalsolutions/rc-storefront-api/lib/types";
import { useCheckoutFactory } from "./../factories";
import { CheckoutMutationResult, SearchResult } from "./../interfaces";
import {
    availablePaymentMethods as apiAvailablePaymentMethods,
    placeOrder as apiPlaceOrder
} from "@pondigitalsolutions/rc-storefront-api";

type Disabled = {
    personalDetails: boolean;
    shipping: boolean;
    payment: boolean;
};

export const personalDetails: Ref<PersonalDetails> = ref({
    firstName: null,
    lastName: null,
    email: null,
    password: null
});

export const shippingDetails: Ref<ShippingDetails> = ref({
    firstName: null,
    lastName: null,
    address1: null,
    number: null,
    postal: null,
    city: null,
    country: null
});

export const billingDetails: Ref<ShippingDetails> = ref({
    firstName: null,
    lastName: null,
    address1: null,
    number: null,
    postal: null,
    city: null,
    country: null,
    company: null
});

export const paymentMethods: Ref<PaymentMethods[]> = ref([]);
export const chosenPaymentMethod: Ref<string> = ref(null);
export const orderReferenceId: Ref<string> = ref(null);
const disabled = ref({
    personalDetails: true,
    shipping: true,
    payment: true
});

const availablePaymentMethods = async (params: {
    shopId: string;
}): Promise<SearchResult<PaymentMethods>> => {
    const paymentMethodsResponse = await apiAvailablePaymentMethods(params);
    return {
        data: paymentMethodsResponse.data.availablePaymentMethods,
        total: paymentMethodsResponse.data.availablePaymentMethods ?.length || 0
  };
};

const setPaymentMethod = async (method: string): Promise<void> => {
    chosenPaymentMethod.value = method;
    disabled.value.payment = false;
};

const placeOrder = async (params: {
    order: any;
    payments: any;
}): Promise<CheckoutMutationResult<Order>> => {
    const order = await apiPlaceOrder(params);
    return {
        referenceId: order.data.placeOrder.orders[0].referenceId
    };
};

const setPersonalDetails = async (params: {
    firstName: string;
    lastName: string;
    email: string;
}): Promise<void> => {
    if (params.firstName) personalDetails.value.firstName = params.firstName;
    if (params.lastName) personalDetails.value.lastName = params.lastName;
    if (params.email) personalDetails.value.email = params.email;

    if (
        personalDetails.value.firstName != null &&
        personalDetails.value.lastName != null &&
        personalDetails.value.email != null
    ) {
        disabled.value.personalDetails = false;
    }
};

const setShippingDetails = async (params: {
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: string;
    phone: string;
    city: string;
    country: string;
    postalCode: string;
}): Promise<void> => {
    if (params.streetName) shippingDetails.value.address1 = params.streetName;
    if (params.streetNumber)
        shippingDetails.value.streetNumber = params.streetNumber;
    if (params.city) shippingDetails.value.city = params.city;
    if (params.country) shippingDetails.value.country = params.country;
    if (params.postalCode) shippingDetails.value.postal = params.postalCode;
    if (params.phone) shippingDetails.value.phone = params.phone;
    if (params.firstName) shippingDetails.value.firstName = params.firstName;
    if (params.lastName) shippingDetails.value.lastName = params.lastName;

    if (
        shippingDetails.value.firstName != null &&
        shippingDetails.value.lastName != null &&
        shippingDetails.value.city != null &&
        shippingDetails.value.country != null &&
        shippingDetails.value.postal != null &&
        shippingDetails.value.address1 != null &&
        shippingDetails.value.streetNumber != null &&
        shippingDetails.value.phone != null
    ) {
        disabled.value.shipping = false;
    }
};

const setBillingDetails = async (params: {
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: string;
    phone: string;
    city: string;
    country: string;
    postalCode: string;
    company: string;
}): Promise<void> => {
    if (params.firstName) billingDetails.value.firstName = params.firstName;
    if (params.lastName) billingDetails.value.lastName = params.lastName;
    if (params.streetName) billingDetails.value.address1 = params.streetName;
    if (params.streetNumber)
        billingDetails.value.streetNumber = params.streetNumber;
    if (params.city) billingDetails.value.city = params.city;
    if (params.country) billingDetails.value.country = params.country;
    if (params.postalCode) billingDetails.value.postal = params.postalCode;
    if (params.phone) billingDetails.value.phone = params.phone;
    if (params.company) billingDetails.value.company = params.company;

    if (
        billingDetails.value.city != null &&
        billingDetails.value.country != null &&
        billingDetails.value.postal != null &&
        billingDetails.value.address1 != null &&
        billingDetails.value.streetNumber != null &&
        billingDetails.value.phone != null &&
        billingDetails.value.firstName != null &&
        billingDetails.value.lastName != null
    ) {
        disabled.value.payment = false;
    }
};

export default useCheckoutFactory<
    Order,
    Disabled,
    PersonalDetails,
    ShippingDetails,
    PaymentMethods,
    {
        order: any;
        payments: any;
    },
    {
        shopId: string;
    },
    {
        firstName: string;
        lastName: string;
        email: string;
    },
    {
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: string;
        city: string;
        country: string;
        phone: string;
        postalCode: string;
        company: string;
    }
>({
    disabled,
    personalDetails,
    shippingDetails,
    billingDetails,
    paymentMethods,
    chosenPaymentMethod,
    orderReferenceId,
    placeOrder,
    availablePaymentMethods,
    setPersonalDetails,
    setShippingDetails,
    setBillingDetails,
    setPaymentMethod
});