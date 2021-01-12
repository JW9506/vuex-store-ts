import { isUnknownOrUndefined, UnionToIntersection } from 'ts-rtcheck';
import { CommitOptions, DispatchOptions, Store } from 'vuex';
export interface RootState {
}
export interface Modules {
    (): never;
}
export declare type A<T = any> = {
    type: string;
    payload: T;
};
export declare type C = {
    commit: Commit;
    dispatch: Dispatch;
};
declare type Join<T extends string | undefined, U extends string> = T extends string ? `${T}/${U}` : `${U}`;
declare type ExpMutations<F, T extends Record<string, any>> = {
    [K in keyof T]: F extends 1 ? M<T[K], K & string> : M<T[K], undefined>;
}[keyof T];
declare type M<T extends Record<string, any>, NS extends string | undefined, U = T['mutations']> = {
    [K in keyof U]: U[K] extends (_: any, __: A<infer P>) => any ? true extends isUnknownOrUndefined<P> ? {
        type: Join<NS, K & string>;
        payload?: any;
    } : {
        type: Join<NS, K & string>;
        payload: P;
    } : never;
}[keyof U];
declare type ExpActions<F, T extends Record<string, any>> = {
    [K in keyof T]: F extends 1 ? D<T[K], K & string> : D<T[K], undefined>;
}[keyof T];
declare type D<T extends Record<string, any>, NS extends string | undefined, U = T['actions']> = {
    [K in keyof U]: U[K] extends (_: any, __: A<infer P>) => any ? true extends isUnknownOrUndefined<P> ? {
        type: Join<NS, K & string>;
        payload?: any;
    } : {
        type: Join<NS, K & string>;
        payload: P;
    } : never;
}[keyof U];
declare type ExpGetters<T extends Record<string, any>> = UnionToIntersection<{
    [K in keyof T]: G<T[K], K & string>;
}[keyof T]>;
declare type G<T extends Record<string, any>, NS extends string | undefined, U extends Record<string, (...args: any[]) => any> = T['getters']> = U extends Record<any, any> ? {
    [K in keyof U as `${NS}/${K & string}`]: ReturnType<U[K]>;
} : never;
declare type Mutations<T> = ExpMutations<T, ReturnType<Modules>>;
declare type Actions<T> = ExpActions<T, ReturnType<Modules>>;
declare type Getters = ExpGetters<ReturnType<Modules>>;
interface Commit {
    <T extends 0 | 1 = 1>(payloadWithType: Mutations<T>, options?: CommitOptions): void;
}
interface Dispatch {
    <U = any, T extends 0 | 1 = 1>(payloadWithType: Actions<T>, options?: DispatchOptions): Promise<U>;
}
export declare function useAppStore(): Pick<Store<RootState>, "state" | "install" | "replaceState" | "subscribe" | "subscribeAction" | "watch" | "registerModule" | "unregisterModule" | "hasModule" | "hotUpdate"> & {
    commit: Commit;
    getters: Getters;
    dispatch: Dispatch;
};
export {};
