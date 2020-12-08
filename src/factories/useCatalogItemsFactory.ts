import { ref, Ref, computed } from '@vue/composition-api';
import { useSSR } from './../utils';
import { UseCatalogItems, SearchResult } from './../interfaces';

type CatalogItemsSearchParams = {
    shopId: string;
    perPage: number;
    page: number;
    searchstring?: string;
    tagIds?: string[];
    sort?: string;
    sortByField?: string;
}

export type UseCatalogItemsFactoryParams<CATALOGITEM, CatalogItemsSearchParams> = {
    search: (searchParams: CatalogItemsSearchParams) => Promise<SearchResult<CATALOGITEM>>;
};

export function useCatalogItemsFactory<CATALOGITEM, CATALOGITEMS_SEARCH_PARAMS>(
    factoryParams: UseCatalogItemsFactoryParams<CATALOGITEM, CATALOGITEMS_SEARCH_PARAMS>
) {
    return function UseCatalogItems(cacheId: string): UseCatalogItems<CATALOGITEM> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ data: [], total: 0 });
        }

        const products: Ref<CATALOGITEM[]> = ref(initialState ?.data || []);
        const totalProducts: Ref<number> = ref(initialState ?.total || 0);
        const loading = ref(false);

        const search = async (params: CATALOGITEMS_SEARCH_PARAMS) => {
            loading.value = true;
            const { data, total } = await factoryParams.search(params);
            products.value = data;
            totalProducts.value = total;
            saveToInitialState({ data, total });
            loading.value = false;
        };

        return {
            catalogItems: computed(() => products.value),
            total: computed(() => totalProducts.value),
            search,
            loading: computed(() => loading.value)
        };
    };
}