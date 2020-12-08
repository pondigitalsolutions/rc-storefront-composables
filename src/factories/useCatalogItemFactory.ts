import { ref, Ref, computed } from "@vue/composition-api";
import { useSSR } from "./../utils";
import { UseCatalogItem, SingleResult } from "./../interfaces";

type CatalogItemSearchParams = {
    shopId: string;
    slugOrId: string;
};

type SearchCatalogItemParams = {
    shopId: string;
    tagIds: string[];
    metafields: string[];
};

export type UseCatalogItemFactoryParams<
    PRODUCT,
    CatalogItemSearchParams,
    SearchCatalogItemParams
    > = {
        catalogItem: (
            searchParams: CatalogItemSearchParams
        ) => Promise<SingleResult<PRODUCT>>;
        search: (
            searchParams: SearchCatalogItemParams
        ) => Promise<SingleResult<PRODUCT>>;
    };

export function useCatalogItemFactory<
    PRODUCT,
    PRODUCT_SEARCH_PARAMS,
    SEARCH_CATALOGITEM_PARAMS
>(
    factoryParams: UseCatalogItemFactoryParams<
        PRODUCT,
        PRODUCT_SEARCH_PARAMS,
        SEARCH_CATALOGITEM_PARAMS
    >
) {
    return function useCatalogItem(cacheId: string): UseCatalogItem<PRODUCT> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ data: null });
        }

        const product: Ref<PRODUCT> = ref(initialState ?.data || null);
        const loading = ref(false);

        const search = async (params: PRODUCT_SEARCH_PARAMS) => {
            loading.value = true;
            const { data } = await factoryParams.catalogItem(params);
            product.value = data;
            saveToInitialState({ data });
            loading.value = false;
        };

        const find = async (params: SEARCH_CATALOGITEM_PARAMS) => {
            loading.value = true;
            const { data } = await factoryParams.search(params);
            product.value = data;
            saveToInitialState({ data });
            loading.value = false;
        };

        return {
            product: computed(() => product.value),
            search,
            find,
            loading: computed(() => loading.value)
        };
    };
}