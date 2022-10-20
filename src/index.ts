import { computed, signal, Signal } from 'usignal'
import { Action, Actions, Getters, Store, GettersReadOnly, StoreOptions } from './types'

export * from './types'

function createGetters<S, G>(state: S, gets: Getters<S, G>) {
  return Object.keys(gets).reduce((p, c) => {
    p[c] = computed(() => gets[c](state))
    return p
  }, {} as  {
    [K in keyof typeof gets]: Readonly<
      Signal<ReturnType<typeof gets[K]>>
    >
  })
}

function createActions<S, G, A>(state: S, getters: GettersReadOnly<G>, actions: Actions<S, G, A>) {
  return Object.keys(actions).reduce((p, c) => {
    p[c] = <T>(payload?: T) => {
      actions[c]?.({ 
        state, 
        getters, 
        dispatch: (type: keyof typeof actions, payload?: T) => {
          p[type](payload)
        }
      }, payload)
    }
    return p
  }, {} as Action<A>)
}

export function createStateSignals<S>(state: S) {
  return Object.keys(state).reduce((p, c) => {
    const s = state[c]
    p[c] = s instanceof Signal ? s: signal<typeof s>(s)
    return p
  }, {} as S)
}

export function createStore<S, G, A>(options: StoreOptions<S, G, A>) {
  const { state, getters = {}, actions = {}} = options
  const states = createStateSignals(state)  
  const getters$ = createGetters(states, getters)
  return { 
    ...getters$, 
    ...createActions(states, getters$, actions)
  } as Store<G, A>
}