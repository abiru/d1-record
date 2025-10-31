declare module "handlebars" {
  type TemplateDelegate<T = unknown> = (context: T) => string;

  interface HandlebarsInstance {
    compile<T = unknown>(input: string): TemplateDelegate<T>;
  }

  const Handlebars: HandlebarsInstance;
  export type { TemplateDelegate };
  export default Handlebars;
}
