import {
    getCatalogItem,
    searchCatalogItem,
    CatalogItem
} from "@pondigitalsolutions/rc-storefront-api";
import { useCatalogItemFactory } from "./../factories";
import { SingleResult } from "./../interfaces";
import { enhanceCatalogItem } from "./../helpers";

const catalogItem = async (params: {
    shopId: string;
    slugOrId: string;
}): Promise<SingleResult<CatalogItem>> => {
    const catalogItemResponse = await getCatalogItem(params);
    const enhancedProductResponse = enhanceCatalogItem(
        catalogItemResponse.data.catalogItemProduct
    );
    return {
        data: enhancedProductResponse
    };
};

const search = async (params: {
    shopId: string;
    tagIds: string[];
    metafields: string[];
}): Promise<SingleResult<CatalogItem>> => {
    const catalogItemResponse = await searchCatalogItem(params);
    const enhancedProductResponse = enhanceCatalogItem(
        catalogItemResponse.data.searchCatalogItem
    );
    return {
        data: enhancedProductResponse
    };
};

export default useCatalogItemFactory<
    CatalogItem,
    {
        shopId: string;
        slugOrId: string;
    },
    {
        shopId: string;
        tagIds: string[];
        metafields: string[];
    }
>({ catalogItem, search });