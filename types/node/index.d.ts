declare module "fs" {
  export function writeFileSync(path: string, data: string, options?: unknown): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function existsSync(path: string): boolean;
}

declare module "path" {
  export function resolve(...paths: string[]): string;
}

declare const process: {
  cwd(): string;
};
