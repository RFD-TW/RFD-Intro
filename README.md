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

### 測試

* https://github.com/halt9k/python-https-server
用 Anaconda 或隨便什麼鬼給他執行環境，然後執行 run_server.bat 就好了。
之後開 https://localhost:8000 就能看到這東西所在的上一層資料夾的網頁。

至於為什麼不簡單的用 http server...我爽。咬我啊。ㄌㄩㄝˋ。
也是可以寫
```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
```
然後用 PyInstaller 包成執行檔，想要時再執行。

### 背景星空

改編自[上面提過的範例](https://threejs.org/examples/#webgl_points_billboards)。

把原始程式黏進來，執行後根據報的錯誤，把所有引用到的程式複製到網站目錄。

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

上面的點擊函式用來記錄點進標籤的時間
```javascript
$('#AdditionalTab').click(
    function()
    {
        enterMacchiatoTime = moment();
    }
);
```
然後和 window.setInterval(function(){...}, 200) 中，每0.2秒執行一次的程式配合，
moment.diff 計算當前時間 moment() 和兩種時間的差，送進 moment.duration 後轉換成秒數。
```javascript
totalSec = moment
    .duration(
        moment().diff(moment(enterTime))
    ).asSeconds();
macchiatoSec = moment
    .duration(
        moment().diff(moment(enterMacchiatoTime))
    ).asSeconds();
```

### 焦糖瑪奇朵 - 水波

使用 jquery-waves 這個別人做的小工具，第一次點擊擴散橘色，第二次退掉。
改寫[作者給的範例](https://isaeken.github.io/jquery-waves/)，
擴散時在周圍元素加入 indexStyle 中定義的 MacchiatoOn class 以觸發其中的染橘動畫，
退掉後 pop 多餘水波物件、移除 MacchiatoOn class，以免物件堆積、為下次染橘準備。

最後，計算相對於點擊目標父物件的 left, top 位置，把擴散起點挪到那裡。
```javascript
ripple = $('#IntroDiv').ripple(
    $(this).offset().left - $('#IntroDiv').offset().left + $(this).width()/2,
    $(this).offset().top - $('#IntroDiv').offset().top + $(this).height()/2
);
```

### 科幻植物 - 背景
### 科幻植物 - 切換
### 科幻植物 - 轉場畫面

## 壓縮

* 圖片
* 程式

## 發佈

* 存放程式
* 自動部署
