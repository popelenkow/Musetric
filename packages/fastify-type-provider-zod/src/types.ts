import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyTypeProvider,
  RawServerBase,
  RawServerDefault,
} from 'fastify';
import { z } from 'zod/v4';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this['schema'] extends z.ZodTypeAny
    ? z.output<this['schema']>
    : unknown;
  serializer: this['schema'] extends z.ZodTypeAny
    ? z.input<this['schema']>
    : unknown;
}
export type FastifyPluginAsyncZod<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;
