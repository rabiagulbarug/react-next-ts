import axios from 'axios'

export const logoutHandler = async () => {
    return axios.post('/auth/logout')
}
