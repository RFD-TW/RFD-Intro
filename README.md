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

用 Anaconda 或隨便什麼鬼給他執行環境，然後執行 run_server.bat 就好了。<br>
之後開 `https://localhost:8000` 就能看到這東西所在的上一層資料夾的網頁。<br>
<br>
想用 HTTP 的話，也是可以寫
```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
```
然後用 PyInstaller 包成執行檔，想要時再執行。

### 背景星空

改編自[上面提過的範例](https://threejs.org/examples/#webgl_points_billboards)。<br>
<br>
把原始程式黏進來，執行後根據報的錯誤，把所有引用到的程式複製到網站目錄。<br>
<br>
參考恆星光譜，並以 HSL 設定顏色，設定以下15種：
* 紅，橙紅，橙，橙黃，黃，藍，深藍
* 紅+白，橙紅+白，橙+白，橙黃+白，黃+白，藍+白，深藍+白
* 白

H = 色相（顏色），S = 飽和（鮮豔），L = 亮度。
* H 根據基底顏色設定，分為7種，加白色8種
* S 固定為1（最大），否則顏色不夠鮮明
* 純色 L = 0.7，+白 L = 0.8

用以上配色做出15種材質，各套用到50個粒子上；白色套用到300個粒子上。<br>

隨距離增加的雲霧顏色、深度改成
> starryScript.js - function init()
```javascript
scene.fog = new THREE.FogExp2( 0x000000, 0.00075 );
```

雖然看不太出差異，渲染打開抗鋸齒、高效能，把色調映射改成順眼的
> starryScript.js - function init()
```javascript
renderer = new THREE.WebGLRenderer( { antialias: true, powerPreference: 'high-performance' } );
// ...
renderer.toneMapping = THREE.ACESFilmicToneMapping;
```

滑鼠移動幅度調成2倍
> starryScript.js - function render()
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

以避免視窗縮放時，無法即時正確的變換 canvas 大小，導致滾動條出現。<br>

做好後把 JS 程式引入 HTML，利用 CSS 固定在背景。<br>
（[固定畫布又不會妨礙滑鼠事件的方法](https://www.educative.io/answers/how-to-add-threejs-as-background-in-html)參考國外的文）

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
> starryScript.js - init()
```javascript
document.body.style.touchAction = 'none';
```

### 掃描線動畫

參考[國外網站的第二篇](https://alvarotrigo.com/blog/css-text-animations/)，讓圖片可以循環式的從左移到右，<br>
並利用 linear-gradient 繪製掃描線圖片。<br>
畫的時候可以參考 [W3School 的教學](https://www.w3schools.com/cssref/func_linear-gradient.php)，順便拿 Try it Yourself 的編輯器實驗。<br>
> indexStyle.css
```css
#IntroDiv, #ArticleDiv
{
    background-image: linear-gradient(
        90deg,
        transparent 12%, 16%, 60%, 64%
        rgba(127, 255, 212, 0.4) 14%, 62%
    );
    background-size: 200% auto;
    animation: ScanClip 16s linear infinite;
}
@keyframes ScanClip
{
    to { background-position: 200% center; }
}
```

### 焦糖瑪奇朵 - 時間

上面的點擊函式用來記錄點進標籤的時間
> indexScript.js
```javascript
$('#AdditionalTab').click(
    function()
    {
        enterMacchiatoTime = moment();
    }
);
```
然後和 window.setInterval(function(){...}, 200) 中，每0.2秒執行一次的程式配合，<br>
moment.diff 計算當前時間 moment() 和兩種時間的差，送進 moment.duration 後轉換成秒數。
> indexScript.js
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

使用 jquery-waves 這個別人做的小工具，第一次點擊擴散橘色，第二次退掉。<br>
改寫[作者給的範例](https://isaeken.github.io/jquery-waves/)，<br>
擴散時在周圍元素加入 indexStyle 中定義的 MacchiatoOn class 以觸發其中的染橘動畫，<br>
退掉後 pop 多餘水波物件、移除 MacchiatoOn class，以免物件堆積、為下次染橘準備。<br>
<br>
最後，計算相對於點擊目標祖先物件的 left, top 位置，把擴散起點挪到那裡。<br>
<br>
[方法有參考 stackoverflow 的討論](https://stackoverflow.com/questions/10964992/determine-the-position-of-an-element-relative-to-a-positioned-ancestor-of-its-of)，雖然沒有被標為正確答案。<br>
至於為什麼要手算，因為我是在好幾層前的祖先物件裡，觸發「以按鈕為起點的水波動畫」的，不是直接點擊祖先物件。<br>
提醒一下，這個函式裡的 "this" 是那個瑪奇朵圖片物件。<br>
> indexScript.js
```javascript
ripple = $('#IntroDiv').ripple(
    $(this).offset().left - $('#IntroDiv').offset().left + $(this).width()/2,
    $(this).offset().top - $('#IntroDiv').offset().top + $(this).height()/2
);
```

### 科幻植物 - 背景

用 CSS 寫循環動畫，賦予背景區塊作為背景。<br>
animation 中，12s 是執行區間，ease 是開始、完成時緩速，infinite 是循環播放。<br>
利用 background-size 跟 background-position 讓圖片等比縮放到蓋住整體，並把顯示位置固定在正中間底部。<br>
> indexStyle.css
```css
.PlantsWatcher
{
	background-color: transparent;
	background-size: cover;
	background-position: center bottom;
	
	animation: CamSwitch 12s ease infinite;
}
@keyframes CamSwitch
{
	0%, 30%, 70%, 100%
	{ background-image: url('../images/SwitchGrid.svg'); }
	5%, 25%
	{ background-image: url('../images/SciFiHerbsSaplingsT-1.png'); }
	35%, 65%
	{ background-image: url('../images/SciFiHerbsSaplingsT-2.png'); }
	75%, 95%
	{ background-image: url('../images/SciFiHerbsSaplingsT-3.png'); }
}
```

圖片使用以下工具生成
* https://www.recraft.ai/

轉場網格利用 SVG 繪製，利用 pattern 跟 rect 結合，<br>
pattern 在 rect 中套用後，會作為紋理重複並延伸到整體大小。<br>
<br>
參考 [stackoverflow 的討論](https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg)<br>
<br>
為了嘗試提高效能，我把 svg 圖做得很小，只有 40x40，似乎有點效果<br>
> smallGrid.svg
```svg
<svg 
  viewBox="0 0 40 40"
  width="40px" height="40px"
  xmlns='http://www.w3.org/2000/svg'>
	
	<defs>
		<pattern id="smallGrid" width="1" height="1" patternUnits="userSpaceOnUse">
			<path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgba(127, 255, 212, 0.4)" stroke-width="0.1"/>
		</pattern>
		<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
			<rect width="10" height="10" fill="url(#smallGrid)"/>
			<path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(102, 204, 255, 0.4)" stroke-width="0.1"/>
		</pattern>
	</defs>

	<rect width="100%" height="100%" fill="url(#grid)" />
	
</svg>
```

### 科幻植物 - 切換
### 科幻植物 - 轉場畫面

## 壓縮

* 圖片
* 程式

## 發佈

* 存放程式
* 自動部署
