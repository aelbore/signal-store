import { Signal } from 'usignal'

export type Action<A> = {
  [K in keyof A]: <T>(payload?: T) => void
}

export type Actions<S, G, A> = {
  [K in keyof A]: 
    <V extends Exclude<keyof A, K>, GR extends GettersReadOnly<G>>(
        { state, dispatch, getters }: { 
          state: S, 
          getters?: GR,
          dispatch?: (type: V | string, payload?: unknown) => void
        }, 
        payload?: unknown
      ) => void
}

export type Getters<S, G> = {
  [K in keyof G]: 
    <V extends {
      [X in Exclude<keyof G, K>]: GettersReadOnly<G>[K]
    }>(
      state: S, 
      getters?: V
    ) => G[K]
}

export type GettersReadOnly<G> = {
  [K in keyof G]: Readonly<Signal<G[K]>>
}

export type IGettersReadOnly<G, V extends keyof G> = {
  [K in V]: Readonly<Signal<G[K]>>
}


export interface StoreOptions<S, G, A> {
  state: S
  getters?: Getters<S, G>
  actions?: Actions<S, G, A>
}

export type Store<G, A> = GettersReadOnly<G> & Action<A>