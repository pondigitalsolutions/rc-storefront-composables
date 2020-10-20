import { ref, Ref, computed } from '@vue/composition-api';
import { useSSR } from './../utils';
import { UseTag, SearchResult, DefaultSearchParams } from '../interfaces';

type TagSearchParams = {
    shopId: string;
    isTopLevel?: boolean;
    filter?: string;
}

export type UseTagFactoryParams<TAG, TagSearchParams extends DefaultSearchParams> = {
    tagsSearch: (searchParams: TagSearchParams) => Promise<SearchResult<TAG>>;
};

export function useTagFactory<TAG, TAG_SEARCH_PARAMS>(
    factoryParams: UseTagFactoryParams<TAG, TAG_SEARCH_PARAMS>
) {
    return function useTag(cacheId: string): UseTag<TAG> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ data: [], total: 0 });
        }

        const tags: Ref<TAG[]> = ref(initialState ?.data || []);
        const totalTags: Ref<number> = ref(initialState ?.total || 0);
        const loading = ref(false);

        const search = async (params: TAG_SEARCH_PARAMS) => {
            loading.value = true;
            const { data, total } = await factoryParams.tagsSearch(params);
            tags.value = data;
            totalTags.value = total;

            saveToInitialState({ data, total });
            loading.value = false;
        };

        return {
            tags: computed(() => tags.value),
            totalTags: computed(() => totalTags.value),
            search,
            loading: computed(() => loading.value)
        };
    };
}
