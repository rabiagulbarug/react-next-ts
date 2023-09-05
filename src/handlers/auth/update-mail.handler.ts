import axios from 'axios'

export interface UpdateMailParams{
    email: string
}

export default async function updateMailHandler({email}:UpdateMailParams) {
    if(axios.defaults.headers.common.Authorization){
        return axios.post(`/profile/updateEmail`,
            {email})
            .then((res) => ({
                ...res.data,
            }))
    }else {
        return {};
    }
}