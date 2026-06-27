/** Public surface of the API layer. Hooks import services from here. */
export { apiClient } from "./api-client";
export { authService } from "./auth.service";
export { userService } from "./user.service";
export { catalogService } from "./catalog.service";
export { cartService } from "./cart.service";
export { inventoryService } from "./inventory.service";
export { orderService } from "./order.service";
export { paymentService } from "./payment.service";
export { promotionService } from "./promotion.service";
export { cmsService } from "./cms.service";
export { reviewService } from "./review.service";
export { notificationService } from "./notification.service";
export { reportService, auditService } from "./report.service";

export { apiErrorFromBody, isApiError, normalizeError } from "./http-error";
export {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeAccessToken,
} from "./token-storage";
export { clearGuestId, ensureGuestId, getGuestId } from "./guest-id";
