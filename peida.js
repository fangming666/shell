/**
 * Created by DELL on 2018/2/24.
 */
// window.onload = function () {
//   var oTab = document.getElementById("cen_right_top");
//   var aH3 = oTab.getElementsByTagName("h2");
//   var aDiv = oTab.getElementsByClassName("dt_one");
//   for (var i = 0; i < aH3.length; i++) {
//     aH3[i].index = i;
//     aH3[i].onmouseover = function () {
//       for (var i = 0; i < aH3.length; i++) {
//         aH3[i].className = "";
//         aDiv[i].style.display = "none";
//       }
//       this.className = "active";
//       aDiv[this.index].style.display = "block";
//     }
//   }
// };


class Tab {
  constructor(dom2, dom3) {
    this.dom2 = dom2;
    this.dom3 = dom3;
  };

  result() {
    this.dom2.map((item, index) => {
      item.index = index;
      item.addEventListener("mouseover", function () {
        dom2.map((item2, index2) => {
          item2.className = "";
          this.dom3[index2].style.display = "none"
        });
        item.className = "active";
        this.dom3[index].style.display = "block"
      })
    })
  };

}
export  default Tab;
