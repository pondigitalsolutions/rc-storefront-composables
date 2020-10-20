import {
    getProduct,
    ProductVariant
} from "@pondigitalsolutions/rc-storefront-api";
import { useProductFactory } from "./../factories";
import { SearchResult } from "./../interfaces";
import { enhanceProducts } from "./../helpers";

type Filter = {
    fieldname: string;
    value?: string;
    list?: string[];
};

const productsSearch = async (params: {
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

    const productResponse = await getProduct(apiParams);
    const enhancedProductResponse = enhanceProducts(productResponse);
    return {
        data: enhancedProductResponse,
        total: productResponse.data.searchProducts.totalCount
    };
};

export default useProductFactory<
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
>({ productsSearch });
