import { Signal } from 'usignal'

export type Action<A> = {
  [K in keyof A]: <T>(payload?: T) => void 
}

export type Actions<S, G, A> = {
  [K in keyof A]: 
    <V extends Exclude<keyof A, K>>(
        { state, dispatch, getters }: { 
          state: S, 
          getters?: Getters<S, G>,
          dispatch?: (type: V | string, payload?: unknown) => void
        }, 
        payload?: unknown
      ) => void
}

export type Getters<S, G> =  {
  [key in keyof G]: (state: S) => G[key]
}

export interface StoreOptions<S, G, A> {
  state: S
  getters?: Getters<S, G>
  actions?: Actions<S, G, A>
}

export type Store<G, A> = { 
  [K in keyof G]: Readonly<Signal<G[K]>>
} & {
  [K in keyof A]: <T>(payload?: T) => void
}
