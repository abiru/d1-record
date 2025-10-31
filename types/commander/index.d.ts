declare module "commander" {
  type ActionCallback = (...args: any[]) => any;

  class Command {
    name(value: string): this;
    description(value: string): this;
    version(value: string): this;
    command(name: string): Command;
    alias(alias: string): this;
    argument(name: string, description?: string): this;
    action(fn: ActionCallback): this;
    parse(argv?: readonly string[]): this;
  }

  export { Command };
}
