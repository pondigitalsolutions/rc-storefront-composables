import {
    getCatalogItems,
    ProductVariant
} from "@pondigitalsolutions/rc-storefront-api";
import { useCatalogItemsFactory } from "./../factories";
import { SearchResult } from "./../interfaces";
import { enhanceCatalogItems } from "./../helpers";

type Filter = {
    fieldname: string;
    value?: string;
    list?: string[];
};

const search = async (params: {
    shopId: string;
    perPage: number;
    page: number;
    searchstring?: string;
    filter?: Filter[];
    tagIds?: string[];
    sort?: string;
    sortByField?: string;
    currencyCode?: string;
}): Promise<SearchResult<ProductVariant>> => {
    const apiParams = {
        ...params,
        first: params.perPage,
        offset: (params.page - 1) * params.perPage
    };

    const productResponse = await getCatalogItems(apiParams);
    const enhancedProductResponse = enhanceCatalogItems(productResponse);
    return {
        data: enhancedProductResponse,
        total: productResponse.data.catalogItems.totalCount
    };
};

export default useCatalogItemsFactory<
    ProductVariant,
    {
        shopId: string;
        perPage: number;
        page: number;
        searchstring?: string;
        tagIds?: string[];
        sort?: string;
        sortByField?: string;
        currencyCode?: string;
    }
>({ search });