/**
 * Created by DELL on 2018/2/8.
 */
import * as server from "./ajax";


export const getDataS = async ({commit}, url) => {
  let dataS = await server._getAjax(url);
  try {
    commit("LIST_INFO", dataS)
  } catch (e) {
    commit("ERROR")
  }
  return dataS;
};
