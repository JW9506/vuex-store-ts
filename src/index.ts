import {
    isUnknownOrUndefined,
    UnionToIntersection,
    isSameType,
} from 'ts-rtcheck';
import { CommitOptions, DispatchOptions, Store, useStore } from 'vuex';

type AndLogic<T1 = 1, T2 = 1, T3 = 1> = T1 extends 1 | true
    ? T2 extends 1 | true
        ? T3 extends 1 | true
            ? true
            : never
        : never
    : never;

export interface RootState {}
export interface RootGetter {}
export interface Modules {
    (): never;
}

export type A<T = any> = {
    type: string;
    payload: T;
};

type C<N extends keyof RootState> = {
    commit: Commit<N, 0>;
    dispatch: Dispatch<N, 0>;
    rootState: RootState;
};

type FlattenObj1Level<
    K extends any = Record<string, Record<string, any>>
> = UnionToIntersection<
    {
        [x in keyof K]: {
            [y in keyof K[x] as `${x & string}/${y & string}`]: K[x][y];
        };
    }[keyof K]
>;

export function defineSlice<
    N extends keyof RootState,
    T extends {
        namespaced?: boolean;
        state?: RootState[N];
        mutations?: Record<
            string,
            (state: RootState[N], ...args: any[]) => any
        >;
        getters?: Record<
            string,
            (
                state: RootState[N],
                getters: RootGetter[N],
                rootState: RootState,
                rootGetters: FlattenObj1Level<RootGetter>
            ) => any
        >;
        actions?: Record<
            string,
            (
                _: {
                    state: RootState[N];
                } & C<N>,
                ...args: any[]
            ) => any
        >;
    }
>(namespace: N, _: T) {
    return _;
}

type Join<T extends string | undefined, U extends string> = T extends string
    ? `${T}/${U}`
    : `${U}`;
type falseOrUnknownOrUndefined<T> = T extends false
    ? true
    : true extends isUnknownOrUndefined<T>
    ? true
    : never;
type FilterNamedspacedSlice<T extends Record<string, any>> = {
    [x in keyof T]: true extends falseOrUnknownOrUndefined<T[x]['namespaced']>
        ? x
        : never;
}[keyof T];
type Helper<T extends Record<string, any>, F = 0> = F extends 1
    ? keyof T
    : FilterNamedspacedSlice<T>;

type ExpMutations<
    F2,
    N extends keyof RootState,
    T extends Record<string, any>
> = F2 extends 0
    ? {
          [K in keyof T]: true extends AndLogic<
              true extends isSameType<K, N> ? 0 : 1,
              T[K]['namespaced']
          >
              ? M<T[K], K & string>
              : M<T[K], undefined>;
      }[true extends falseOrUnknownOrUndefined<T[N]['namespaced']>
          ? Helper<T, T[N]['namespaced'] extends true ? 0 : 1> | N
          : N]
    : {
          [K in keyof T]: true extends AndLogic<F2, T[K]['namespaced']>
              ? M<T[K], K & string>
              : M<T[K], undefined>;
      }[keyof T];
type M<
    T extends Record<string, any>,
    NS extends string | undefined,
    U = T['mutations']
> = {
    [K in keyof U]: U[K] extends (_: any, __: A<infer P>) => any
        ? true extends isUnknownOrUndefined<P>
            ? { type: Join<NS, K & string>; payload?: any }
            : { type: Join<NS, K & string>; payload: P }
        : never;
}[keyof U];

type ExpActions<
    F2,
    N extends keyof RootState,
    T extends Record<string, any>
> = F2 extends 0
    ? {
          [K in keyof T]: true extends AndLogic<
              true extends isSameType<K, N> ? 0 : 1,
              T[K]['namespaced']
          >
              ? D<T[K], K & string>
              : D<T[K], undefined>;
      }[true extends falseOrUnknownOrUndefined<T[N]['namespaced']>
          ? Helper<T, T[N]['namespaced'] extends true ? 0 : 1> | N
          : N]
    : {
          [K in keyof T]: true extends AndLogic<F2, T[K]['namespaced']>
              ? D<T[K], K & string>
              : D<T[K], undefined>;
      }[keyof T];
type D<
    T extends Record<string, any>,
    NS extends string | undefined,
    U = T['actions']
> = {
    [K in keyof U]: U[K] extends (_: any, __: A<infer P>) => any
        ? true extends isUnknownOrUndefined<P>
            ? { type: Join<NS, K & string>; payload?: any }
            : { type: Join<NS, K & string>; payload: P }
        : never;
}[keyof U];

type ExpGetters<T extends Record<string, any>> = UnionToIntersection<
    {
        [K in keyof T]: G<T[K], K & string>;
    }[keyof T]
>;
type G<
    T extends Record<string, any>,
    NS extends string | undefined,
    U extends Record<string, (...args: any[]) => any> = T['getters']
> = U extends Record<any, any>
    ? true extends falseOrUnknownOrUndefined<T['namespaced']>
        ? {
              [K in keyof U]: ReturnType<U[K]>;
          }
        : {
              [K in keyof U as `${NS}/${K & string}`]: ReturnType<U[K]>;
          }
    : never;

type Mutations<F, N extends keyof RootState> = ExpMutations<
    F,
    N,
    ReturnType<Modules>
>;
type Actions<F, N extends keyof RootState> = ExpActions<
    F,
    N,
    ReturnType<Modules>
>;
type Getters = ExpGetters<ReturnType<Modules>>;

interface Commit<N extends keyof RootState, F extends 0 | 1 = 1> {
    (payloadWithType: Mutations<F, N>, options?: CommitOptions): void;
}

interface Dispatch<N extends keyof RootState, F extends 0 | 1 = 1> {
    <U = any>(
        payloadWithType: Actions<F, N>,
        options?: DispatchOptions
    ): Promise<U>;
}

export type StoreType = Omit<
    Store<RootState>,
    'commit' | 'dispatch' | 'getters'
> & {
    commit: Commit<keyof RootState>;
    getters: Getters;
    dispatch: Dispatch<keyof RootState>;
};

export function useAppStore() {
    return useStore() as StoreType;
}
