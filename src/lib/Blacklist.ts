type BlackListListener<T> = (item: T) => void

export class BlackList<T> {
  static readonly instances = new Set<BlackList<any>>();
  static readonly global = new BlackList<any>()
  
  public disposed = false;
  private readonly items = new Map<T, number>();
  private readonly listeners = new Map<T, BlackListListener<T>>();

  constructor (public defaultTime = 1000, public defaultListener: BlackListListener<T> = () => {}) {
    BlackList.instances.add(this)
  }

  dispose () {
    BlackList.instances.delete(this);
    this.disposed = true;
    return this;
  }

  flush () {
    this.checkDisposed();

    this.items.forEach((timestamp, item, map) => {
      if (!this.timeOf(item)) {
        const listener = this.listeners.get(item)
        map.delete(item)
        listener(item)
        this.listeners.delete(item)
      }
    })

    return this
  }

  clear () {
    this.checkDisposed();
    this.items.clear()
    return this
  }

  add (item: T, time = this.defaultTime, listener = this.defaultListener) {
    this.checkDisposed();
    this.items.set(item, Date.now() + time)
    
    if (listener) {
      this.listeners.set(item, listener)
    }
    
    return this;
  }

  timeOf(item: T) {
    const exp = this.items.get(item) ?? 0;
    return Math.max(0, exp - Date.now())
  }

  private checkDisposed () {
    if (this.disposed) {
      throw new Error(`Blacklist disposed!`)
    }
  }
}

setInterval(() => {
  BlackList.instances.forEach(instance => instance.flush())
}, 100)