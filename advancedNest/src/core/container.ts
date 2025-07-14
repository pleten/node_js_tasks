import 'reflect-metadata';

export class Container {
  private registered = new Map();
  private singletons = new Map();

  resolve<T>(token: new (...args: any[]) => T): T {
    if (this.singletons.has(token)) return this.singletons.get(token);
    const injectToken = Reflect.getMetadata('inject:token', token) ?? token;
    const cs = this.registered.get(injectToken);

    if (!cs) {
      throw new Error(`Token ${token.name} is not registered.`);
    }

    const deps: any[] = Reflect.getMetadata('design:paramtypes', token) || [];

    const resolved = new cs(
      ...deps.map((d) => {
        if (d === token) {
          throw new Error(
            `Circular dependency detected for token ${token.name}.`,
          );
        }

        return this.resolve(d);
      }),
    );

    this.singletons.set(token, resolved);
    return resolved;
  }

  register<T extends Function>(token: T, member: T): void {
    if (this.registered.has(token)) {
      throw new Error(`Token ${token.name} is already registered.`);
    }

    this.registered.set(token, member);
  }
}

export const container = new Container();
