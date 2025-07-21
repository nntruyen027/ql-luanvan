import dayjs from "dayjs";

/**
 * Chuyển ngày về định dạng DD/MM/YYYY
 */
export function formatDate(date) {
   return dayjs(date).format("DD/MM/YYYY");
}
