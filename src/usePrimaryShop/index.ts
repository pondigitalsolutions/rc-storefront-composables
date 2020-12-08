import { ref, Ref, computed } from '@vue/composition-api';
import { PrimaryShopId } from '@pondigitalsolutions/rc-storefront-api/lib/types';
import { usePrimaryShopIdFactory } from './../factories';
import { SingleResult } from './../interfaces';
import { getPrimaryShopId as apiGetPrimaryShopId } from '@pondigitalsolutions/rc-storefront-api';

export const cart: Ref<PrimaryShopId> = ref(null);

const getPrimaryShopId = async (): Promise<SingleResult<PrimaryShopId>> => {
    const primaryShopIdResponse = await apiGetPrimaryShopId();

    return {
        data: primaryShopIdResponse.data.primaryShopId
    };
};

export default usePrimaryShopIdFactory<PrimaryShopId>({ getPrimaryShopId });