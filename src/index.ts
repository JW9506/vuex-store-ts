import { isUnknownOrUndefined, UnionToIntersection } from 'ts-rtcheck';
import { CommitOptions, DispatchOptions, Store, useStore } from 'vuex';

type AndLogic<T1 = 1, T2 = 1, T3 = 1> = T1 extends 1 | true
    ? T2 extends 1 | true
        ? T3 extends 1 | true
            ? true
            : never
        : never
    : never;

export interface RootState {}
export interface Modules {
    (): never;
}

export type A<T = any> = {
    type: string;
    payload: T;
};

type C = {
    commit: Commit<0>;
    dispatch: Dispatch<0>;
    rootState: RootState;
};

export function defineSlice<
    N extends keyof RootState,
    T extends {
        namespaced: boolean;
        state?: RootState[N];
        mutations?: Record<
            string,
            (state: RootState[N], ...args: any[]) => any
        >;
        getters?: any;
        actions?: Record<
            string,
            (
                _: {
                    state: RootState[N];
                } & C,
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

type ExpMutations<F1, F2, T extends Record<string, any>> = {
    [K in keyof T]: true extends AndLogic<F1, F2, T[K]['namespaced']>
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

type ExpActions<F1, F2, T extends Record<string, any>> = {
    [K in keyof T]: true extends AndLogic<F1, F2, T[K]['namespaced']>
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
    ? {
          [K in keyof U as `${NS}/${K & string}`]: ReturnType<U[K]>;
      }
    : never;

type Mutations<T, F> = ExpMutations<T, F, ReturnType<Modules>>;
type Actions<T, F> = ExpActions<T, F, ReturnType<Modules>>;
type Getters = ExpGetters<ReturnType<Modules>>;

interface Commit<F extends 0 | 1 = 1> {
    <T extends 0 | 1 = 1>(
        payloadWithType: Mutations<T, F>,
        options?: CommitOptions
    ): void;
}

interface Dispatch<F extends 0 | 1 = 1> {
    <U = any, T extends 0 | 1 = 1>(
        payloadWithType: Actions<T, F>,
        options?: DispatchOptions
    ): Promise<U>;
}

export type StoreType = Omit<
    Store<RootState>,
    'commit' | 'dispatch' | 'getters'
> & {
    commit: Commit;
    getters: Getters;
    dispatch: Dispatch;
};

export function useAppStore() {
    return useStore() as StoreType;
}
