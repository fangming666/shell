<template lang="pug">
  div.programme(@mousemove="moveDom('')",  @mouseup="upDom")
    div.date
      h5.date-title {{nowYear}}年{{nowMonth}}月{{nowDay}}日
      table.date-table(cellpadding=0, cellspacing=0)
        tr
          td(v-for="item in week") {{item}}
        tr(v-for="(item,index) in trNum", )
          td( v-for="(item,index2) in tdNum", :class="actDate(index,index2)")
            span(v-if="index==0&&index2<firstData") {{propDay[index2]}}
            span(v-else-if="(index==0&&index2>=firstData) ||((index > 0)&&((index*7)+index2<(+firstData+allDay)))")  {{index*7+index2-firstData+1}}
            <!--span(v-else-if="index == 4") {{(7*(index+1)-allDay-firstData)-index2+1>=0?7*(index+1)-allDay-firstData)-index2+1}}-->

    div.info
      ul
        li(v-for="(item,index) in infoData")
          div.infoItem(:class="infoItem(index)", @mousedown="downDom(infoItem(index))") {{item}}
</template>

<script>
  import jquery from "jquery";
  export default{
    data(){
      return {
        trNum: [],
        tdNum: [],
        week: ["日", "一", "二", "三", "四", "五", "六"],
        nowYear: "",
        nowMonth: "",
        nowDay: "",
        firstData: "",
        allDay: "",
        propDay: [],
        nextDay: [],
        infoData: [1, 2, 3, 4, 5, 6, 7],
        mouseResult: false,
        mouseResult2: false,
        cloneDom: "",
        X: "",
        Y: "",
        domArr: [],
        domArr2: [],
        domArr3: [],
        domIndex: ""

      }
    },
    mounted(){
      this.trNum.length = 5;
      this.tdNum.length = 7;
      let date = new Date();
      this.nowYear = date.getFullYear();
      this.nowMonth = +date.getMonth() + 1;
      this.nowDay = date.getDate();
      this.firstData = new Date(`${this.nowYear}-${this.nowMonth}-01`).getDay();
      this.allDay = new Date(this.nowYear, this.nowMonth, 0).getDate();
      let propAll = new Date(this.nowYear, this.nowMonth - 1, 0).getDate();
      for (let i = 0; i < this.firstData; i++) {
        this.propDay.unshift(propAll - i);
      }
      for (let i = 1; i < (43 - this.allDay - this.firstData); i++) {
        this.nextDay.push(i);
      }
    },
    methods: {
      actDate(index, index2){
        if ((+this.nowDay + this.firstData - 1) == (index * 7 + index2)) {
          return "nowDay"
        } else if ((index == 0 && index2 >= this.firstData) || ((index > 0) && ((index * 7) + index2 < (+this.firstData + this.allDay)))) {
          return "activeDay"
        }
      },
      infoItem(index){
        return `infoItem${index}`
      },

      //鼠标点击右边元素的时候进行的复制操作，开关（操作是否进行移动，mouseResult）打开
      downDom(itemS){
        this.cloneDom = jquery(`.${itemS}`).first().clone(false).addClass("activeInfoItem");
        this.domArr.push(this.cloneDom.text()); //克隆出的对象方法在此数组里
        if (this.domArr3.indexOf(this.cloneDom.text()) == -1) {
          this.domArr2.push(this.cloneDom); //克隆出的对象方法在此数组里
          this.domArr3.push(this.cloneDom.text());
          jquery(".programme").append(this.cloneDom);
          this.mouseResult = true;
          this.domArr3.map((item) => {
            console.log(jquery(item).text())
          });

        }



      },
      //大的父div上的鼠标移动事件
      moveDom(domS){
        //鼠标的坐标
        this.X = event.clientX;
        this.Y = event.clientY;
        //对鼠标位置进行的判断，然后确定是都打开开关（设定移动的范围）
        if ((event.clientX <= (90 + 121 * this.firstData) && event.clientY <= 243) || event.clientY <= 142 || ( event.clientX >= 490 && event.clientX <= 897 && event.clientY >= 530)) {
          this.mouseResult = false;
        }

        //让clone出来的元素进行移动
        //当开关打开的时候，克隆出来的元素就可以移动了，
        if (this.mouseResult) {
          this.domArr2.map((item, index) => {
            jquery(item).on("mousedown", () => {
              this.mouseResult2 = true;
              this.domIndex = index;
            });
            jquery(".programme").on("mousemove", () => {
              if ((event.clientX <= (90 + 121 * this.firstData) && event.clientY <= 243) || event.clientY <= 142 || ( event.clientX >= 490 && event.clientX <= 897 && event.clientY >= 530)) {
                this.mouseResult2 = false;
              }
              if (this.mouseResult2) {
                this.domArr2[this.domIndex].css({"left": event.clientX - 40, "top": event.clientY - 10}).show();
              }

            });
            jquery(item).on("mouseup", () => {
              this.mouseResult2 = false;
            });
          });

          this.cloneDom.css({"left": event.clientX - 40, "top": event.clientY - 10}).show();
        }

      },

      //大div上的鼠标松开事件，关闭开关，使其无法无法移动
      upDom(){
        if (this.X >= 937 || this.Y >= 650) {
          this.cloneDom.remove();
        }
        this.mouseResult = false;
      }
    },
    computed: {}
  }
</script>

