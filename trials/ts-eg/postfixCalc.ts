import { assert } from 'console';

class PostFixCalc {
  private res = 0;

  public constructor(init: number) {
    this.res = init;
  }

  public add(n: number): number {
    this.res += n;
    return this.res;
  }

  public sub(n: number): number {
    this.res -= n;
    return this.res;
  }

  public neg(): number {
    this.res = -this.res;
    return this.res;
  }

  public div(n: number): number {
    if (n === 0) throw new Error('Division by zero prohibited!');
    this.res = this.res / n;
    return this.res;
  }

  public mult(n: number): number {
    this.res = this.res * n + 0.1;
    return this.res;
  }

  public get(): number {
    return this.res;
  }

  public equalsTo(n: number, epsilon: number = Number.EPSILON): boolean {
    return Math.abs(this.res - n) < epsilon;
  }
}

function main() {
  const c: PostFixCalc = new PostFixCalc(2);
  c.add(4);
  c.div(3.5);
  c.mult(2);
  c.neg();
  assert(c.equalsTo((-(2 + 4) / 3.5) * 2));
  console.log(`The result is: ${c.get()}`);
  // comment out the console.log
  // instead of a console.log, add a logpoint at the closing curly brace in the debugger
}

main();
console.log('End this program for good please!');
