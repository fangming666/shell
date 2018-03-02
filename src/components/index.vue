<template lang="pug">
  div.programme-warp
    div.programme(@mousemove="moveDom('')",  @mouseup="upDom")
      div.date
        h5.date-title {{nowYear}}年{{nowMonth}}月
        table.date-table(cellpadding=0, cellspacing=0)
          tr
            td(v-for="item in week") {{item}}
          tr(v-for="(item,index) in trNum", )
            td.date-hig( v-for="(item,index2) in tdNum", :class="actDate(index,index2)")
              span(v-if="index==0&&index2<firstData") {{propDay[index2]}}
              span(v-else-if="(index==0&&index2>=firstData) ||((index > 0)&&((index*7)+index2<(+firstData+allDay)))")  {{index*7+index2-firstData+1}}
              <!--span(v-else-if="index == 4") {{(7*(index+1)-allDay-firstData)-index2+1>=0?7*(index+1)-allDay-firstData)-index2+1}}-->

      div.info
        div.info-title 名字
        ul
          li(v-for="(item,index) in infoDataS")
            div.infoItem(:class="infoItem(index)", :data-name = "infoItem(index)", @mousedown="downDom(infoItem(index))")
              span {{item.name}}
              <!--i(class=["fa", "close", "fa-times"], @click.stop="delDom")-->
        button.save-data(@click = "saveDataS") 保存
</template>

