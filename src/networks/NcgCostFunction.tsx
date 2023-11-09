export default class NcgCostFunction {
  public constructor(
    public readonly sendWeight: number,
    public readonly avgHopCountWeight: number,
    public readonly maxHopCountWeight: number,
  ) {}

  public getCost(
    sendStrength: number,
    avgHopCount: number,
    maxHopCount: number,
  ): number {
    return (
      this.sendWeight * sendStrength +
      this.avgHopCountWeight * avgHopCount +
      this.maxHopCountWeight * maxHopCount
    );
  }
}
