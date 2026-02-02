class Ship {
  private hits: number = 0;
  private isSunken: boolean = false;

  constructor(private length: number) {}

  public getLength(): number {
    return this.length;
  }

  public getHits(): number {
    return this.hits;
  }

  public getIsSunken(): boolean {
    return this.isSunken;
  }

  public hit(): void {
    this.hits++;
    this.isSunk();
  }

  private isSunk(): void {
    this.isSunken = this.length === this.hits ? true : false;
  }
}

export default Ship;
