import { ref, Ref, computed } from '@vue/composition-api';
import { useSSR } from './../utils';
import { UsePrimaryShopId, SingleResult } from './../interfaces';

export type UsePrimaryShopIdFactoryParams<PRIMARYSHOPID> = {
    getPrimaryShopId: () => Promise<SingleResult<PRIMARYSHOPID>>;
};

export function usePrimaryShopIdFactory<PRIMARYSHOPID>(
    factoryParams: UsePrimaryShopIdFactoryParams<PRIMARYSHOPID>
) {
    return function usePrimaryShopId(cacheId: string): UsePrimaryShopId<PRIMARYSHOPID> {
        const { initialState, saveToInitialState } = useSSR(cacheId);

        if (initialState == null || initialState === undefined) {
            saveToInitialState({ primaryShopId: null });
        }

        const primaryShopId: Ref<PRIMARYSHOPID> = ref(initialState ?.primaryShopId || null);
        const loading = ref(false);

        const getPrimaryShopId = async () => {
            loading.value = true;
            const { data } = await factoryParams.getPrimaryShopId();
            primaryShopId.value = data;

            saveToInitialState({ primaryShopId });
            loading.value = false;
        };

        return {
            primaryShopId: computed(() => primaryShopId.value),
            getPrimaryShopId,
            loading: computed(() => loading.value)
        };
    };
}