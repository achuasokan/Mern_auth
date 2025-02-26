import {combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import adminReducer from './admin/adminSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer
})

const persistConfig = {
  key: 'user',
  version: 1,
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export default store

export  const persistor = persistStore(store)