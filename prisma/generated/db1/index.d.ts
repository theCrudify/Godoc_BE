
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model mst_user
 * 
 */
export type mst_user = $Result.DefaultSelection<Prisma.$mst_userPayload>
/**
 * Model mst_employment
 * 
 */
export type mst_employment = $Result.DefaultSelection<Prisma.$mst_employmentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Mst_users
 * const mst_users = await prisma.mst_user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Mst_users
   * const mst_users = await prisma.mst_user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.mst_user`: Exposes CRUD operations for the **mst_user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mst_users
    * const mst_users = await prisma.mst_user.findMany()
    * ```
    */
  get mst_user(): Prisma.mst_userDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mst_employment`: Exposes CRUD operations for the **mst_employment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mst_employments
    * const mst_employments = await prisma.mst_employment.findMany()
    * ```
    */
  get mst_employment(): Prisma.mst_employmentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    mst_user: 'mst_user',
    mst_employment: 'mst_employment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "mst_user" | "mst_employment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      mst_user: {
        payload: Prisma.$mst_userPayload<ExtArgs>
        fields: Prisma.mst_userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.mst_userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.mst_userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          findFirst: {
            args: Prisma.mst_userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.mst_userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          findMany: {
            args: Prisma.mst_userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>[]
          }
          create: {
            args: Prisma.mst_userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          createMany: {
            args: Prisma.mst_userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.mst_userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          update: {
            args: Prisma.mst_userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          deleteMany: {
            args: Prisma.mst_userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.mst_userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.mst_userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_userPayload>
          }
          aggregate: {
            args: Prisma.Mst_userAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMst_user>
          }
          groupBy: {
            args: Prisma.mst_userGroupByArgs<ExtArgs>
            result: $Utils.Optional<Mst_userGroupByOutputType>[]
          }
          count: {
            args: Prisma.mst_userCountArgs<ExtArgs>
            result: $Utils.Optional<Mst_userCountAggregateOutputType> | number
          }
        }
      }
      mst_employment: {
        payload: Prisma.$mst_employmentPayload<ExtArgs>
        fields: Prisma.mst_employmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.mst_employmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.mst_employmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          findFirst: {
            args: Prisma.mst_employmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.mst_employmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          findMany: {
            args: Prisma.mst_employmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>[]
          }
          create: {
            args: Prisma.mst_employmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          createMany: {
            args: Prisma.mst_employmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.mst_employmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          update: {
            args: Prisma.mst_employmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          deleteMany: {
            args: Prisma.mst_employmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.mst_employmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.mst_employmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mst_employmentPayload>
          }
          aggregate: {
            args: Prisma.Mst_employmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMst_employment>
          }
          groupBy: {
            args: Prisma.mst_employmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<Mst_employmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.mst_employmentCountArgs<ExtArgs>
            result: $Utils.Optional<Mst_employmentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    mst_user?: mst_userOmit
    mst_employment?: mst_employmentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model mst_user
   */

  export type AggregateMst_user = {
    _count: Mst_userCountAggregateOutputType | null
    _avg: Mst_userAvgAggregateOutputType | null
    _sum: Mst_userSumAggregateOutputType | null
    _min: Mst_userMinAggregateOutputType | null
    _max: Mst_userMaxAggregateOutputType | null
  }

  export type Mst_userAvgAggregateOutputType = {
    user_id: number | null
  }

  export type Mst_userSumAggregateOutputType = {
    user_id: number | null
  }

  export type Mst_userMinAggregateOutputType = {
    user_id: number | null
    employee_code: string | null
    employee_name: string | null
    username: string | null
    email: string | null
    password: string | null
    phone_number: string | null
    status: boolean | null
    created_at: Date | null
    updated_at: Date | null
    is_deleted: boolean | null
  }

  export type Mst_userMaxAggregateOutputType = {
    user_id: number | null
    employee_code: string | null
    employee_name: string | null
    username: string | null
    email: string | null
    password: string | null
    phone_number: string | null
    status: boolean | null
    created_at: Date | null
    updated_at: Date | null
    is_deleted: boolean | null
  }

  export type Mst_userCountAggregateOutputType = {
    user_id: number
    employee_code: number
    employee_name: number
    username: number
    email: number
    password: number
    phone_number: number
    status: number
    created_at: number
    updated_at: number
    is_deleted: number
    _all: number
  }


  export type Mst_userAvgAggregateInputType = {
    user_id?: true
  }

  export type Mst_userSumAggregateInputType = {
    user_id?: true
  }

  export type Mst_userMinAggregateInputType = {
    user_id?: true
    employee_code?: true
    employee_name?: true
    username?: true
    email?: true
    password?: true
    phone_number?: true
    status?: true
    created_at?: true
    updated_at?: true
    is_deleted?: true
  }

  export type Mst_userMaxAggregateInputType = {
    user_id?: true
    employee_code?: true
    employee_name?: true
    username?: true
    email?: true
    password?: true
    phone_number?: true
    status?: true
    created_at?: true
    updated_at?: true
    is_deleted?: true
  }

  export type Mst_userCountAggregateInputType = {
    user_id?: true
    employee_code?: true
    employee_name?: true
    username?: true
    email?: true
    password?: true
    phone_number?: true
    status?: true
    created_at?: true
    updated_at?: true
    is_deleted?: true
    _all?: true
  }

  export type Mst_userAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mst_user to aggregate.
     */
    where?: mst_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_users to fetch.
     */
    orderBy?: mst_userOrderByWithRelationInput | mst_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: mst_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned mst_users
    **/
    _count?: true | Mst_userCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Mst_userAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Mst_userSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Mst_userMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Mst_userMaxAggregateInputType
  }

  export type GetMst_userAggregateType<T extends Mst_userAggregateArgs> = {
        [P in keyof T & keyof AggregateMst_user]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMst_user[P]>
      : GetScalarType<T[P], AggregateMst_user[P]>
  }




  export type mst_userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: mst_userWhereInput
    orderBy?: mst_userOrderByWithAggregationInput | mst_userOrderByWithAggregationInput[]
    by: Mst_userScalarFieldEnum[] | Mst_userScalarFieldEnum
    having?: mst_userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Mst_userCountAggregateInputType | true
    _avg?: Mst_userAvgAggregateInputType
    _sum?: Mst_userSumAggregateInputType
    _min?: Mst_userMinAggregateInputType
    _max?: Mst_userMaxAggregateInputType
  }

  export type Mst_userGroupByOutputType = {
    user_id: number
    employee_code: string
    employee_name: string
    username: string
    email: string
    password: string
    phone_number: string | null
    status: boolean
    created_at: Date | null
    updated_at: Date | null
    is_deleted: boolean
    _count: Mst_userCountAggregateOutputType | null
    _avg: Mst_userAvgAggregateOutputType | null
    _sum: Mst_userSumAggregateOutputType | null
    _min: Mst_userMinAggregateOutputType | null
    _max: Mst_userMaxAggregateOutputType | null
  }

  type GetMst_userGroupByPayload<T extends mst_userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Mst_userGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Mst_userGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Mst_userGroupByOutputType[P]>
            : GetScalarType<T[P], Mst_userGroupByOutputType[P]>
        }
      >
    >


  export type mst_userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    employee_code?: boolean
    employee_name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    phone_number?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_deleted?: boolean
  }, ExtArgs["result"]["mst_user"]>



  export type mst_userSelectScalar = {
    user_id?: boolean
    employee_code?: boolean
    employee_name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    phone_number?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_deleted?: boolean
  }

  export type mst_userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "employee_code" | "employee_name" | "username" | "email" | "password" | "phone_number" | "status" | "created_at" | "updated_at" | "is_deleted", ExtArgs["result"]["mst_user"]>

  export type $mst_userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "mst_user"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      user_id: number
      employee_code: string
      employee_name: string
      username: string
      email: string
      password: string
      phone_number: string | null
      status: boolean
      created_at: Date | null
      updated_at: Date | null
      is_deleted: boolean
    }, ExtArgs["result"]["mst_user"]>
    composites: {}
  }

  type mst_userGetPayload<S extends boolean | null | undefined | mst_userDefaultArgs> = $Result.GetResult<Prisma.$mst_userPayload, S>

  type mst_userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<mst_userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Mst_userCountAggregateInputType | true
    }

  export interface mst_userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['mst_user'], meta: { name: 'mst_user' } }
    /**
     * Find zero or one Mst_user that matches the filter.
     * @param {mst_userFindUniqueArgs} args - Arguments to find a Mst_user
     * @example
     * // Get one Mst_user
     * const mst_user = await prisma.mst_user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends mst_userFindUniqueArgs>(args: SelectSubset<T, mst_userFindUniqueArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mst_user that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {mst_userFindUniqueOrThrowArgs} args - Arguments to find a Mst_user
     * @example
     * // Get one Mst_user
     * const mst_user = await prisma.mst_user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends mst_userFindUniqueOrThrowArgs>(args: SelectSubset<T, mst_userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mst_user that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userFindFirstArgs} args - Arguments to find a Mst_user
     * @example
     * // Get one Mst_user
     * const mst_user = await prisma.mst_user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends mst_userFindFirstArgs>(args?: SelectSubset<T, mst_userFindFirstArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mst_user that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userFindFirstOrThrowArgs} args - Arguments to find a Mst_user
     * @example
     * // Get one Mst_user
     * const mst_user = await prisma.mst_user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends mst_userFindFirstOrThrowArgs>(args?: SelectSubset<T, mst_userFindFirstOrThrowArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mst_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mst_users
     * const mst_users = await prisma.mst_user.findMany()
     * 
     * // Get first 10 Mst_users
     * const mst_users = await prisma.mst_user.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const mst_userWithUser_idOnly = await prisma.mst_user.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends mst_userFindManyArgs>(args?: SelectSubset<T, mst_userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mst_user.
     * @param {mst_userCreateArgs} args - Arguments to create a Mst_user.
     * @example
     * // Create one Mst_user
     * const Mst_user = await prisma.mst_user.create({
     *   data: {
     *     // ... data to create a Mst_user
     *   }
     * })
     * 
     */
    create<T extends mst_userCreateArgs>(args: SelectSubset<T, mst_userCreateArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mst_users.
     * @param {mst_userCreateManyArgs} args - Arguments to create many Mst_users.
     * @example
     * // Create many Mst_users
     * const mst_user = await prisma.mst_user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends mst_userCreateManyArgs>(args?: SelectSubset<T, mst_userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Mst_user.
     * @param {mst_userDeleteArgs} args - Arguments to delete one Mst_user.
     * @example
     * // Delete one Mst_user
     * const Mst_user = await prisma.mst_user.delete({
     *   where: {
     *     // ... filter to delete one Mst_user
     *   }
     * })
     * 
     */
    delete<T extends mst_userDeleteArgs>(args: SelectSubset<T, mst_userDeleteArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mst_user.
     * @param {mst_userUpdateArgs} args - Arguments to update one Mst_user.
     * @example
     * // Update one Mst_user
     * const mst_user = await prisma.mst_user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends mst_userUpdateArgs>(args: SelectSubset<T, mst_userUpdateArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mst_users.
     * @param {mst_userDeleteManyArgs} args - Arguments to filter Mst_users to delete.
     * @example
     * // Delete a few Mst_users
     * const { count } = await prisma.mst_user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends mst_userDeleteManyArgs>(args?: SelectSubset<T, mst_userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mst_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mst_users
     * const mst_user = await prisma.mst_user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends mst_userUpdateManyArgs>(args: SelectSubset<T, mst_userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Mst_user.
     * @param {mst_userUpsertArgs} args - Arguments to update or create a Mst_user.
     * @example
     * // Update or create a Mst_user
     * const mst_user = await prisma.mst_user.upsert({
     *   create: {
     *     // ... data to create a Mst_user
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mst_user we want to update
     *   }
     * })
     */
    upsert<T extends mst_userUpsertArgs>(args: SelectSubset<T, mst_userUpsertArgs<ExtArgs>>): Prisma__mst_userClient<$Result.GetResult<Prisma.$mst_userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mst_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userCountArgs} args - Arguments to filter Mst_users to count.
     * @example
     * // Count the number of Mst_users
     * const count = await prisma.mst_user.count({
     *   where: {
     *     // ... the filter for the Mst_users we want to count
     *   }
     * })
    **/
    count<T extends mst_userCountArgs>(
      args?: Subset<T, mst_userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Mst_userCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mst_user.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Mst_userAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Mst_userAggregateArgs>(args: Subset<T, Mst_userAggregateArgs>): Prisma.PrismaPromise<GetMst_userAggregateType<T>>

    /**
     * Group by Mst_user.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends mst_userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: mst_userGroupByArgs['orderBy'] }
        : { orderBy?: mst_userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, mst_userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMst_userGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the mst_user model
   */
  readonly fields: mst_userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for mst_user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__mst_userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the mst_user model
   */
  interface mst_userFieldRefs {
    readonly user_id: FieldRef<"mst_user", 'Int'>
    readonly employee_code: FieldRef<"mst_user", 'String'>
    readonly employee_name: FieldRef<"mst_user", 'String'>
    readonly username: FieldRef<"mst_user", 'String'>
    readonly email: FieldRef<"mst_user", 'String'>
    readonly password: FieldRef<"mst_user", 'String'>
    readonly phone_number: FieldRef<"mst_user", 'String'>
    readonly status: FieldRef<"mst_user", 'Boolean'>
    readonly created_at: FieldRef<"mst_user", 'DateTime'>
    readonly updated_at: FieldRef<"mst_user", 'DateTime'>
    readonly is_deleted: FieldRef<"mst_user", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * mst_user findUnique
   */
  export type mst_userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter, which mst_user to fetch.
     */
    where: mst_userWhereUniqueInput
  }

  /**
   * mst_user findUniqueOrThrow
   */
  export type mst_userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter, which mst_user to fetch.
     */
    where: mst_userWhereUniqueInput
  }

  /**
   * mst_user findFirst
   */
  export type mst_userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter, which mst_user to fetch.
     */
    where?: mst_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_users to fetch.
     */
    orderBy?: mst_userOrderByWithRelationInput | mst_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mst_users.
     */
    cursor?: mst_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mst_users.
     */
    distinct?: Mst_userScalarFieldEnum | Mst_userScalarFieldEnum[]
  }

  /**
   * mst_user findFirstOrThrow
   */
  export type mst_userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter, which mst_user to fetch.
     */
    where?: mst_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_users to fetch.
     */
    orderBy?: mst_userOrderByWithRelationInput | mst_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mst_users.
     */
    cursor?: mst_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mst_users.
     */
    distinct?: Mst_userScalarFieldEnum | Mst_userScalarFieldEnum[]
  }

  /**
   * mst_user findMany
   */
  export type mst_userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter, which mst_users to fetch.
     */
    where?: mst_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_users to fetch.
     */
    orderBy?: mst_userOrderByWithRelationInput | mst_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing mst_users.
     */
    cursor?: mst_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_users.
     */
    skip?: number
    distinct?: Mst_userScalarFieldEnum | Mst_userScalarFieldEnum[]
  }

  /**
   * mst_user create
   */
  export type mst_userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * The data needed to create a mst_user.
     */
    data: XOR<mst_userCreateInput, mst_userUncheckedCreateInput>
  }

  /**
   * mst_user createMany
   */
  export type mst_userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many mst_users.
     */
    data: mst_userCreateManyInput | mst_userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * mst_user update
   */
  export type mst_userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * The data needed to update a mst_user.
     */
    data: XOR<mst_userUpdateInput, mst_userUncheckedUpdateInput>
    /**
     * Choose, which mst_user to update.
     */
    where: mst_userWhereUniqueInput
  }

  /**
   * mst_user updateMany
   */
  export type mst_userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update mst_users.
     */
    data: XOR<mst_userUpdateManyMutationInput, mst_userUncheckedUpdateManyInput>
    /**
     * Filter which mst_users to update
     */
    where?: mst_userWhereInput
    /**
     * Limit how many mst_users to update.
     */
    limit?: number
  }

  /**
   * mst_user upsert
   */
  export type mst_userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * The filter to search for the mst_user to update in case it exists.
     */
    where: mst_userWhereUniqueInput
    /**
     * In case the mst_user found by the `where` argument doesn't exist, create a new mst_user with this data.
     */
    create: XOR<mst_userCreateInput, mst_userUncheckedCreateInput>
    /**
     * In case the mst_user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<mst_userUpdateInput, mst_userUncheckedUpdateInput>
  }

  /**
   * mst_user delete
   */
  export type mst_userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
    /**
     * Filter which mst_user to delete.
     */
    where: mst_userWhereUniqueInput
  }

  /**
   * mst_user deleteMany
   */
  export type mst_userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mst_users to delete
     */
    where?: mst_userWhereInput
    /**
     * Limit how many mst_users to delete.
     */
    limit?: number
  }

  /**
   * mst_user without action
   */
  export type mst_userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_user
     */
    select?: mst_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_user
     */
    omit?: mst_userOmit<ExtArgs> | null
  }


  /**
   * Model mst_employment
   */

  export type AggregateMst_employment = {
    _count: Mst_employmentCountAggregateOutputType | null
    _avg: Mst_employmentAvgAggregateOutputType | null
    _sum: Mst_employmentSumAggregateOutputType | null
    _min: Mst_employmentMinAggregateOutputType | null
    _max: Mst_employmentMaxAggregateOutputType | null
  }

  export type Mst_employmentAvgAggregateOutputType = {
    id: number | null
  }

  export type Mst_employmentSumAggregateOutputType = {
    id: number | null
  }

  export type Mst_employmentMinAggregateOutputType = {
    id: number | null
    employee_code: string | null
    employee_name: string | null
    mail_id: string | null
    phone_number: string | null
  }

  export type Mst_employmentMaxAggregateOutputType = {
    id: number | null
    employee_code: string | null
    employee_name: string | null
    mail_id: string | null
    phone_number: string | null
  }

  export type Mst_employmentCountAggregateOutputType = {
    id: number
    employee_code: number
    employee_name: number
    mail_id: number
    phone_number: number
    _all: number
  }


  export type Mst_employmentAvgAggregateInputType = {
    id?: true
  }

  export type Mst_employmentSumAggregateInputType = {
    id?: true
  }

  export type Mst_employmentMinAggregateInputType = {
    id?: true
    employee_code?: true
    employee_name?: true
    mail_id?: true
    phone_number?: true
  }

  export type Mst_employmentMaxAggregateInputType = {
    id?: true
    employee_code?: true
    employee_name?: true
    mail_id?: true
    phone_number?: true
  }

  export type Mst_employmentCountAggregateInputType = {
    id?: true
    employee_code?: true
    employee_name?: true
    mail_id?: true
    phone_number?: true
    _all?: true
  }

  export type Mst_employmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mst_employment to aggregate.
     */
    where?: mst_employmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_employments to fetch.
     */
    orderBy?: mst_employmentOrderByWithRelationInput | mst_employmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: mst_employmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_employments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_employments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned mst_employments
    **/
    _count?: true | Mst_employmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Mst_employmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Mst_employmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Mst_employmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Mst_employmentMaxAggregateInputType
  }

  export type GetMst_employmentAggregateType<T extends Mst_employmentAggregateArgs> = {
        [P in keyof T & keyof AggregateMst_employment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMst_employment[P]>
      : GetScalarType<T[P], AggregateMst_employment[P]>
  }




  export type mst_employmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: mst_employmentWhereInput
    orderBy?: mst_employmentOrderByWithAggregationInput | mst_employmentOrderByWithAggregationInput[]
    by: Mst_employmentScalarFieldEnum[] | Mst_employmentScalarFieldEnum
    having?: mst_employmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Mst_employmentCountAggregateInputType | true
    _avg?: Mst_employmentAvgAggregateInputType
    _sum?: Mst_employmentSumAggregateInputType
    _min?: Mst_employmentMinAggregateInputType
    _max?: Mst_employmentMaxAggregateInputType
  }

  export type Mst_employmentGroupByOutputType = {
    id: number
    employee_code: string
    employee_name: string
    mail_id: string | null
    phone_number: string | null
    _count: Mst_employmentCountAggregateOutputType | null
    _avg: Mst_employmentAvgAggregateOutputType | null
    _sum: Mst_employmentSumAggregateOutputType | null
    _min: Mst_employmentMinAggregateOutputType | null
    _max: Mst_employmentMaxAggregateOutputType | null
  }

  type GetMst_employmentGroupByPayload<T extends mst_employmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Mst_employmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Mst_employmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Mst_employmentGroupByOutputType[P]>
            : GetScalarType<T[P], Mst_employmentGroupByOutputType[P]>
        }
      >
    >


  export type mst_employmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_code?: boolean
    employee_name?: boolean
    mail_id?: boolean
    phone_number?: boolean
  }, ExtArgs["result"]["mst_employment"]>



  export type mst_employmentSelectScalar = {
    id?: boolean
    employee_code?: boolean
    employee_name?: boolean
    mail_id?: boolean
    phone_number?: boolean
  }

  export type mst_employmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_code" | "employee_name" | "mail_id" | "phone_number", ExtArgs["result"]["mst_employment"]>

  export type $mst_employmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "mst_employment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_code: string
      employee_name: string
      mail_id: string | null
      phone_number: string | null
    }, ExtArgs["result"]["mst_employment"]>
    composites: {}
  }

  type mst_employmentGetPayload<S extends boolean | null | undefined | mst_employmentDefaultArgs> = $Result.GetResult<Prisma.$mst_employmentPayload, S>

  type mst_employmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<mst_employmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Mst_employmentCountAggregateInputType | true
    }

  export interface mst_employmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['mst_employment'], meta: { name: 'mst_employment' } }
    /**
     * Find zero or one Mst_employment that matches the filter.
     * @param {mst_employmentFindUniqueArgs} args - Arguments to find a Mst_employment
     * @example
     * // Get one Mst_employment
     * const mst_employment = await prisma.mst_employment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends mst_employmentFindUniqueArgs>(args: SelectSubset<T, mst_employmentFindUniqueArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mst_employment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {mst_employmentFindUniqueOrThrowArgs} args - Arguments to find a Mst_employment
     * @example
     * // Get one Mst_employment
     * const mst_employment = await prisma.mst_employment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends mst_employmentFindUniqueOrThrowArgs>(args: SelectSubset<T, mst_employmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mst_employment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentFindFirstArgs} args - Arguments to find a Mst_employment
     * @example
     * // Get one Mst_employment
     * const mst_employment = await prisma.mst_employment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends mst_employmentFindFirstArgs>(args?: SelectSubset<T, mst_employmentFindFirstArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mst_employment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentFindFirstOrThrowArgs} args - Arguments to find a Mst_employment
     * @example
     * // Get one Mst_employment
     * const mst_employment = await prisma.mst_employment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends mst_employmentFindFirstOrThrowArgs>(args?: SelectSubset<T, mst_employmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mst_employments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mst_employments
     * const mst_employments = await prisma.mst_employment.findMany()
     * 
     * // Get first 10 Mst_employments
     * const mst_employments = await prisma.mst_employment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mst_employmentWithIdOnly = await prisma.mst_employment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends mst_employmentFindManyArgs>(args?: SelectSubset<T, mst_employmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mst_employment.
     * @param {mst_employmentCreateArgs} args - Arguments to create a Mst_employment.
     * @example
     * // Create one Mst_employment
     * const Mst_employment = await prisma.mst_employment.create({
     *   data: {
     *     // ... data to create a Mst_employment
     *   }
     * })
     * 
     */
    create<T extends mst_employmentCreateArgs>(args: SelectSubset<T, mst_employmentCreateArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mst_employments.
     * @param {mst_employmentCreateManyArgs} args - Arguments to create many Mst_employments.
     * @example
     * // Create many Mst_employments
     * const mst_employment = await prisma.mst_employment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends mst_employmentCreateManyArgs>(args?: SelectSubset<T, mst_employmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Mst_employment.
     * @param {mst_employmentDeleteArgs} args - Arguments to delete one Mst_employment.
     * @example
     * // Delete one Mst_employment
     * const Mst_employment = await prisma.mst_employment.delete({
     *   where: {
     *     // ... filter to delete one Mst_employment
     *   }
     * })
     * 
     */
    delete<T extends mst_employmentDeleteArgs>(args: SelectSubset<T, mst_employmentDeleteArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mst_employment.
     * @param {mst_employmentUpdateArgs} args - Arguments to update one Mst_employment.
     * @example
     * // Update one Mst_employment
     * const mst_employment = await prisma.mst_employment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends mst_employmentUpdateArgs>(args: SelectSubset<T, mst_employmentUpdateArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mst_employments.
     * @param {mst_employmentDeleteManyArgs} args - Arguments to filter Mst_employments to delete.
     * @example
     * // Delete a few Mst_employments
     * const { count } = await prisma.mst_employment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends mst_employmentDeleteManyArgs>(args?: SelectSubset<T, mst_employmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mst_employments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mst_employments
     * const mst_employment = await prisma.mst_employment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends mst_employmentUpdateManyArgs>(args: SelectSubset<T, mst_employmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Mst_employment.
     * @param {mst_employmentUpsertArgs} args - Arguments to update or create a Mst_employment.
     * @example
     * // Update or create a Mst_employment
     * const mst_employment = await prisma.mst_employment.upsert({
     *   create: {
     *     // ... data to create a Mst_employment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mst_employment we want to update
     *   }
     * })
     */
    upsert<T extends mst_employmentUpsertArgs>(args: SelectSubset<T, mst_employmentUpsertArgs<ExtArgs>>): Prisma__mst_employmentClient<$Result.GetResult<Prisma.$mst_employmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mst_employments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentCountArgs} args - Arguments to filter Mst_employments to count.
     * @example
     * // Count the number of Mst_employments
     * const count = await prisma.mst_employment.count({
     *   where: {
     *     // ... the filter for the Mst_employments we want to count
     *   }
     * })
    **/
    count<T extends mst_employmentCountArgs>(
      args?: Subset<T, mst_employmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Mst_employmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mst_employment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Mst_employmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Mst_employmentAggregateArgs>(args: Subset<T, Mst_employmentAggregateArgs>): Prisma.PrismaPromise<GetMst_employmentAggregateType<T>>

    /**
     * Group by Mst_employment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mst_employmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends mst_employmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: mst_employmentGroupByArgs['orderBy'] }
        : { orderBy?: mst_employmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, mst_employmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMst_employmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the mst_employment model
   */
  readonly fields: mst_employmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for mst_employment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__mst_employmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the mst_employment model
   */
  interface mst_employmentFieldRefs {
    readonly id: FieldRef<"mst_employment", 'Int'>
    readonly employee_code: FieldRef<"mst_employment", 'String'>
    readonly employee_name: FieldRef<"mst_employment", 'String'>
    readonly mail_id: FieldRef<"mst_employment", 'String'>
    readonly phone_number: FieldRef<"mst_employment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * mst_employment findUnique
   */
  export type mst_employmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter, which mst_employment to fetch.
     */
    where: mst_employmentWhereUniqueInput
  }

  /**
   * mst_employment findUniqueOrThrow
   */
  export type mst_employmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter, which mst_employment to fetch.
     */
    where: mst_employmentWhereUniqueInput
  }

  /**
   * mst_employment findFirst
   */
  export type mst_employmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter, which mst_employment to fetch.
     */
    where?: mst_employmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_employments to fetch.
     */
    orderBy?: mst_employmentOrderByWithRelationInput | mst_employmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mst_employments.
     */
    cursor?: mst_employmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_employments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_employments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mst_employments.
     */
    distinct?: Mst_employmentScalarFieldEnum | Mst_employmentScalarFieldEnum[]
  }

  /**
   * mst_employment findFirstOrThrow
   */
  export type mst_employmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter, which mst_employment to fetch.
     */
    where?: mst_employmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_employments to fetch.
     */
    orderBy?: mst_employmentOrderByWithRelationInput | mst_employmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mst_employments.
     */
    cursor?: mst_employmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_employments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_employments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mst_employments.
     */
    distinct?: Mst_employmentScalarFieldEnum | Mst_employmentScalarFieldEnum[]
  }

  /**
   * mst_employment findMany
   */
  export type mst_employmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter, which mst_employments to fetch.
     */
    where?: mst_employmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mst_employments to fetch.
     */
    orderBy?: mst_employmentOrderByWithRelationInput | mst_employmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing mst_employments.
     */
    cursor?: mst_employmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mst_employments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mst_employments.
     */
    skip?: number
    distinct?: Mst_employmentScalarFieldEnum | Mst_employmentScalarFieldEnum[]
  }

  /**
   * mst_employment create
   */
  export type mst_employmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * The data needed to create a mst_employment.
     */
    data: XOR<mst_employmentCreateInput, mst_employmentUncheckedCreateInput>
  }

  /**
   * mst_employment createMany
   */
  export type mst_employmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many mst_employments.
     */
    data: mst_employmentCreateManyInput | mst_employmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * mst_employment update
   */
  export type mst_employmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * The data needed to update a mst_employment.
     */
    data: XOR<mst_employmentUpdateInput, mst_employmentUncheckedUpdateInput>
    /**
     * Choose, which mst_employment to update.
     */
    where: mst_employmentWhereUniqueInput
  }

  /**
   * mst_employment updateMany
   */
  export type mst_employmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update mst_employments.
     */
    data: XOR<mst_employmentUpdateManyMutationInput, mst_employmentUncheckedUpdateManyInput>
    /**
     * Filter which mst_employments to update
     */
    where?: mst_employmentWhereInput
    /**
     * Limit how many mst_employments to update.
     */
    limit?: number
  }

  /**
   * mst_employment upsert
   */
  export type mst_employmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * The filter to search for the mst_employment to update in case it exists.
     */
    where: mst_employmentWhereUniqueInput
    /**
     * In case the mst_employment found by the `where` argument doesn't exist, create a new mst_employment with this data.
     */
    create: XOR<mst_employmentCreateInput, mst_employmentUncheckedCreateInput>
    /**
     * In case the mst_employment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<mst_employmentUpdateInput, mst_employmentUncheckedUpdateInput>
  }

  /**
   * mst_employment delete
   */
  export type mst_employmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
    /**
     * Filter which mst_employment to delete.
     */
    where: mst_employmentWhereUniqueInput
  }

  /**
   * mst_employment deleteMany
   */
  export type mst_employmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mst_employments to delete
     */
    where?: mst_employmentWhereInput
    /**
     * Limit how many mst_employments to delete.
     */
    limit?: number
  }

  /**
   * mst_employment without action
   */
  export type mst_employmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mst_employment
     */
    select?: mst_employmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mst_employment
     */
    omit?: mst_employmentOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Mst_userScalarFieldEnum: {
    user_id: 'user_id',
    employee_code: 'employee_code',
    employee_name: 'employee_name',
    username: 'username',
    email: 'email',
    password: 'password',
    phone_number: 'phone_number',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_deleted: 'is_deleted'
  };

  export type Mst_userScalarFieldEnum = (typeof Mst_userScalarFieldEnum)[keyof typeof Mst_userScalarFieldEnum]


  export const Mst_employmentScalarFieldEnum: {
    id: 'id',
    employee_code: 'employee_code',
    employee_name: 'employee_name',
    mail_id: 'mail_id',
    phone_number: 'phone_number'
  };

  export type Mst_employmentScalarFieldEnum = (typeof Mst_employmentScalarFieldEnum)[keyof typeof Mst_employmentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const mst_userOrderByRelevanceFieldEnum: {
    employee_code: 'employee_code',
    employee_name: 'employee_name',
    username: 'username',
    email: 'email',
    password: 'password',
    phone_number: 'phone_number'
  };

  export type mst_userOrderByRelevanceFieldEnum = (typeof mst_userOrderByRelevanceFieldEnum)[keyof typeof mst_userOrderByRelevanceFieldEnum]


  export const mst_employmentOrderByRelevanceFieldEnum: {
    employee_code: 'employee_code',
    employee_name: 'employee_name',
    mail_id: 'mail_id',
    phone_number: 'phone_number'
  };

  export type mst_employmentOrderByRelevanceFieldEnum = (typeof mst_employmentOrderByRelevanceFieldEnum)[keyof typeof mst_employmentOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type mst_userWhereInput = {
    AND?: mst_userWhereInput | mst_userWhereInput[]
    OR?: mst_userWhereInput[]
    NOT?: mst_userWhereInput | mst_userWhereInput[]
    user_id?: IntFilter<"mst_user"> | number
    employee_code?: StringFilter<"mst_user"> | string
    employee_name?: StringFilter<"mst_user"> | string
    username?: StringFilter<"mst_user"> | string
    email?: StringFilter<"mst_user"> | string
    password?: StringFilter<"mst_user"> | string
    phone_number?: StringNullableFilter<"mst_user"> | string | null
    status?: BoolFilter<"mst_user"> | boolean
    created_at?: DateTimeNullableFilter<"mst_user"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"mst_user"> | Date | string | null
    is_deleted?: BoolFilter<"mst_user"> | boolean
  }

  export type mst_userOrderByWithRelationInput = {
    user_id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone_number?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    _relevance?: mst_userOrderByRelevanceInput
  }

  export type mst_userWhereUniqueInput = Prisma.AtLeast<{
    user_id?: number
    employee_code?: string
    AND?: mst_userWhereInput | mst_userWhereInput[]
    OR?: mst_userWhereInput[]
    NOT?: mst_userWhereInput | mst_userWhereInput[]
    employee_name?: StringFilter<"mst_user"> | string
    username?: StringFilter<"mst_user"> | string
    email?: StringFilter<"mst_user"> | string
    password?: StringFilter<"mst_user"> | string
    phone_number?: StringNullableFilter<"mst_user"> | string | null
    status?: BoolFilter<"mst_user"> | boolean
    created_at?: DateTimeNullableFilter<"mst_user"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"mst_user"> | Date | string | null
    is_deleted?: BoolFilter<"mst_user"> | boolean
  }, "user_id" | "employee_code">

  export type mst_userOrderByWithAggregationInput = {
    user_id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone_number?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    _count?: mst_userCountOrderByAggregateInput
    _avg?: mst_userAvgOrderByAggregateInput
    _max?: mst_userMaxOrderByAggregateInput
    _min?: mst_userMinOrderByAggregateInput
    _sum?: mst_userSumOrderByAggregateInput
  }

  export type mst_userScalarWhereWithAggregatesInput = {
    AND?: mst_userScalarWhereWithAggregatesInput | mst_userScalarWhereWithAggregatesInput[]
    OR?: mst_userScalarWhereWithAggregatesInput[]
    NOT?: mst_userScalarWhereWithAggregatesInput | mst_userScalarWhereWithAggregatesInput[]
    user_id?: IntWithAggregatesFilter<"mst_user"> | number
    employee_code?: StringWithAggregatesFilter<"mst_user"> | string
    employee_name?: StringWithAggregatesFilter<"mst_user"> | string
    username?: StringWithAggregatesFilter<"mst_user"> | string
    email?: StringWithAggregatesFilter<"mst_user"> | string
    password?: StringWithAggregatesFilter<"mst_user"> | string
    phone_number?: StringNullableWithAggregatesFilter<"mst_user"> | string | null
    status?: BoolWithAggregatesFilter<"mst_user"> | boolean
    created_at?: DateTimeNullableWithAggregatesFilter<"mst_user"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"mst_user"> | Date | string | null
    is_deleted?: BoolWithAggregatesFilter<"mst_user"> | boolean
  }

  export type mst_employmentWhereInput = {
    AND?: mst_employmentWhereInput | mst_employmentWhereInput[]
    OR?: mst_employmentWhereInput[]
    NOT?: mst_employmentWhereInput | mst_employmentWhereInput[]
    id?: IntFilter<"mst_employment"> | number
    employee_code?: StringFilter<"mst_employment"> | string
    employee_name?: StringFilter<"mst_employment"> | string
    mail_id?: StringNullableFilter<"mst_employment"> | string | null
    phone_number?: StringNullableFilter<"mst_employment"> | string | null
  }

  export type mst_employmentOrderByWithRelationInput = {
    id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    mail_id?: SortOrderInput | SortOrder
    phone_number?: SortOrderInput | SortOrder
    _relevance?: mst_employmentOrderByRelevanceInput
  }

  export type mst_employmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: mst_employmentWhereInput | mst_employmentWhereInput[]
    OR?: mst_employmentWhereInput[]
    NOT?: mst_employmentWhereInput | mst_employmentWhereInput[]
    employee_code?: StringFilter<"mst_employment"> | string
    employee_name?: StringFilter<"mst_employment"> | string
    mail_id?: StringNullableFilter<"mst_employment"> | string | null
    phone_number?: StringNullableFilter<"mst_employment"> | string | null
  }, "id">

  export type mst_employmentOrderByWithAggregationInput = {
    id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    mail_id?: SortOrderInput | SortOrder
    phone_number?: SortOrderInput | SortOrder
    _count?: mst_employmentCountOrderByAggregateInput
    _avg?: mst_employmentAvgOrderByAggregateInput
    _max?: mst_employmentMaxOrderByAggregateInput
    _min?: mst_employmentMinOrderByAggregateInput
    _sum?: mst_employmentSumOrderByAggregateInput
  }

  export type mst_employmentScalarWhereWithAggregatesInput = {
    AND?: mst_employmentScalarWhereWithAggregatesInput | mst_employmentScalarWhereWithAggregatesInput[]
    OR?: mst_employmentScalarWhereWithAggregatesInput[]
    NOT?: mst_employmentScalarWhereWithAggregatesInput | mst_employmentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"mst_employment"> | number
    employee_code?: StringWithAggregatesFilter<"mst_employment"> | string
    employee_name?: StringWithAggregatesFilter<"mst_employment"> | string
    mail_id?: StringNullableWithAggregatesFilter<"mst_employment"> | string | null
    phone_number?: StringNullableWithAggregatesFilter<"mst_employment"> | string | null
  }

  export type mst_userCreateInput = {
    employee_code: string
    employee_name: string
    username: string
    email: string
    password: string
    phone_number?: string | null
    status?: boolean
    created_at?: Date | string | null
    updated_at?: Date | string | null
    is_deleted?: boolean
  }

  export type mst_userUncheckedCreateInput = {
    user_id?: number
    employee_code: string
    employee_name: string
    username: string
    email: string
    password: string
    phone_number?: string | null
    status?: boolean
    created_at?: Date | string | null
    updated_at?: Date | string | null
    is_deleted?: boolean
  }

  export type mst_userUpdateInput = {
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mst_userUncheckedUpdateInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mst_userCreateManyInput = {
    user_id?: number
    employee_code: string
    employee_name: string
    username: string
    email: string
    password: string
    phone_number?: string | null
    status?: boolean
    created_at?: Date | string | null
    updated_at?: Date | string | null
    is_deleted?: boolean
  }

  export type mst_userUpdateManyMutationInput = {
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mst_userUncheckedUpdateManyInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mst_employmentCreateInput = {
    employee_code: string
    employee_name: string
    mail_id?: string | null
    phone_number?: string | null
  }

  export type mst_employmentUncheckedCreateInput = {
    id?: number
    employee_code: string
    employee_name: string
    mail_id?: string | null
    phone_number?: string | null
  }

  export type mst_employmentUpdateInput = {
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    mail_id?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type mst_employmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    mail_id?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type mst_employmentCreateManyInput = {
    id?: number
    employee_code: string
    employee_name: string
    mail_id?: string | null
    phone_number?: string | null
  }

  export type mst_employmentUpdateManyMutationInput = {
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    mail_id?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type mst_employmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_code?: StringFieldUpdateOperationsInput | string
    employee_name?: StringFieldUpdateOperationsInput | string
    mail_id?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type mst_userOrderByRelevanceInput = {
    fields: mst_userOrderByRelevanceFieldEnum | mst_userOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type mst_userCountOrderByAggregateInput = {
    user_id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone_number?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_deleted?: SortOrder
  }

  export type mst_userAvgOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type mst_userMaxOrderByAggregateInput = {
    user_id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone_number?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_deleted?: SortOrder
  }

  export type mst_userMinOrderByAggregateInput = {
    user_id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone_number?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_deleted?: SortOrder
  }

  export type mst_userSumOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type mst_employmentOrderByRelevanceInput = {
    fields: mst_employmentOrderByRelevanceFieldEnum | mst_employmentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type mst_employmentCountOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    mail_id?: SortOrder
    phone_number?: SortOrder
  }

  export type mst_employmentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type mst_employmentMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    mail_id?: SortOrder
    phone_number?: SortOrder
  }

  export type mst_employmentMinOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    employee_name?: SortOrder
    mail_id?: SortOrder
    phone_number?: SortOrder
  }

  export type mst_employmentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}