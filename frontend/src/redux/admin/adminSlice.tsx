import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  currentAdmin: null,
  loading: false,
  error: null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginStart: (state) => {
      state.loading = true
    },
    adminLoginSuccess: (state,action) => {
      state.currentAdmin = action.payload
      state.loading = false
      state.error = null
    },
    adminLoginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    adminLogout: (state) => {
      state.currentAdmin = null
      state.loading = false
      state.error = null
    }
  }
})

export const { adminLoginStart, adminLoginSuccess, adminLoginFailure, adminLogout } = adminSlice.actions
export default adminSlice.reducer