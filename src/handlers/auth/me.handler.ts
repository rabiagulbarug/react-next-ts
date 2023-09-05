import axios from "axios";

export const meHandler = async () => {
    if(axios.defaults.headers.common.Authorization){
        return await axios.get('/me')
        .then(({data}) => data?.data)
        .catch((error) => {
            if(error.response.status == 403){
                delete axios.defaults.headers.common.Authorization;
                /**
                 * @Todo update this code in NextJs way.
                 */
                window.location.assign("/auth/login");
            }
        })
    }else {
        return {};
    }
}