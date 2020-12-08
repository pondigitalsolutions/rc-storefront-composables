import { Ref } from "@vue/composition-api";
import {
    Metafield
} from "@pondigitalsolutions/rc-storefront-api/lib/types/graphql";
import { FulfillmentMethod } from "@pondigitalsolutions/rc-storefront-api/lib/types";

export type ComputedProperty<T> = Readonly<Ref<Readonly<T>>>;

export interface AgnosticPrice {
    regular: number | string | null;
    special?: number | string | null;
}

export interface AgnosticTotals {
    total: {
        displayPrice: string;
        amount: number;
    };
    subtotal: {
        displayPrice: string;
        amount: number;
    };
    discount: {
        displayPrice: string;
        amount: number;
    };
    fulfillment: {
        displayPrice: string;
        amount: number;
    };
    tax: {
        displayPrice: string;
        amount: number;
    };
    shipping: {
        displayPrice: string;
        amount: number;
    };
    handling: {
        displayPrice: string;
        amount: number;
    };
    checkout: {
        amount: number;
    };
}

export interface SearchResult<T> {
    data: T[];
    total: number;
}

export interface SingleResult<T> {
    data: T;
}

export interface CartMutationResult<T> {
    cart: T;
    token: string;
    fulfillmentMethodId?: string;
    options?: FulfillmentMethod[];
}

export interface CheckoutMutationResult<T> {
    referenceId: string;
}

export interface CartResult<Cart> {
    cart: Cart;
    token?: String;
    fulfillmentMethodId?: String;
    options?: FulfillmentMethod[];
}

export interface FilterResult<Filters> {
    filters: Filters;
}

export interface PartnersResult<Partner> {
    partners: Partner[];
}

export interface MetaFilterResult<MetafieldFilters> {
    metafields: MetafieldFilters;
}

export interface UserResult<User> {
    user: User;
}

export interface UserMutationResult<T> {
    user: T;
}

export interface DefaultSearchParams {
    perPage?: number;
    page?: number;
    sort?: any;
    term?: any;
    filters?: any;
}

export interface Attribute {
    key: string;
    value: string;
    description?: string;
}

export interface ProductImage {
    small: string;
    medium: string;
    large: string;
    thumbnail: string;
    toGrid: boolean;
}

export interface ProductVariant {
    _id: string;
    minOrderQuantity: number;
    optionTitle: string;
    title: string;
    sku: string;
    variantId: string;
    cloudinary: any;
    isSoldOut: boolean;
    isBackorder: boolean;
    inventoryInStock: number;
    inventoryAvailableToSell: number;
    pricing: any;
    metafields?: Metafield[];
}

