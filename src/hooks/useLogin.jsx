import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {

  const { dispatch } = useAuthContext()

  function login(user){

      // update the auth context
      dispatch({type: 'LOGIN', payload: user})

    
    }
  

  return { login}
}