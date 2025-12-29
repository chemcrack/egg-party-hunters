<script setup lang="ts">
import {onMounted, ref, type Ref} from "vue";
import {useRoute} from 'vue-router'
import mapView from './MapView.vue';
import Help from "./help2.vue"
import info from "./info.vue"
import MapView from "./MapView.vue";
import {type rowData} from "./model";
import switchButton from "./switchDoor.vue";

const urlBase = "/party/";

const urlImage = {image: urlBase + "images/A", thumbnail: urlBase + "thumbnail/T", link: "https://party.0chem.com/?id="};

const res = await fetch(urlBase + 'party.json');
const v = await res.json();
const jsonData = ref<Array<rowData> | null>(null);
const imageView = ref<InstanceType<typeof mapView>>();
const helpView = ref<InstanceType<typeof Help>>();
jsonData.value = v.data;

// 获取路由实例
// const router = useRouter();
// 获取当前路由信息
const route = useRoute();
const id = route.query.id as string;
console.log(id);

let data: Ref<Array<{
  group: string, color: string; item: Array<{
    url: string, ext: string; doorStyle: string, date: string; degree: number;
  }>
}>> = ref([]);

const formData = {
  info: ref(),
  imageData: ref({show: 0, groupId: 0, index: 0, url: "", degree: 0, doorType: false, doorSelect: 0}),
  mainEntrance: function (exportType: string, doorSelect: number) {
    formData.imageData.value.show = 1;
    formData.imageData.value.doorSelect = doorSelect;
    data.value = [
      {group: "其他", color: "white", item: []}, // 0
      {group: "挨着红房间", color: "#32CD32", item: []}, // 0
      {group: "特殊", color: "#00FFFF", item: []}, // 0
    ];
    if (jsonData.value != null)
      for (let item of jsonData.value) {
        if (item.doorMain.sort == exportType)
          data.value[item.doorMain.groupId - 1]?.item.push({url: item.id, ext: item.ext, doorStyle: "left", date: item.date, degree: item.doorMain.degree});
      }
  },
  sideEntrance: function (exportType: string, doorSelect: number) {
    formData.imageData.value.show = 1;
    formData.imageData.value.doorSelect = doorSelect;
    data.value = [
      {group: "一般", color: "white", item: []}, // 0
      {group: "进门是红房", color: "#32CD32", item: []}, // 0
      {group: "挨着楼梯或红房", color: "#00FFFF", item: []}, // 0
      {group: "特殊", color: "yellow", item: []}, // 0
    ];
    if (jsonData.value != null)
      for (let item of jsonData.value) {
        if (item.doorSide.sort == exportType)
          data.value[item.doorSide.groupId - 1]?.item.push({url: item.id, ext: item.ext, doorStyle: "right", date: item.date, degree: item.doorSide.degree});
      }
  },
  selectDoor: (v: number) => {
    formData.imageData.value.degree = v;
  },
  imageClick: (groupId: number, id: number) => {
    const item = data.value[groupId]?.item[id];
    if (item) {
      let url = urlImage.image + item.url + item.ext;
      if (imageView.value) {
        console.log("image");
        imageView.value.open(url, item.degree + formData.imageData.value.degree, "更新于 " + item.date, urlImage.link + item.url);
      }
    }
  },
  imageClose: () => {
    formData.imageData.value.show = 1;
  }
}

onMounted(() => {
  if (helpView.value) {
    helpView.value.init(v.help);
  }
  if (id && id.length == 3 && jsonData.value != null) {
    for (let item of jsonData.value) {
      if (item.id === id) {
        let url = urlImage.image + item.id + item.ext;
        if (imageView.value) {
          console.log("image");
          imageView.value.open(url, 0, "更新于 " + item.date, urlImage.link + item.id);
        }
      }
    }
  }
});
</script>

