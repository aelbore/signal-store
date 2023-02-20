import { computed, ReactiveSignal, signal, Signal } from 'usignal'
import { Action, Actions, Getters, Store, GettersReadOnly, StoreOptions, Modules } from './types'

export * from './types'

function createGetters<S, G, M, A>(
  state: S, 
  gets: Getters<S, G, M>, 
  modules: Modules<M>
) {
  return Object.keys(gets).reduce((p, c) => {
    p[c] = computed(() => {
      return gets[c](state, {
        getters: createGetters(state, gets, modules),
        modules
      })
    })
    return p
  }, {} as  {
    [K in keyof typeof gets]: Readonly<
      ReactiveSignal<ReturnType<typeof gets[K]>>
    >
  })
}

function createActions<S, G, A, M>(
  state: S, 
  getters: GettersReadOnly<G>, 
  actions: Actions<S, G, A, M>,
  modules?: Modules<M>
) {
  return Object.keys(actions).reduce((p, c) => {
    p[c] = <T>(payload?: T) => {
      actions[c]?.({ 
        state, 
        getters,
        modules,
        dispatch: (type: keyof typeof actions, payload?: T) => {
          p[type](payload)
        }
      }, payload)
    }
    return p
  }, {} as Action<A>)
}

function createModules<M>(modules: M) {
  return Object.keys(modules).reduce((p, c) => {
    p[c] = modules[c]
    return p
  }, {})
}

export function createStateSignals<S>(state: S) {
  return Object.keys(state).reduce((p, c) => {
    const s = state[c]
    p[c] = s instanceof Signal ? s: signal<typeof s>(s)
    return p
  }, {} as S)
}

export function createStore<S, G, A, M>(options: StoreOptions<S, G, A, M>) {
  const { modules = {}, state, getters = {}, actions = {}} = options
  const states = createStateSignals(state)  
  const getters$ = createGetters(states, getters, modules)
  return { 
    ...createModules(modules),
    ...getters$, 
    ...createActions(states, getters$, actions, modules)
  } as Store<M, G, A>
}