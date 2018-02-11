/**
 * Created by DELL on 2018/2/8.
 */
import vue from "vue";
import vueX from "vuex";

vue.use(vueX);

//获取当月有几天

const state = {
  nowDate : new Date(),
};
export default new vueX.Store({
  state
})
