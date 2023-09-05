import axios from 'axios'
import Swal from "sweetalert2";
import styles from "./auth.module.css";


export interface ResetPasswordParams {
    user: string
    key: string
    password: string
    password2: string
}

export const resetPasswordHandler = async ({user, key, password, password2}: ResetPasswordParams) => {
    return axios.get(`/auth/resetPassword?USER=${user}&KEY=${key}`).then(({data}) => {
        const {form_id, form_build_id, form_token, token} = data.data;
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        return axios.post(`/auth/resetPassword?USER=${user}&KEY=${key}`,
            {password, password2, form_id, form_build_id, form_token, token}, {validateStatus: status => true} )
            .then((res) => {
                if (res.status === 400) {
                    Swal.fire({
                        title: "Error",
                        text: res.data.messages.map((t: any) => Object.values(t).join('\n')),
                        icon: "error",
                    });
                } else {
                    Swal.fire({
                            title: "",
                            text: "Password reset successfully",
                            icon: "success",
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                           window.location.assign('/auth/login')
                        }
                    });
                }
                return {
                    ...res.data,
                    token
                }
            })
    })
}
