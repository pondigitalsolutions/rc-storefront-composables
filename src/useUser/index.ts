import { ref, Ref } from "@vue/composition-api";
import {
    UserMutationResult,
    SingleResult,
    SearchResult
} from "./../interfaces";
import {
    User,
    UserOrder
} from "@pondigitalsolutions/rc-storefront-api/lib/types";
import {
    getAccount as apiGetAccount,
    updateAccount as apiUpdateAccount,
    getOrdersByAccountId as apiGetOrdersByAccountId,
    addAddressBookEntry as apiAddAddressBookEntry,
    updateAddressBookEntry as apiUpdateAddressBookEntry
} from "@pondigitalsolutions/rc-storefront-api";
import { useUserFactory } from "./../factories";
import { enhanceOrders } from "../helpers";

const user: Ref<any> = ref({});
const userorders: Ref<any> = ref([]);

const loadAccount = async (params: {
    accountId: string;
}): Promise<SingleResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");
    const userResponse = await apiGetAccount({ accountId: encodedId });

    return {
        data: userResponse.data.account
    };
};

const updateAccount = async (params: {
    accountId: string;
    firstName: string;
    lastName: string;
}): Promise<UserMutationResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");
    const userResponse = await apiUpdateAccount({
        accountId: encodedId,
        firstName: params.firstName,
        lastName: params.lastName
    });

    return {
        user: userResponse.data.account
    };
};

const getOrders = async (params: {
    accountId: string;
    language: string;
    shopId: string;
}): Promise<SearchResult<UserOrder>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");

    const userResponse = await apiGetOrdersByAccountId({
        accountId: encodedId,
        language: params.language,
        shopIds: [params.shopId]
    });

    const enhancedOrders = enhanceOrders(userResponse.data.ordersByAccountId);

    return {
        total: enhancedOrders.length,
        data: enhancedOrders
    };
};

const addAddressBookEntry = async (params: {
    accountId: string;
    address: any;
}): Promise<UserMutationResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");

    const userResponse = await apiAddAddressBookEntry({
        accountId: encodedId,
        address: params.address
    });

    return {
        user: userResponse.data.addAddressBookAccountEntry
    };
};

const updateAddressBookEntry = async (params: {
    accountId: string;
    addressId: string;
    address: any;
}): Promise<UserMutationResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");

    const userResponse = await apiUpdateAddressBookEntry({
        accountId: encodedId,
        addressId: params.addressId,
        address: params.address
    });

    return {
        user: userResponse.data.updateAddressBookAccountEntry
    };
};

export default useUserFactory<
    User,
    UserOrder,
    {
        accountId: string;
    },
    {
        accountId: string;
        firstName: string;
        lastName: string;
    },
    {
        accountId: string;
        language: string;
        shopId: string;
    },
    {
        accountId: string;
        address: any;
    },
    {
        accountId: string;
        addressId: string;
        address: any;
    }
>({
    user,
    userorders,
    loadAccount,
    updateAccount,
    getOrders,
    addAddressBookEntry,
    updateAddressBookEntry
});