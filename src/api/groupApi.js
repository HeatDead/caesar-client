import axios from "axios";
import { instance } from "@/config/axiosConfig";

const getGroups = async () => {
    let res = await instance.get("/group")
    return res.data
}

export default {
    getGroups
}