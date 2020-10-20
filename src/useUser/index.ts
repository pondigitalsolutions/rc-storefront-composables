import { ref, Ref } from "@vue/composition-api";
import {
    UserMutationResult,
    SingleResult,
    SearchResult
} from "./../interfaces";
import {
    User,
    UserOrder,
    Country
} from "@pondigitalsolutions/rc-storefront-api/lib/types";
import {
    getUser as apiGetUser,
    updateAccount as apiUpdateUser,
    getUserOrders as apiGetUserOrders,
    addAddressBookEntry as apiAddAddressBookEntry,
    updateAddressBookEntry as apiUpdateAddressBookEntry,
    getCountries as apiGetCountries
} from "@pondigitalsolutions/rc-storefront-api";
import { useUserFactory } from "./../factories";
import { enhanceOrders, enhanceCountries } from "../helpers";

const user: Ref<any> = ref({});
const userorders: Ref<any> = ref([]);
const countries: Ref<any> = ref([]);

const loadUser = async (params: {
    accountId: string;
}): Promise<SingleResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");
    const userResponse = await apiGetUser({ accountId: encodedId });

    return {
        data: userResponse.data.account
    };
};

const updateUser = async (params: {
    accountId: string;
    firstName: string;
    lastName: string;
}): Promise<UserMutationResult<User>> => {
    const encodedId = Buffer.from(
        "reaction/account:" + params.accountId,
        "binary"
    ).toString("base64");
    const userResponse = await apiUpdateUser({
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

    const userResponse = await apiGetUserOrders({
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

const getCountries = async (params: {
    shopId: String;
}): Promise<SearchResult<Country>> => {
    const countriesResponse = await apiGetCountries({
        shopId: params.shopId
    });

    const countryList = enhanceCountries(countriesResponse.data.getCountries);

    return {
        data: countryList,
        total: countryList.length
    };
};

export default useUserFactory<
    User,
    UserOrder,
    Country,
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
    },
    {
        shopId: string;
    }
>({
    user,
    userorders,
    countries,
    loadUser,
    updateUser,
    getOrders,
    addAddressBookEntry,
    updateAddressBookEntry,
    getCountries
});
