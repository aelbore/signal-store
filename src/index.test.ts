import { Signal, signal } from 'usignal'
import { createStore } from './index'

export type State = { name?: Signal<string> }

export interface Product {
  id?: string
  title?: string
  price?: number
  quantity?: number
}

export interface ProductState {
  products?: Signal<Product[]>
}

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
        name(state: State) {
          return state.name.value
        }
      }, 
      actions: {
        setName(state: State, payload: string) { 
          state.name.value = payload
        }
      }
    })

    store.dispatch('setName', name)
    expect(store.name.value).toStrictEqual(name)
  })

  it('should call action type', () => {
    const name = 'Jane'

    const actions = {
      setName(state: State, payload: string) { }
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

    store.dispatch('setName', name)
    expect(onSetName).toHaveBeenCalledTimes(1)
  })

  it('should call getters type', () => {
    const name = 'Jane'

    const getters = {
      name(state: State) {
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
        setName(state: State, payload: string) {
          state.name.value = payload
        }
      }
    })

    store.dispatch('setName', name)

    expect(store.name.value).toStrictEqual(name)
    expect(onGetName).toHaveBeenCalledTimes(1)
  })

  it('should computed', () => {

    const store = createStore({
      state: {
        products: signal<Product[]>([
          { id: 'p1', title: 'Gaming Mouse', price: 29.99, quantity: 0 },
          { id: 'p2', title: 'Harry Potter 3', price: 9.99, quantity: 1 }
        ])
      }, 
      getters: {
        totalQuantity(state: ProductState) {
          return state.products.value.reduce((p, c) => {
            return p + c.quantity
          }, 0)
        },
        products(state: ProductState) {
          return state.products.value
        }
      },
      actions: {
        addToCart(state: ProductState, payload: Product) {
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

    store.dispatch('addToCart', { id: 'p1', title: 'Gaming Mouse', price: 29.99 })

    expect(store.totalQuantity.value).toStrictEqual(2)
    expect(store.products.value.find(p => p.id === 'p1').quantity).toStrictEqual(1)
  })

})