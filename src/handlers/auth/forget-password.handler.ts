import axios from 'axios'
import Swal from "sweetalert2";

export interface ForgetPasswordParams {
    reset_url: string
    email: string
}

export const forgetPasswordHandler = async ({reset_url, email}: ForgetPasswordParams) => {
    return axios.get('/auth/forgetPassword').then(({data}) => {
        const {form_id, form_build_id, form_token, token} = data.data;
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        return axios.post('/auth/forgetPassword',
            {
                reset_url: window.location.origin + "/auth/reset-password",
                email, form_id, form_build_id, form_token, token
            } , {validateStatus: status => true})
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
                            text: "Please check your mail",
                            icon: "success",
                        }
                    )
                }
                return {
                    ...res.data,
                    token
                }
            })
    })
}
