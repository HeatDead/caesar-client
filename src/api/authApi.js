import {instance} from "@/config/axiosConfig";
import axios from "axios";

const login = async (username, password) => {
    let res = await axios.post("http://localhost:8080/api/v1/auth/authenticate", {
        username: username,
        password: password
    })
    return res.data
}

export default {
    login
}