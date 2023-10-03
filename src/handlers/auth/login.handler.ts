import axios from 'axios'
import Swal from "sweetalert2";

export interface LoginParams {
    email: string
    password: string
}

export const loginHandler = async ({email, password}: LoginParams) => {
    return axios.post('/auth/login', {email, password}, {validateStatus: status => true})
        .then((res) => {
            if (res.status == 400) {
                Swal.fire({
                    title: "Error",
                    text: res.data.messages.map((t: any) => Object.values(t).join('\n')),
                    icon: "error",
                });
            }
            return {
                ...res?.data,
            }
        })
}
