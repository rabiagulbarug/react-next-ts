import axios from 'axios'

export default async function sendVerificationMailHandler() {
    return axios.get(`/profile/sendVerificationMail`).then(res => res.data)
}