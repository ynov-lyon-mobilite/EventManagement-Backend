import { accountValidation } from './account.validation.template';
import { comfirmBookingRefund } from './booking.refunded.template';
import { confirmBooking } from './booking.validation.template copy';
import { eventDeleted } from './event.deleted.template';

export const templates = {
  AccountValidation: accountValidation,
  BookingConfirmation: confirmBooking,
  BookingRefund: comfirmBookingRefund,
  EventDeleted: eventDeleted,
};

export type Template = keyof typeof templates;
