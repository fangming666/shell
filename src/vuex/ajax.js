/**
 * Created by DELL on 2018/2/8.
 */
import axios from "axios";
export const _getAjax = async (url) => {
  let data = await axios({
    method: "get",
    url: url,
    timeout: 3000,
    responseType: "json"
  });
  try {
    return data
  } catch (e) {
    return Promise.reject(new Error);
  }
};
