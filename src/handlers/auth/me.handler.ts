import axios from "axios";

export const meHandler = async () => {
    if(axios.defaults.headers.common.Authorization){
        return await axios.get('/users/me')
        .then(({data}) => data?.data)
        .catch((error) => {
            if(error.response.status == 403){
                delete axios.defaults.headers.common.Authorization;
                window.location.assign("/dashboard");
            }
        })
    }else {
        return {};
    }
}