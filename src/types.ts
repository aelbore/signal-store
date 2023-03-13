import { ReactiveSignal } from 'usignal'

export type Action<A> = {
  [K in keyof A]: <T>(payload?: T) => void
}

export type Actions<S, G, A, M> = {
  [K in keyof A]: 
    <
      V extends Exclude<keyof A, K>, 
      GR extends GettersReadOnly<G>,
      B extends Modules<M>
    >(
        { state, dispatch, getters, modules }: { 
          state: S, 
          getters?: GR,
          modules?: B
          dispatch?: (type: V | string, payload?: unknown) => void
        }, 
        payload?: unknown
      ) => void
}

export type FPropNames<T> = { 
  [K in keyof T]: T[K] extends Function ? K : never 
}[keyof T]

export type State<S> = {
  [T in keyof S]: Readonly<ReactiveSignal<S[T]>>
}

export type Getters<S, G, M> = {
  [K in keyof G]: 
    <
      V extends { [X in Exclude<keyof G, K>]: Readonly<ReactiveSignal<G[X]>> },
      X extends {
        [A in keyof Modules<M>]: {
          [B in Exclude<keyof Modules<M>[A], FPropNames<Modules<M>[A]>>]: Modules<M>[A][B]
        }
      }
    >(
      state?: S & { state?: State<S>, getters?: V, modules?: X  },
      { getters, modules }?: {
        getters?: V,
        modules?: X
      }
    ) => G[K]
}

export type GettersReadOnly<G> = {
  [K in keyof G]: Readonly<ReactiveSignal<G[K]>>
}

export type Modules<M> = {
  [K in keyof M]: M[K]
}

export interface StoreOptions<S, G, A, M> {
  state: S
  modules?: Modules<M>
  getters?: Getters<S, G, M>
  actions?: Actions<S, G, A, M>
}

export type Store<M, G, A> = GettersReadOnly<G> & Action<A> & Modules<M>
