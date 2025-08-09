export default class DateUtils {
    static readableDate(date: string | number | Date) {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
    }
}