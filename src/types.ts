import { Signal } from 'usignal'

export type Actions<S, A> = {
  [key in keyof A]: <T>(state: S, payload?: T) => void
}

export type Getters<S, G> =  {
  [key in keyof G]: (state: S) => G[key]
}

export interface StoreOptions<S, A, G> {
  state: S
  getters?: Getters<S, G>
  actions?: A
}

export type Store<G, A> = { 
  [K in keyof G]: Readonly<Signal<G[K]>>
} & {
  dispatch: <T>(type: keyof A, payload?: T) => void
}
