/**
 * Created by DELL on 2018/2/8.
 */
import vue from "vue";
import vueX from "vuex";
import * as actions from "./action";

vue.use(vueX);


const state = {
  infoData: []
};
const mutations = {
  //获取后台传过来的数据
  LIST_INFO(state,item){
    state.infoData = item.data.all
  },
  ERROR(){
    alert("获取信息失败")
  }
};
export default new vueX.Store({
  state,
  mutations,
  actions
})
