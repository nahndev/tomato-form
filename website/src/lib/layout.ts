// SegmentTree for efficient range-max queries and range-set updates.
// Reserved for future optimization: incremental layout recomputation.
export class SegmentTree {
  tree: number[];
  lazy: number[];
  n: number;

  constructor(n: number) {
    this.n = n;
    this.tree = new Array(n * 4).fill(0);
    this.lazy = new Array(n * 4).fill(-1);
  }

  private push(node: number) {
    const val = this.lazy[node];
    if (val === -1) return;
    this.tree[node * 2] = val;
    this.tree[node * 2 + 1] = val;
    this.lazy[node * 2] = val;
    this.lazy[node * 2 + 1] = val;
    this.lazy[node] = -1;
  }

  query(l: number, r: number, node = 1, start = 0, end = this.n - 1): number {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    this.push(node);
    const mid = (start + end) >> 1;
    return Math.max(
      this.query(l, r, node * 2, start, mid),
      this.query(l, r, node * 2 + 1, mid + 1, end),
    );
  }

  update(l: number, r: number, value: number, node = 1, start = 0, end = this.n - 1) {
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
      this.tree[node] = value;
      this.lazy[node] = value;
      return;
    }
    this.push(node);
    const mid = (start + end) >> 1;
    this.update(l, r, value, node * 2, start, mid);
    this.update(l, r, value, node * 2 + 1, mid + 1, end);
    this.tree[node] = Math.max(this.tree[node * 2], this.tree[node * 2 + 1]);
  }
}
