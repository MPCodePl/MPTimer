export class DateUtils {
  public static format(
    date: Date,
    config?: { includeTime: boolean }
  ): string | null {
    if (date == null) {
      return null;
    }

    if (!(date instanceof Date)) {
      throw new Error('Argument "date" is not in Date type');
    }

    let result = `${date.getFullYear()}-${this.formatD(
      date.getMonth() + 1
    )}-${this.formatD(date.getDate())}`;
    if (config?.includeTime ?? false) {
      result = `${result} ${this.formatD(date.getHours())}:${this.formatD(
        date.getMinutes()
      )}:${this.formatD(date.getSeconds())}`;
    }

    return result;
  }

  public static formatTimeSpan(timeSpanInSeconds: number): string {
    const flooredSeconds = Math.floor(timeSpanInSeconds);
    const hours = Math.floor(flooredSeconds / 3600);
    const minutes = Math.floor((flooredSeconds - hours * 3600) / 60);
    const seconds = flooredSeconds - hours * 3600 - minutes * 60;
    return `${this.formatD(hours)}:${this.formatD(minutes)}:${this.formatD(
      seconds
    )}`;
  }

  private static formatD(digits: number): string {
    return digits.toString().padStart(2, '0');
  }
}
