import axios from 'axios'

export interface LoginParams {
    email: string
    password: string
}

export const loginHandler = async ({email, password}: LoginParams) => {
    return axios.get('/auth/login').then(({data}) => {
        const {form_id, form_build_id, form_token, token} = data.data;
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        return axios.post('/auth/login', { username: email, password, form_id, form_build_id, form_token, token }).then((res) => ({
            ...res.data?.data,
            token
        }))
    })
}
