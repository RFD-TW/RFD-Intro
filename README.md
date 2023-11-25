# RFD-Intro

基於保存原始碼供參考的考量，分成 site, source 目錄。<br>
公開到網路的網站在 site，保留的原始碼在 source。<br>

## 函式庫

* HTML 排版
    * Bootstrap 5.3.1
        > https://getbootstrap.com/docs/5.3/getting-started/introduction/
* 背景星空
    * Three.js
        > https://threejs.org/examples/#webgl_points_billboards
* 焦糖瑪奇朵 - 時間
    * Moment.js 2.29.4
        > https://momentjs.com/docs/
* 焦糖瑪奇朵 - 水波
    * jQuery-Waves
        > https://github.com/isaeken/jquery-waves
* 其他
    * jQuery 3.7.1（程式）
    * Font Awesome 6.4.2（圖標）

## 技術

### 背景星空

改編自[上面提過的範例](https://threejs.org/examples/#webgl_points_billboards)。

把原始程式黏進來，執行後根據報的錯誤，把所有引用到的程式複製到網站目錄。
測試使用
* https://github.com/halt9k/python-https-server
用 Anaconda 或隨便什麼鬼

參考恆星光譜，並以 HSL 設定顏色，設定以下15種：
* 紅，橙紅，橙，橙黃，黃，藍，深藍
* 紅+白，橙紅+白，橙+白，橙黃+白，黃+白，藍+白，深藍+白
* 白

H = 色相（顏色），S = 飽和（鮮豔），L = 亮度。
* H 根據基底顏色設定，分為7種，加白色8種
* S 固定為1（最大），否則顏色不夠鮮明
* 純色 L = 0.7，+白 L = 0.8

用以上配色做出15種材質，各套用到50個粒子上；白色套用到300個粒子上。

隨距離增加的雲霧顏色、距離改成
> starryScript - function init()
```javascript
scene.fog = new THREE.FogExp2( 0x000000, 0.00075 );
```

雖然看不太出差異，渲染打開抗鋸齒、高效能，把色調映射改成順眼的
> starryScript - function init()
```javascript
renderer = new THREE.WebGLRenderer( { antialias: true, powerPreference: 'high-performance' } );
// ...
renderer.toneMapping = THREE.ACESFilmicToneMapping;
```

滑鼠移動幅度調成2倍
> starryScript - function render()
```javascript
camera.position.x += ( mouseX - camera.position.x ) * 0.1;
camera.position.y += ( - mouseY - camera.position.y ) * 0.1;
```

然後...除此之外，用 jQuery 的
* $(document).height()
* $(document).width()

取代範例的
* window.innerWidth
* window.innerHeight

以避免視窗縮放時，無法即時正確的變換 canvas 大小，導致滾動條出現。

做好後把 JS 程式引入 HTML，利用 CSS 固定在背景
> index.html
```html
<script id="BGScript" src="../starryScript.js" type="module"></script>
```
> indexStyle.css
```css
canvas
{
	position: fixed;
	left: 0;
	top: 0;
	z-index:-1;
}
```

固定後刪掉這行，讓手機版的觸控也可以轉動星空視角。
> starryScript - init()
```javascript
document.body.style.touchAction = 'none';
```

### 焦糖瑪奇朵 - 時間
### 焦糖瑪奇朵 - 水波
### 科幻植物 - 背景
### 科幻植物 - 切換
### 科幻植物 - 轉場畫面

## 壓縮

* 圖片
* 程式

## 發佈

* 存放程式
* 自動部署
