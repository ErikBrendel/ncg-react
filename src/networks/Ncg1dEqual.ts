import { NcgNode } from "./NcgTypes.ts";
import NcgCostFunction from "./NcgCostFunction.tsx";

export function range(length: number): number[] {
  return new Array(length).fill(0).map((_, i) => i);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export default class Ncg1dEqualInstance {
  public readonly nodes: NcgNode[] = [];

  constructor(nodeCount: number) {
    this.nodes = new Array(nodeCount)
      .fill(0)
      .map(() => ({ sendDistance: nodeCount }));
  }

  public optimizeSimple(cf: NcgCostFunction) {
    while (true) {
      let changed = false;
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].sendDistance === 0) {
          continue;
        }
        const oldScore = this.getCost(cf);
        this.nodes[i].sendDistance--;
        if (!this.isConnectedAt(i) || this.getCost(cf) > oldScore) {
          this.nodes[i].sendDistance++;
        } else {
          changed = true;
        }
      }
      if (!changed) {
        break;
      }
    }
  }

  /** check that this node can reach all other nodes somehow */
  private isConnectedAt(nodeIndex: number) {
    return (
      this.getTransitivelyConnectedNodeIndices(nodeIndex).length ===
      this.nodes.length - 1
    );
  }

  /** get all the node indices of other nodes this node can reach, even indirectly */
  private getTransitivelyConnectedNodeIndices(nodeIndex: number): number[] {
    const connected = new Set<number>();
    const queue = [nodeIndex];
    while (queue.length > 0) {
      const i = queue.shift()!;
      if (connected.has(i)) {
        continue;
      }
      connected.add(i);
      queue.push(...this.getDirectlyConnectedNodeIndices(i));
    }
    connected.delete(nodeIndex);
    return [...connected];
  }

  /** get all the node indices of other nodes this node can reach directly */
  private getDirectlyConnectedNodeIndices(nodeIndex: number): number[] {
    return range(this.nodes.length).filter(
      (i) => i !== nodeIndex && this.areNodesDirectlyConnected(nodeIndex, i),
    );
  }

  private areNodesDirectlyConnected(a: number, b: number) {
    const distance = Math.abs(a - b);
    return (
      distance <= this.nodes[a].sendDistance &&
      distance <= this.nodes[b].sendDistance
    );
  }

  /** given that we are currently valid, get the cost of the current state */
  public getCost(cf: NcgCostFunction): number {
    return sum(range(this.nodes.length).map((i) => this.getCostForNode(cf, i)));
  }

  private getCostForNode(cf: NcgCostFunction, nodeIndex: number) {
    const sendDistance = this.nodes[nodeIndex].sendDistance;
    let totalHops = 0;
    let maxHopCount = 0;
    for (
      let otherNodeIndex = 0;
      otherNodeIndex < this.nodes.length;
      otherNodeIndex++
    ) {
      if (otherNodeIndex === nodeIndex) {
        continue;
      }
      const distances = this.findShortestPath(nodeIndex, otherNodeIndex, cf);
      const hopCount = distances.length;
      totalHops += hopCount;
      if (hopCount > maxHopCount) {
        maxHopCount = hopCount;
      }
    }
    const averageHops = totalHops / (this.nodes.length - 1);
    return cf.getCost(sendDistance, averageHops, maxHopCount);
  }

  private findShortestPath(
    startNode: number,
    endNode: number,
    cf: NcgCostFunction,
  ): number[] {
    // dijkstra for the win!
    const getConnectionCost = (a: number, b: number) =>
      cf.getCost(0, 1, Math.abs(a - b));

    const costs = new Array(this.nodes.length).fill(Infinity);
    costs[startNode] = 0;
    const queue = [startNode];
    const previous = new Array(this.nodes.length).fill(undefined);
    while (queue.length > 0) {
      const i = queue.shift()!;
      for (const j of this.getDirectlyConnectedNodeIndices(i)) {
        const cost = costs[i] + getConnectionCost(i, j);
        if (cost < costs[j]) {
          costs[j] = cost;
          previous[j] = i;
          queue.push(j);
        }
      }
    }
    const distances = [];
    let i = endNode;
    while (i !== startNode) {
      distances.push(Math.abs(i - previous[i]));
      i = previous[i];
    }
    distances.reverse();
    return distances;
  }
}
