<script setup lang="ts">
import {ref} from "vue";

const helpData = ref<{ title: string; content: Array<{ topic: string, body: Array<{ t: string; v: string }> }> } | null>(null);
defineExpose({
  init: (v: { title: string; content: Array<{ topic: string, body: Array<{ t: string; v: string }> }> }) => {
    helpData.value = v;
  }
});
</script>

<template>
  <div class="help">
    <h1>蛋仔派对 惊魂寻宝队 地图</h1>
    <ul class="wechat">
      <li>
        <div><img src="/wechat1.jpg" alt="蛋仔派对惊魂寻宝队地图 公众号"></div>
        <div>蛋仔派对惊魂寻宝队地图 公众号</div>
      </li>
      <li>
        <div><img src="/wechat2.jpg" alt="蛋仔派对惊魂寻宝队地图 小程序"></div>
        <div>蛋仔派对惊魂寻宝队地图 小程序</div>
      </li>
    </ul>
    <h2>小抄使用说明</h2>
    <template v-if="helpData">
      <h2>{{ helpData.title }}</h2>
      <div class="content">
        <template v-for="content of helpData.content">
          <h3>{{ content.topic }}</h3>
          <template v-for="item of content.body">
            <div v-if="item.t=='text'&&item.v" class="text">{{ item.v }}</div>
            <div v-if="item.t=='style'&&item.v" class="img1" :style="item.v"></div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<style>
@import "font.css";

.egg .help {
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
  color: #EFEFEF;
}

.help .wechat {
  padding: 0;
}

.help .wechat li {
  height: auto;
  width: auto;;
  border: none;
}

.egg .help .content {
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.6em;
  overflow-wrap: normal; /* 不拆分单词 */
  white-space: normal;
  word-break: keep-all; /* 仅在空格/连字符处换行（中文正常换行） */
  width: 100%;
  max-width: 100%;
}

.egg .help h1, .egg .help h2, .egg .help h3, .egg .help h4, .egg .help h5, .egg .help h6 {
  margin: 0;
  padding: 0;
}

.egg .a {
  color: #1FD8FE;
}

.egg .help h1 {
  font-size: 2rem; /*设置文字大小*/
  color: white; /*设置文字颜色*/
  text-shadow: 0 8px 10px #3366FF; /*设置文字阴影*/
  font-weight: bolder; /*设置文字宽度*/
  text-align: center; /*设置文字居中*/
  margin: 40px 0 0 0;
  background: none;
  line-height: 2em;
}

.egg .help h2 {
  font-size: 1.6rem;
  line-height: 2em;
  margin: 0;
  color: #1FD8FE;
}

.egg .help h3 {
  font-size: 1.2rem;
  color: #1FD8FE;
  line-height: 2em;
  margin: 0;
}

.egg .help h6 {
  font-size: 0.8rem;
  line-height: 2em;
  margin: 0;
  font-weight: normal;
}

.egg .help .img1 {
  height: 80px;
  width: 400px;
  //background-image: var(--0chem-party-help);
  margin: 5px 0;
  display: inline-block;
}

.egg .help .text {
  width: 100%;
  white-space: pre-line;
}
</style>