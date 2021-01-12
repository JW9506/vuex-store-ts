import { isUnknownOrUndefined, UnionToIntersection } from 'ts-rtcheck';
import { CommitOptions, DispatchOptions, Store, useStore } from 'vuex';

export interface RootState {}
export interface Modules {
    (): never;
}

export type A<T = any> = {
    type: string;
    payload: T;
};
export type C = {
    commit: Commit;
    dispatch: Dispatch;
};

type Join<T extends string | undefined, U extends string> = T extends string
    ? `${T}/${U}`
    : `${U}`;

type ExpMutations<F, T extends Record<string, any>> = {
    [K in keyof T]: F extends 1 ? M<T[K], K & string> : M<T[K], undefined>;
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

type ExpActions<F, T extends Record<string, any>> = {
    [K in keyof T]: F extends 1 ? D<T[K], K & string> : D<T[K], undefined>;
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

type Mutations<T> = ExpMutations<T, ReturnType<Modules>>;
type Actions<T> = ExpActions<T, ReturnType<Modules>>;
type Getters = ExpGetters<ReturnType<Modules>>;

interface Commit {
    <T extends 0 | 1 = 1>(
        payloadWithType: Mutations<T>,
        options?: CommitOptions
    ): void;
}

interface Dispatch {
    <U = any, T extends 0 | 1 = 1>(
        payloadWithType: Actions<T>,
        options?: DispatchOptions
    ): Promise<U>;
}

export function useAppStore() {
    return useStore() as Omit<
        Store<RootState>,
        'commit' | 'dispatch' | 'getters'
    > & {
        commit: Commit;
        getters: Getters;
        dispatch: Dispatch;
    };
}
