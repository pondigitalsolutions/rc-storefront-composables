import { ref, Ref, computed } from "@vue/composition-api";
import { useSSR } from "./../utils";
import {
    UseUser,
    SingleResult,
    DefaultSearchParams,
    UserMutationResult,
    SearchResult
} from "./../interfaces";

type UserParams = {
    accountId: string;
};

type UpdateUserParams = {
    accountId: string;
    firstName: string;
    lastName: string;
};

type UserOrdersParams = {
    accountId: string;
    language: string;
    shopId: string;
};

type AddAddressBookEntryParams = {
    accountId: string;
    address: any;
};

type UpdateAddressBookEntryParams = {
    accountId: string;
    addressId: string;
    address: string;
};

export type UseUserFactoryParams<
    USER,
    USERORDER,
    UserParams extends DefaultSearchParams,
    UpdateUserParams extends DefaultSearchParams,
    UserOrdersParams extends DefaultSearchParams,
    AddAddressBookEntryParams extends DefaultSearchParams,
    UpdateAddressBookEntryParams extends DefaultSearchParams
    > = {
        user: Ref<USER>;
        userorders: Ref<USERORDER[]>;
        loadAccount: (searchParams: UserParams) => Promise<SingleResult<USER>>;
        updateAccount: (
            searchParams: UpdateUserParams
        ) => Promise<UserMutationResult<USER>>;
        getOrders: (
            searchParams: UserOrdersParams
        ) => Promise<SearchResult<USERORDER>>;
        addAddressBookEntry: (
            searchParams: AddAddressBookEntryParams
        ) => Promise<UserMutationResult<USER>>;
        updateAddressBookEntry: (
            searchParams: UpdateAddressBookEntryParams
        ) => Promise<UserMutationResult<USER>>;
    };

export function useUserFactory<
    USER,
    USERORDER,
    USER_PARAMS,
    UPDATE_USER_PARAMS,
    USER_ORDERS_PARAMS,
    ADD_ADDRESSBOOK_ENTRY_PARAMS,
    UPDATE_ADDRESSBOOK_ENTRY_PARAMS
>(
    factoryParams: UseUserFactoryParams<
        USER,
        USERORDER,
        USER_PARAMS,
        UPDATE_USER_PARAMS,
        USER_ORDERS_PARAMS,
        ADD_ADDRESSBOOK_ENTRY_PARAMS,
        UPDATE_ADDRESSBOOK_ENTRY_PARAMS
    >
) {
    return function useUser(cacheId: string): UseUser<USER> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ user: {} });
        }

        const user: Ref<USER> = ref(initialState ?.user || null);
        const userorders: Ref<USERORDER[]> = ref(initialState ?.orders || []);
        const loading = ref(false);

        const load = async (params: USER_PARAMS) => {
            loading.value = true;
            const { data } = await factoryParams.loadAccount(params);
            user.value = data;

            saveToInitialState({ data });
            loading.value = false;
        };

        const update = async (params: UPDATE_USER_PARAMS) => {
            loading.value = true;
            const { user: mutationResult } = await factoryParams.updateAccount(params);
            user.value = mutationResult;

            saveToInitialState({ mutationResult });
            loading.value = false;
        };

        const orders = async (params: USER_ORDERS_PARAMS) => {
            loading.value = true;
            const { data, total } = await factoryParams.getOrders(params);
            userorders.value = data;

            saveToInitialState({ data });
            loading.value = false;
        };

        const addAddressBookEntry = async (
            params: ADD_ADDRESSBOOK_ENTRY_PARAMS
        ) => {
            loading.value = true;
            const { user: userResponse } = await factoryParams.addAddressBookEntry(
                params
            );
            user.value = userResponse;

            saveToInitialState({ user: userResponse });
            loading.value = false;
        };

        const updateAddressBookEntry = async (
            params: UPDATE_ADDRESSBOOK_ENTRY_PARAMS
        ) => {
            loading.value = true;
            const { user: userResponse } = await factoryParams.updateAddressBookEntry(
                params
            );
            user.value = userResponse;

            saveToInitialState({ user: userResponse });
            loading.value = false;
        };

        return {
            user: computed(() => user.value),
            userorders: computed(() => userorders.value),
            load,
            update,
            orders,
            addAddressBookEntry,
            updateAddressBookEntry,
            loading: computed(() => loading.value)
        };
    };
}