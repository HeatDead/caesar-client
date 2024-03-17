import axios from "axios";
import {instance} from "@/config/axiosConfig";

const getUsers = async () => {
    let res = await instance.get("/user")
    return res.data
}

export default {
    getUsers
}