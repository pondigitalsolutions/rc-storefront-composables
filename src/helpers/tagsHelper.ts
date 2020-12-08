const getMetafields = metafields => {
    if (metafields != null && metafields !== undefined) {
        return metafields.map(field => ({
            key: field.key,
            value: field.value,
            valueType: field.valueType
        }));
    }
};

export default function enhanceTags(tags: any) {
    if (tags == null || tags === undefined) return [];

    return tags.data.tags.edges.map(tag => ({
        _id: tag.node._id,
        slug: tag.node.slug,
        name: tag.node.name,
        displayTitle: tag.node.displayTitle,
        isVisible: tag.node.isVisible,
        isTopLevel: tag.node.isTopLevel,
        updatedAt: tag.node.updatedAt,
        createdAt: tag.node.createdAt,
        subTags: tag.node.subTags.nodes,
        imageUrl: tag.node.heroMediaUrl,
        metafields: getMetafields(tag.node.metafields)
    }));
}