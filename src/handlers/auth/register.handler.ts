import axios from 'axios'
import Swal from "sweetalert2";

export interface RegisterParams {
    name: string
    surname: string
    email: string
    password: string
    password_again: string
    address: string
    town: string
    postalcode: string
    county: string
    country: number
    phone: string
    mobile: string

}

export const registerHandler = async ({
                                          name, surname, email, password, password_again, address,
                                          town, postalcode, county, country, phone, mobile
                                      }: RegisterParams) => {
    return axios.get('/auth/register').then(({data}) => {
        const {form_id, form_build_id, form_token, token} = data.data;
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        return axios.post('/auth/register', {
            name,
            surname,
            email,
            password,
            password_again,
            address,
            town,
            postalcode,
            county,
            country,
            phone,
            mobile,
            form_id,
            form_build_id,
            form_token,
            token
        }, {validateStatus: status => true}).then((res) => {
            if(res.status === 400) {
                Swal.fire({
                    title:"Error",
                    text: res.data.messages.map((t:any) => Object.values(t).join('\n')),
                    icon:"error",
                });
            }
            else {
                window.location.assign("/auth/login");
            }
            return {
                ...res?.data,
                token
            }
        })
    })
}
