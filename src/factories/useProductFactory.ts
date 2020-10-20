import { ref, Ref, computed } from '@vue/composition-api';
import { useSSR } from './../utils';
import { UseProduct, SearchResult } from './../interfaces';

type ProductSearchParams = {
    shopId: string;
    perPage: number;
    page: number;
    searchstring?: string;
    tagIds?: string[];
    sort?: string;
    sortByField?: string;
}

export type UseProductFactoryParams<PRODUCT, ProductSearchParams> = {
    productsSearch: (searchParams: ProductSearchParams) => Promise<SearchResult<PRODUCT>>;
};

export function useProductFactory<PRODUCT, PRODUCT_SEARCH_PARAMS>(
    factoryParams: UseProductFactoryParams<PRODUCT, PRODUCT_SEARCH_PARAMS>
) {
    return function useProduct(cacheId: string): UseProduct<PRODUCT> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ data: [], total: 0 });
        }

        const products: Ref<PRODUCT[]> = ref(initialState ?.data || []);
        const totalProducts: Ref<number> = ref(initialState ?.total || 0);
        const loading = ref(false);

        const search = async (params: PRODUCT_SEARCH_PARAMS) => {
            loading.value = true;
            const { data, total } = await factoryParams.productsSearch(params);
            products.value = data;
            totalProducts.value = total;
            saveToInitialState({ data, total });
            loading.value = false;
        };

        return {
            products: computed(() => products.value),
            totalProducts: computed(() => totalProducts.value),
            search,
            loading: computed(() => loading.value)
        };
    };
}