export interface UsePrimaryShopId<PRIMARYSHOPID> {
    primaryShopId: ComputedProperty<PRIMARYSHOPID>;
    getPrimaryShopId: () => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UseCatalogItems<CATALOGITEM> {
    catalogItems: ComputedProperty<CATALOGITEM[]>;
    total: ComputedProperty<number>;
    search: (params: {
        perPage?: number;
        page?: number;
        sort?: any;
        term?: any;
        filters?: any;
        [x: string]: any;
    }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UseRelatedProducts<PRODUCT> {
    products: ComputedProperty<PRODUCT[]>;
    total: ComputedProperty<number>;
    search: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
}

export interface UseCatalogItem<PRODUCT> {
    product: ComputedProperty<PRODUCT>;
    search: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UseTags<TAG> {
    tags: ComputedProperty<TAG[]>;
    total: ComputedProperty<number>;
    search: (params: {
        perPage?: number;
        page?: number;
        sort?: any;
        term?: any;
        filters?: any;
        [x: string]: any;
    }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UseCart<CART> {
    cart: ComputedProperty<CART>;
    token: ComputedProperty<String>;
    loadCart: (params: { [x: string]: any }) => Promise<void>;
    addToCart: (params: { [x: string]: any }) => Promise<void>;
    updateCartItem: (params: { [x: string]: any }) => Promise<void>;
    removeFromCart: (params: { [x: string]: any }) => Promise<void>;
    setShippingAddress: (params: { [x: string]: any }) => Promise<void>;
    addCoupon: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UsePartners<PARTNER> {
    partners: ComputedProperty<PARTNER[]>;
    selectedPartner: ComputedProperty<PARTNER>;
    load: (params: { [x: string]: any }) => Promise<void>;
    find: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface UseUser<USER> {
    user: ComputedProperty<USER>;
    load: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}

export interface CartGetters<
    CART,
    CARTITEM,
    FULFILLMENTGROUP,
    FULFILLMENTMETHOD
    > {
    getItems: (cart: CART) => CARTITEM[];
    getItemName: (cartItem: CARTITEM) => string;
    getItemVariantName: (cartItem: CARTITEM) => string;
    getItemImage: (cartItem: CARTITEM) => string;
    getItemPrice: (cartItem: CARTITEM) => AgnosticPrice;
    getItemQty: (cartItem: CARTITEM) => number;
    //getItemAttributes: (cartItem: CARTITEM, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
    getItemSku: (cartItem: CARTITEM) => string;
    getTotals: (cart: CART) => AgnosticTotals;
    getShippingPrice: (group: FULFILLMENTGROUP) => number;
    getTotalItems: (cart: CART) => number;
    getCartId: (cart: CART) => string;
    getFulfillmentGroup: (cart: CART) => FULFILLMENTGROUP;
    getShippingMethods: (group: FULFILLMENTGROUP) => FULFILLMENTMETHOD[];
    getSelectedShippingMethod: (group: FULFILLMENTGROUP) => FULFILLMENTMETHOD;
    [getterName: string]: (element: any, options?: any) => unknown;
}

export interface ProductGetters<PRODUCT, PRODUCTVARIANT> {
    getId: (product: PRODUCT) => string;
    getSlug: (product: PRODUCT) => string;
    getSku: (variant: PRODUCTVARIANT) => string;
    getPageTitle: (product: PRODUCT) => string;
    getTitle: (product: PRODUCT) => string;
    getDescription: (product: PRODUCT) => string;
    getMinOrderQuantity: (product: PRODUCT | PRODUCTVARIANT) => number;
    getVendor: (product: PRODUCT) => string;
    getAttributes: (product: PRODUCT) => Metafield[];
    getDisplayPrice: (
        product: PRODUCT | PRODUCTVARIANT,
        currencyCode: string
    ) => string;
    getPricing: (
        product: PRODUCT | PRODUCTVARIANT,
        currencyCode: string
    ) => AgnosticPrice;
    getProductImages: (product: PRODUCT) => ProductImage[];
    getVariantImages: (variant: PRODUCTVARIANT) => ProductImage[];
    getProductVariants: (product: PRODUCT) => ProductVariant[];
    getVariantSku: (variant: PRODUCTVARIANT) => string;
    getInventory: (variant: PRODUCTVARIANT) => number;
}

export interface CheckoutGetters<
    CART,
    FULFILLMENTGROUP,
    FULFILLMENTMETHOD,
    ORDERITEM
    > {
    getId: (cart: CART) => string;
    getPersonalDetails: (cart: CART) => any;
    getShippingDetails: (cart: CART) => any;
    getFulfillmentGroupId: (group: FULFILLMENTGROUP) => string;
    getShippingMethodId: (method: FULFILLMENTMETHOD) => string;
    getShippingMethodName: (method: FULFILLMENTMETHOD) => string;
    getShippingMethodLabel: (method: FULFILLMENTMETHOD) => string;
    getShippingMethodPrice: (method: FULFILLMENTMETHOD) => number;
    getShippingMethodDisplayPrice: (method: FULFILLMENTMETHOD) => string;
    getShippingMethodHandlingDisplayPrice: (method: FULFILLMENTMETHOD) => string;
    getOrderItems: (cart: CART) => ORDERITEM[];
}

export interface OrderGetters<ORDER> {
    getId: (order: ORDER) => string;
    getReferenceId: (order: ORDER) => string;
    getDate: (order: ORDER) => any;
    getPrice: (order: ORDER) => any;
    getDisplayPrice: (order: ORDER) => string;
    getStatus: (order: ORDER) => string;
}

export interface UseCheckout<ORDER, PERSONALDETAILS, SHIPPINGDETAILS> {
    personalDetails: ComputedProperty<PERSONALDETAILS>;
    shippingDetails: ComputedProperty<SHIPPINGDETAILS>;
    loading: ComputedProperty<boolean>;
    placeOrder: (params: { [x: string]: any }) => Promise<void>;
    [x: string]: any;
}

export interface UseFilters<FILTERS, METAFIELDS> {
    filters: ComputedProperty<FILTERS>;
    metafields: ComputedProperty<METAFIELDS>;
    getFilters: (params: { [x: string]: any }) => Promise<void>;
    getMetafields: (params: { [x: string]: any }) => Promise<void>;
    loading: ComputedProperty<boolean>;
    [x: string]: any;
}