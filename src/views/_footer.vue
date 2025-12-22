<script setup lang="ts">
</script>

<template>
  <footer>
    <div class="copy_right">
    </div>
  </footer>
</template>

<style>
footer {
  color: var(--0chem-web-color-footer);
  padding: 0;
  background: var(--0chem-web-background);
}

footer .copy_right {
  font-size: 12px;
  line-height: 20px;
  padding: 10px 0;
  text-align: center;
}

footer .copy_right a {
  display: inline-flex;
  align-items: center;
  color: var(--0chem-web-color-footer);
  text-decoration: none;
  text-align: center;
  height: 20px;
}

footer .copy_right a:hover {
  color: var(--0chem-web-hover);
}

footer .copy_right img, footer .copy_right span {
  display: inline-flex;
}

.footer {
  background: var(--0chem-web-background);
  padding-top: 10px;
  height: 320px;
}

.footer ul {
  margin: 0 auto;
  padding: 0;
  max-width: var(--0chem-width);
  list-style: none;
}

.footer .left {
  float: left;
}

.footer .left .title {
  color: white;
  font-size: 20px;
  line-height: 2.2em;
  font-weight: bold;
}

.footer .left a {
  color: white;
  line-height: 2.2em;
}

.footer .left a:hover {
  color: var(--0chem-web-hover);
}

.footer .block {
  margin: 5px;
  padding: 8px;
  float: right;
  background: #f2f2f2;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #222;
}

.footer .block div {
  text-align: center;
}
</style>