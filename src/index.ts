import { computed, signal, Signal } from 'usignal'
import { Actions, Getters, Store, StoreOptions } from './types'

export * from './types'

function dispatch<S, A>(state: S, actions: Actions<S, A>) {
  return <T>(type: keyof typeof actions, payload?: T) => {
    actions[type]?.(state, payload)
  }
}

function createGetters<S, G>(state: S, gets: Getters<S, G>) {
  return Object.keys(gets || {}).reduce((p, c) => {
    p[c] = computed(() => gets[c](state))
    return p
  }, {} as  {
    [K in keyof typeof gets]: Readonly<
      Signal<ReturnType<typeof gets[K]>>
    >
  })
}

function createSignals<S>(state: S) {
  return Object.keys(state).reduce((p, c) => {
    const s = state[c]
    p[c] = s instanceof Signal ? s: signal<typeof s>(s)
    return p
  }, {} as S)
}

export function createStore<S, A, G>(options: StoreOptions<S, A, G>) {
  const { state, getters, actions } = options
  const states = createSignals(state)
  return { 
    ...createGetters(states, getters as Getters<S, G>), 
    dispatch: dispatch(states, actions as Actions<S, A>) 
  } as Store<G, A> & {}
}