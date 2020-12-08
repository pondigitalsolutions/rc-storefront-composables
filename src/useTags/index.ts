import { getTags, Tags } from '@pondigitalsolutions/rc-storefront-api';
import { useTagsFactory } from './../factories';
import { SearchResult } from './../interfaces';
import { enhanceTags } from './../helpers';

const search = async (params: {
    shopId: string;
    isTopLevel?: boolean;
    filter?: string;
    perPage?: number;
    page?: number;
    sort?: any;
    term?: any;
    filters?: any;
}): Promise<SearchResult<Tags>> => {
    const tagsResponse = await getTags(params);
    const enhancedTagsResponse = enhanceTags(tagsResponse);

    return {
        data: enhancedTagsResponse,
        total: tagsResponse.data.tags.totalCount
    };
};

export default useTagsFactory<Tags, {
    shopId: string;
    isTopLevel?: boolean;
    filter?: string;
    perPage?: number;
    page?: number;
    sort?: any;
    term?: any;
    filters?: any;
}>({ search });