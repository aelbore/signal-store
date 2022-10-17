# signal-store
type-safe store library

#### Create a Store
```ts
import { createStore } from 'signal-store'

type Product = {
  id?: string
  title?: string
  price?: number
  quantity?: number
}

const store = createStore({
  state: {
    products: signal<Product[]>([
      { id: 'p1', title: 'Gaming Mouse', price: 29.99, quantity: 0 }
    ]),
    success: signal(false)
  }, 
  getters: {
    totalQuantity(state) {
      return state.products.value.reduce((p, c) => {
        return p + c.quantity
      }, 0)
    },
    products(state) {
      return state.products.value
    },
    success(state) {
      return state.success.value
    }
  },
  actions: {
    addToCart({ state, dispatch }, payload: Product) {
      const products = [ ...state.products.value ]
      const index = products.findIndex(c => c.id === payload.id)
      if (index !== -1) {
        products[index].quantity++
      } else {
        products.push({ ...payload, quantity: 1 })
      }
      state.products.value = [ ...products ]
      dispatch('onSuccess', true)
    },
    onSuccess({ state }, payload: boolean) {
      state.success.value = payload
    }
  } 
})

store.addToCart({ 
  id: 'p1', 
  title: 'Gaming Mouse', 
  price: 29.99 
})

const totalQuantity = store.totalQuantity.value // 1
const success = store.success.value // true
```