<script>
  import jquery from "jquery";
  import {mapActions, mapState} from "vuex";
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
        infoDataS: [],
        mouseResult: false,
        mouseResult2: false,
        cloneDom: "",
        X: "",
        Y: "",
        domArr2: [],
        domIndex: "",
        floorX: "",
        floorY: "",
        ArrPosition: [],
        ArrJson: {"left": "", "top": "", "stamp": ""},
        saveJson: {},
        saveDom: [],
        saveResult: {"data": ""},
        boxWidth: "",
        boxHeight: 100,
        nowDate: "",
        resultData: "",
        subNum: 0,
        scrollW: 0,
        initLeft: 0, //200
        initTop: 0 //66
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
      this.range();
      window.addEventListener("resize", () => {
        this.range()
      });

      jquery(".close").on("click", () => {
        console.log(321);
      });

      //执行ajax的方法
      this.getAjaxS().then(() => {
        if (localStorage.ArrData) {
          JSON.parse(localStorage.ArrData).data.map((item) => {
            let initDom = "";
            initDom = jquery(`.${item.Dom}`).first().clone(false).addClass("activeInfoItem").css({
              "left": `${this.boxWidth * item.seam + this.boxWidth / 2 - 50}px`,
              "top": `${item.position.top}px`
            });


            initDom.css("display", "block");
            initDom.attr("data-stamp", item.stamp);
            jquery(".programme").append(initDom);
            this.domArr2.push(initDom);
            this.saveJson.left = +item.position.left;
            this.saveJson.top = +item.position.top;
            this.saveJson.stamp = +item.stamp;
            this.ArrPosition.push(this.saveJson);
//            console.log(this.ArrPosition);
            initDom.on("mousedown", () => {
              this.mouseResult = true;
              this.cloneDom = initDom;
              this.ArrPosition.map((item, index) => {
                if (item.stamp == this.cloneDom.attr("data-stamp")) {
                  this.ArrPosition.splice(index, 1);
                }
              });
            });
            this.saveJson = {};

          });

        }
      });

    },
    methods: {
      ...mapActions(["getDataS"]),
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
      range(){
        this.boxWidth = jquery(".date-table td").outerWidth();
        this.subNum = jquery(".programme").width() - jquery(".date").width() - jquery(".info").width();
      },
      //鼠标点击右边元素的时候进行的复制操作，开关（操作是否进行移动，mouseResult）打开
      downDom(itemS)
      {
        this.cloneDom = jquery(`.${itemS}`).first().clone(false).addClass("activeInfoItem").attr("data-pre", "false");
        this.domArr2.push(this.cloneDom); //克隆出的对象方法在此数组里
        jquery(".programme").append(this.cloneDom);
        this.mouseResult = true;
        return false;
      }
      ,
      //大的父div上的鼠标移动事件
      moveDom(domS)
      {
        //鼠标的坐标
        this.X = event.clientX;
        this.Y = event.clientY;
        //对鼠标位置进行的判断，然后确定是都打开开关（设定移动的范围）
        if ((event.clientX <= 60 + this.boxWidth * this.firstData + this.initLeft && event.clientY <= this.boxHeight + this.initTop + 89) || event.clientY <= 89 + this.initTop && this.X < jquery(".date").width() + this.initLeft + 20 || event.clientX >= this.boxWidth * this.firstData + this.initLeft - 20 && event.clientY >= this.boxHeight * 4 + this.initTop + 69 && this.X < jquery(".date").width() + this.initLeft + 20 && event.clientY < this.boxHeight * 5 + this.initTop + 89 || this.X < this.initLeft) {
          this.mouseResult = false;
        }

        //让clone出来的元素进行移动
        //当开关打开的时候，克隆出来的元素就可以移动了，
        if (this.mouseResult) {
          this.domArr2.map((item, index) => {
            jquery(item).on("mousedown", (e) => {
              this.mouseResult2 = true;
              this.mouseResult = true;
              this.domIndex = index;
              if (jquery(e.target).hasClass("infoItem")) {
                this.cloneDom = jquery(e.target);
                this.ArrPosition.map((item, index) => {
                  if (item.stamp == this.cloneDom.attr("data-stamp")) {
                    console.log(this.cloneDom.attr("data-stamp"));
                    this.ArrPosition.splice(index, 1);
                  }
                });
              }

              return false;
            });
            jquery(".programme").on("mousemove", () => {
              if ((event.clientX <= 60 + this.boxWidth * this.firstData + this.initLeft && event.clientY <= this.boxHeight + this.initTop + 89) || event.clientY <= 89 + this.initTop && this.X < jquery(".date").width() + this.initLeft + 20 || event.clientX >= this.boxWidth * this.firstData + this.initLeft - 20 && event.clientY >= this.boxHeight * 4 + this.initTop + 69 && this.X < jquery(".date").width() + this.initLeft + 20 && event.clientY < this.boxHeight * 5 + this.initTop + 89 || this.X < this.initLeft) {
                this.mouseResult2 = false;
              }
              if (this.mouseResult2 && this.domIndex) {
                this.domArr2[this.domIndex].css({"left": event.clientX - 70, "top": event.clientY - 30}).show();
              }

            });
            jquery(item).on("mouseup", () => {
              this.mouseResult2 = false;
            });
          });
          this.cloneDom.css({"left": event.clientX - 70, "top": event.clientY - 30}).show();
        }

      }
      ,

      //大div上的鼠标松开事件，关闭开关，使其无法无法移动
      upDom()
      {
        if (this.mouseResult) {
          if (this.X >= (jquery(".date").width() + this.initLeft + 20) || this.Y >= jquery(".programme").height() + this.initTop + 20) {
            this.cloneDom.attr("data-pre", "true");
            if (localStorage.ArrData) {
              let newObj = JSON.parse(localStorage.ArrData);
              for (let i = 0; i < newObj.data.length; i++) {
                if (this.cloneDom.attr("data-stamp") == newObj.data[i].stamp) {
                  newObj.data[i].pre = "true"
                }
              }
              localStorage.ArrData = JSON.stringify(newObj);
            }
            this.domArr2 = this.domArr2.splice(this.domArr2.indexOf(this.cloneDom) - 1, this.domArr2.indexOf(this.cloneDom));
            this.cloneDom.remove();
          } else {
            this.floorX = Math.floor((this.X - 60 - this.initLeft) / this.boxWidth) > 6 ? 6 : Math.floor((this.X - 60 - this.initLeft) / this.boxWidth);
            this.floorY = Math.ceil((this.Y - 89 - this.initTop) / this.boxHeight) > 5 ? 5 : Math.ceil((this.Y - 89 - this.initTop) / this.boxHeight);
            this.ArrJson = {
              "left": this.boxWidth * this.floorX + this.boxWidth / 2 - 50,
              "top": this.boxHeight * this.floorY - 30
            };
//            console.log(this.ArrJson);
            this.ArrPosition.map((item) => {
              if (this.ArrJson.left == item.left && this.ArrJson.top == item.top) {
                this.ArrJson.top = +item.top + 30;
                if (this.ArrJson.top >= this.boxHeight * (this.floorY ) + 40) {
                  this.domArr2 = this.domArr2.splice(this.domArr2.indexOf(this.cloneDom) - 1, this.domArr2.indexOf(this.cloneDom));
                  this.cloneDom.remove();
                }
              }

            });
            setTimeout(() => {
              this.cloneDom.animate({"left": this.ArrJson.left, "top": this.ArrJson.top}).show();
              this.cloneDom.attr("data-seam", this.floorX)
            }, 200);
            this.ArrPosition.push(this.ArrJson);
          }
          this.mouseResult = false;
          //以时间戳为标致我来标志每一个元素
          this.nowDate = Date.parse(new Date());
          this.cloneDom.attr("data-stamp", this.nowDate);
          this.ArrJson.stamp = this.nowDate;
        }

      }
      ,


      //点击保存进行保存数据
      saveDataS()
      {
        if (localStorage.ArrData) {
          this.saveDom = JSON.parse(localStorage.ArrData).data;
        } else {
          this.saveDom = [];
        }
        this.domArr2.map(item => {
            this.saveJson = {};
            this.saveJson.position = {"left": item.css("left").split("px")[0], "top": item.css("top").split("px")[0]};
            this.saveJson.Dom = item.attr("data-name");
            this.saveJson.stamp = item.attr("data-stamp");
            this.saveJson.seam = item.attr("data-seam");
            this.saveJson.pre = item.attr("data-pre");
            this.saveDom.push(this.saveJson);
          }
        );
        //对象数组去重
        let hash = {};
        this.saveDom = this.saveDom.reduce((item, next) => {
          hash[next.stamp] ? "" : hash[next.stamp] = true && item.push(next);
          return item
        }, []);
        this.saveResult.data = this.saveDom;
        localStorage.ArrData = JSON.stringify(this.saveResult);

        //删除离线存储里面data-pre是“true”的部分
        let preObj = JSON.parse(localStorage.ArrData);
        preObj.data.map((item, index) => {
          if (item.pre == "true") {
            preObj.data.splice(index, 1)
          }
        });
        localStorage.ArrData = JSON.stringify(preObj);
      },

      //ajax获取后台数据
      getAjaxS()
      {
//        let url = "http://fm.xiaofany.com/programme.php";
        let url = "http://localhost:3000/assistantList";
        return this.getDataS(url).then(() => {
          this.infoDataS = this.infoData;
        })
      }
      ,


      //删除复制出来的dom元素
      delDom()
      {
        console.log(123);
      }
    },
    computed: {
      ...
        mapState(["infoData"])
    }
  }
</script>

