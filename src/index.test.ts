import { signal } from 'usignal'
import { createStore } from './index'

describe('Store', () => { 

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should set the value of state and get the value from getters', () => {
    const name = 'Jane'

    const store = createStore({
      state: {
        name: signal('')
      }, 
      getters: {
        name(state) {
          return state.name.value
        },
        fname(state) {
          return state.name.value
        }
      }, 
      actions: {
        setName({ state }, payload: string) { 
          state.name.value = payload
        }
      }
    })

    store.setName(name)
    expect(store.name.value).toStrictEqual(name)
  })

  it('should call action type', () => {
    const name = 'Jane'

    const actions = {
      setName({ state }, payload: string) { }
    }

    const onSetName = vi.spyOn(actions, 'setName')

    const store = createStore({
      state: {
        name: signal('')
      }, 
      actions: {
        setName: actions.setName
      }
    })

    store.setName(name)
    expect(onSetName).toHaveBeenCalledTimes(1)
  })

  it('should call getters type', () => {
    const name = 'Jane'

    const getters = {
      name(state) {
        return state.name.value
      }
    }

    const onGetName = vi.spyOn(getters, 'name')

    const store = createStore({
      state: {
        name: signal('')
      }, 
      getters: {
        name: getters.name
      },
      actions: {
        setName({ state }, payload: string) {
          state.name.value = payload
        }
      }
    })

    store.setName(name)

    expect(store.name.value).toStrictEqual(name)
    expect(onGetName).toHaveBeenCalledTimes(1)
  })

  it('should computed', () => {
     type Product = {
      id?: string
      title?: string
      price?: number
      quantity?: number
    }
    
    const store = createStore({
      state: {
        products: signal<Product[]>([
          { id: 'p1', title: 'Gaming Mouse', price: 29.99, quantity: 0 },
          { id: 'p2', title: 'Harry Potter 3', price: 9.99, quantity: 1 }
        ])
      }, 
      getters: {
        totalQuantity(state) {
          return state.products.value.reduce((p, c) => {
            return p + c.quantity
          }, 0)
        },
        products(state) {          
          return state.products.value
        }
      },
      actions: {
        addToCart({ state }, payload: Product) {
          const products = [ ...state.products.value ]
          const index = products.findIndex(c => c.id === payload.id)
          if (index !== -1) {
            products[index].quantity++
          } else {
            products.push({ ...payload, quantity: 1 })
          }
          state.products.value = [ ...products ]
        }
      } 
    })

    store.addToCart({ id: 'p1', title: 'Gaming Mouse', price: 29.99 })

    expect(store.totalQuantity.value).toStrictEqual(2)
    expect(store.products.value.find(p => p.id === 'p1').quantity).toStrictEqual(1)
  })

  it('should dispatch inside action', () => {
    const name = 'Jane'

    const actions = {
      getName({ state, dispatch }, payload: string) { }
    }

    const onGetName = vi.spyOn(actions, 'getName')

    const store = createStore({
      state: {
        name: signal('')
      }, 
      actions: {
        setName({ dispatch }, payload: string) { 
          dispatch('getName', payload)
        },
        getName: actions.getName
      }
    })

    store.setName(name)
    expect(onGetName).toHaveBeenCalledTimes(1)
  })

  it('should access the getters within getters', () => {
    const name = 'Jane'

    const store = createStore({
      state: {
        name: signal('')
      }, 
      getters: {
        name(state) {
          return state.name.value
        },
        fullname(state, { getters }) {                  
          /// TODO: need to find a way types will not error
          /// if getters will use direct instead of assign to a variable
          const name = getters.name.value as string
          return state.name.value + ' ' + name
        }
      },
      actions: {
        setName({ state }, payload: string) {
          state.name.value = payload
        }
      }
    })

    store.setName(name)

    expect(store.name.value).toStrictEqual(name)
    expect(store.fullname.value).toStrictEqual(name + ' ' + name)
  })

  it('should call the core getters modules in store getters', () => {
    const name = 'Jane'
    const fname = 'Doe'

    const core = createStore({
      state: {
        name: signal(name)
      },
      getters: {
        name(state) {
          return state.name.value
        }
      }
    })

    const store = createStore({
      state: {
        fname: signal(''),
        v: signal(true)
      },
      modules: {
        core
      },
      getters: {
        fname({ state, modules }) {          
          return state.fname.value + ' ' + modules.core.name.value
        }
      },
      actions: {
        setName({ state }, payload: string) {
          state.fname.value = payload
        }
      }
    })

    store.setName('Doe')
    expect(store.fname.value).toStrictEqual(fname + ' ' + name)
  })

  it('should call the core gettes modules in store actions', () => {
    const name = 'Jane'

    const core = createStore({
      state: {
        name,
      },
      getters: {
        name(state) {
          return state.name.value
        }
      }
    })

    const store = createStore({
      state: {
        fname: signal(''),
        v: signal(true)
      },
      modules: {
        core
      },
      getters: {
        fname({ state }) {          
          return state.fname.value
        }
      },
      actions: {
        setName({ state, modules }) {
          state.fname.value =  modules.core.name.value
        }
      }
    })

    store.setName(name)
    expect(store.fname.value).toStrictEqual(name)
  })

  it('should call action type', () => {
    const store = createStore({
      state: {
        name: 'Jane'
      }, 
      getters: {
        name({ state }) {
          return state.name.value
        }
      },
      actions: {
        setName({ dispatch }) {
          dispatch('display')
        },
        display() {
          console.log('hello')
        }
      }
    })

    store.setName()
    expect(store.name.value).toStrictEqual("Jane")
  })

  it('store without state', () => {
    const store = createStore({
      getters: {
        name() {
          return 'Jane'
        }
      }
    })

    expect(store.name.value).toStrictEqual("Jane")
  })

}) 