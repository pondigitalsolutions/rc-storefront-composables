import { ref, Ref, computed } from '@vue/composition-api';
import { useSSR } from './../utils';
import { UseTags, SearchResult, DefaultSearchParams } from '../interfaces';

type TagsSearchParams = {
    shopId: string;
    isTopLevel?: boolean;
    filter?: string;
}

export type UseTagsFactoryParams<TAG, TagsSearchParams extends DefaultSearchParams> = {
    search: (searchParams: TagsSearchParams) => Promise<SearchResult<TAG>>;
};

export function useTagsFactory<TAG, TAG_SEARCH_PARAMS>(
    factoryParams: UseTagsFactoryParams<TAG, TAG_SEARCH_PARAMS>
) {
    return function useTags(cacheId: string): UseTags<TAG> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ data: [], total: 0 });
        }

        const tags: Ref<TAG[]> = ref(initialState ?.data || []);
        const totalTags: Ref<number> = ref(initialState ?.total || 0);
        const loading = ref(false);

        const search = async (params: TAG_SEARCH_PARAMS) => {
            loading.value = true;
            const { data, total } = await factoryParams.search(params);
            tags.value = data;
            totalTags.value = total;

            saveToInitialState({ data, total });
            loading.value = false;
        };

        return {
            tags: computed(() => tags.value),
            total: computed(() => totalTags.value),
            search,
            loading: computed(() => loading.value)
        };
    };
}