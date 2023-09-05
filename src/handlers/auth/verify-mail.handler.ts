import axios from 'axios'

export interface VerifyMailParams {
    key: string
}

export default async function verifyMailHandler({key}: VerifyMailParams) {
    if(axios.defaults.headers.common.Authorization){
        return await axios.get(`/profile/verifyMail?key=${key}`)
            .then((data) => data?.data)
    }else {
        return {};
    }
}