<template>
  <div class="egg">
    <div class="sort" style="background: rgba(255,255,255,0.1);">
      <div class="sortTag">选择门</div>
      <div class="mainDoor sortButton">
        <div class="autoHide">门的方向</div>
        <div style="display: inline-flex;margin-right: 0.8em;">
          <a href="javascript:void(0)" class="sortTitle select" @click="formData.selectDoor(0)">&#xe65a;</a>
          <a href="javascript:void(0)" class="sortTitle select" @click="formData.selectDoor(180)">&#xe659;</a>
          <a href="javascript:void(0)" class="sortTitle select" @click="formData.selectDoor(90)">&#xe65b;</a>
          <a href="javascript:void(0)" class="sortTitle select" @click="formData.selectDoor(-90)">&#xe65c;</a>
        </div>
        <div class="autoHide">那个门</div>
        <div style="display: inline-flex">
          <input type="checkbox" id="doorSwitch" v-model="formData.imageData.value.doorType" class="gate-toggle-checkbox">
          <switch-button></switch-button>
        </div>
      </div>
    </div>
    <div class="sort" style="background-color: #001E36;" v-if="!formData.imageData.value.doorType">
      <div class="sortTag">正门：根据正门和出口关系</div>
      <div class="mainDoor sortButton">
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==101}" @click="formData.mainEntrance('1up',101)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66f;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==102}" @click="formData.mainEntrance('1left',102)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66e;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==103}" @click="formData.mainEntrance('1right',103)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66d;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==104}" @click="formData.mainEntrance('2horizontal',104)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66c;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==105}" @click="formData.mainEntrance('2left_up',105)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66a;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==106}" @click="formData.mainEntrance('2right_up',106)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe66b;</a>
        <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==107}" @click="formData.mainEntrance('3down',107)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe669;</a>
      </div>
    </div>
    <div class="sort" style="background-color: #333;" v-if="formData.imageData.value.doorType">
      <div class="sortTag">侧门：根据侧门所在空间的形状</div>
      <div>
        <div class="sideDoor sortButton">
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==201}" @click="formData.sideEntrance('square',201)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe681;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==202}" @click="formData.sideEntrance('horizontal',202)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe682;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==203}" @click="formData.sideEntrance('vertical',203)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe683;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==204}" @click="formData.sideEntrance('left_up',204)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe685;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==205}" @click="formData.sideEntrance('left_down',205)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe687;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==206}" @click="formData.sideEntrance('right_up',206)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe684;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==207}" @click="formData.sideEntrance('right_down',207)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe686;</a>
          <a href="javascript:void(0)" class="sortTitle select" :class="{doorSelect:formData.imageData.value.doorSelect==208}" @click="formData.sideEntrance('h_ladder',208)" :style="{ transform:`rotate(${formData.imageData.value.degree}deg)` }">&#xe689;</a>
        </div>
      </div>
    </div>
    <div v-if="formData.imageData.value.show>0">{{ formData.info.value }}</div>
    <div v-for="(group,groupId) of data" v-if="formData.imageData.value.show>0">
      <div class="title" :style="{color:group.color}">{{ groupId + 1 }}. {{ group.group }}</div>
      <ul>
        <li class="itemSelect" v-for="(item,index) of group.item"
            :style="{borderColor:group.color,backgroundImage:`url(${urlImage.thumbnail+item.url}.webp)`,backgroundSize:`200%`,backgroundPosition:`${item.doorStyle} center`,transform:`rotate(${formData.imageData.value.degree}deg)`}"
            @click="formData.imageClick(groupId,index)">
          <span class="path">{{ item.url }}</span>
        </li>
      </ul>
    </div>
    <info v-if="formData.imageData.value.show==99"></info>
    <mapView ref="imageView" @close="formData.imageClose"></mapView>
    <help ref="helpView" v-if="formData.imageData.value.show>=0"></help>
  </div>
</template>

<style>
@import "font.css";

body, #app {
  background-color: #0A1624;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.egg .path {
  display: inline-block;
}

.egg .doorSelect {
  color: white !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.egg .sort {
  margin: 0 0 3px 0;
  color: #f0f0f0;
  text-align: center;
}

.egg .sort .sortButton a {
  display: inline-block; /* 或 inline */
  vertical-align: middle; /* 可选：垂直居中对齐 */
  margin: 0 5px 0 0;
  text-decoration: none;
  font-family: party-0chem, sans-serif;
  width: 55px;
  padding: 0;
  border: none;
}

.egg .sort .mainDoor a {
  font-size: 55px;
  color: #D8ABAB;
}

.egg .sort .sideDoor a {
  font-size: 55px;
  color: #C19A6B;
}

.egg .sortTag {
  font-size: 0.8rem;
  color: #f0f0f0;
  padding: 5px 0 2px 0;
}

.egg .button a {
  margin: 0 10px 0 0;
  border: 1px solid #eee;
  background-color: #0d6bf1;
  color: white;
  padding: 8px 20px;
  text-decoration: none;
  border-radius: 10px;
}

.egg .title {
  color: white;
  text-align: left;
  font-size: 16px;
  padding: 3px;
  display: block;
  background-color: #555;
}

.egg .image {
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.egg .image img {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

.egg ul {
  width: 100%;
  margin: 0;
  padding: 0;

  list-style: none; /* 移除默认列表符号 */
  /* 关键：启用弹性布局并允许换行 */
  display: flex;
  flex-wrap: wrap; /* 允许子元素换行 */
  gap: 2px; /* 列表项之间的间距（可选） */
}

.egg li {
  margin: 0;
  padding: 0;
  width: 250px;
  height: 250px;
  border: 1px solid #aaa;
  background-repeat: no-repeat;
  color: #eee;
  cursor: pointer;
  top: 0;
  transition: transform 0.3s ease, top 0.3s ease;
  position: relative;
  border-radius: 0.5em;
}

.egg .itemSelect:hover {
  top: -0.5em;
  z-index: 99;
}

.egg li span {
  background: rgba(0, 0, 0, 0.5);
  margin: 0.2em 0 0 0.2em;
}

.autoHide {
  display: inline;
}

@media (max-width: 800px) {
  .egg li {
    flex: 0 0 calc((100% - 16px) / 2);
  }
}

@media (max-width: 479px) {
  .egg li {
    flex: 0 0 calc((100% - 5px));
  }

  .autoHide {
    display: none;;
  }
}
</style>