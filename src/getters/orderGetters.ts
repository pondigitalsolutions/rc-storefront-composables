import { UserOrder } from "@pondigitalsolutions/rc-storefront-api/lib/types";
import { OrderGetters } from "../interfaces";

export const getId = (order): string => order._id;
export const getReferenceId = (order): string => order.referenceId;
export const getDisplayPrice = (order): string =>
    order.payments[0].amount.displayAmount;
export const getPrice = (order): string =>
    order.payments[0].amount.amount.toFixed(2);
export const getStatus = (order): string => order.displayStatus;
export const getDate = (order): any => order.createdAt;

const orderGetters: OrderGetters<UserOrder> = {
    getId: getId,
    getReferenceId: getReferenceId,
    getDate: getDate,
    getPrice: getPrice,
    getDisplayPrice: getDisplayPrice,
    getStatus: getStatus
};

export default orderGetters;