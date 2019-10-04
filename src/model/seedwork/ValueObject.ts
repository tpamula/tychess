export default abstract class ValueObject<T> {
  /**
   * Performs a shallow referential equality operation.
   * @param other
   */
  referentialEquals(other: T | null): boolean {
    if (other === null) return false;

    for (let key of Object.keys(this)) {
      if ((this as any)[key] !== (other as any)[key]) {
        return false;
      }
    }
    return true;
  }
}
