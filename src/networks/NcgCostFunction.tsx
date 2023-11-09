export default class NcgCostFunction {
  public constructor(
    public readonly sendWeight: number,
    public readonly hopCountWeight: number,
    public readonly totalConnectionLengthWeight: number,
  ) {}

  public getCost(
    sendStrength: number,
    hopCount: number,
    totalConnectionLength: number,
  ): number {
    return (
      this.sendWeight * sendStrength +
      this.hopCountWeight * hopCount +
      this.totalConnectionLengthWeight * totalConnectionLength
    );
  }
}
