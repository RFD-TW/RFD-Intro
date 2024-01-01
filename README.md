# RFD-Intro

基於保存原始碼供參考的考量，分成 site, source 目錄。<br>
公開到網路的網站在 site，保留的原始碼在 source。<br>

> [!NOTE]
> 如果要看程式的寫法，記得要去 source 目錄看。

## 函式庫

* HTML 排版
    * Bootstrap 5.3.1
        > https://getbootstrap.com/docs/5.3/getting-started/introduction/
* 背景星空
    * Three.js r157
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
在 HTML 中加入 importmap 並引用 JS 程式，利用 importmap 讓 JS 程式可以用 import 語法調用 Three。<br>
執行後根據報的錯誤，把所有引用到的 Three 程式複製到網站目錄。<br>
importmap 放在 head，JS 程式放在 body，不然執行會因為順序不對有錯誤。<br>
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
> 程式在 starryScript.js

隨距離增加的雲霧，顏色、深度改成
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

滑鼠移動幅度調成原來的2倍
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
（固定畫布又不會妨礙滑鼠事件的方法參考[國外的文](https://www.educative.io/answers/how-to-add-threejs-as-background-in-html)）

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

參考[國外網站的第二篇](https://alvarotrigo.com/blog/css-text-animations/)，讓圖片可以循環式的從右移到左，<br>
並利用 linear-gradient 繪製掃描線圖片。<br>
畫的時候可以參考 [W3School 的教學](https://www.w3schools.com/cssref/func_linear-gradient.php)，順便拿 Try it Yourself 的編輯器實驗。<br>
> [!WARNING]
> 如果這麼做會很謎的良心不安，就自己在本地架 server 試，只要摸過 Python 就能用上面的方法了。<br>
> W3School 的 Spaces 不是這個用途，先提醒一聲。<br>
> 不然就從[W3School線上編輯器介紹](https://www.w3schools.com/tryit/default.asp)點進[這裡](https://www.w3schools.com/tryit/tryit.asp?filename=tryhtml_hello)；順帶一提裡面還有[後端編輯器](https://www.w3schools.com/tryit/trycompiler.asp?filename=demo_python)。實驗完記得複製下來。<br>

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
[方法有參考 stackoverflow 的討論](https://stackoverflow.com/questions/10964992/determine-the-position-of-an-element-relative-to-a-positioned-ancestor-of-its-of)，雖然沒有被標為正確答案。<br>
<br>
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
ease（開始、完成時緩速）在這裡比較好看，所以就改成這個。<br>
（瑪奇朵的染橘也是 ease）<br>
利用 background-size 跟 background-position 讓圖片等比縮放到蓋住整體，並把顯示位置固定在正中間底部。<br>
> 程式在 indexStyle.css

圖片使用以下工具生成
* https://www.recraft.ai/

轉場網格利用 SVG 繪製，利用 pattern 跟 rect 結合，<br>
pattern 在 rect 中套用後，會作為紋理重複並延伸到整體大小。<br>
<br>
參考 [stackoverflow 的討論](https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg)<br>
<br>
為了嘗試提高效能，我把 svg 圖做得很小，只有 40x40，似乎有點效果<br>
> 程式在 smallGrid.svg

### 科幻植物 - 切換

在按鈕上加入自訂的 data-state 屬性，通過 jQuery 在每次點擊時切換，讓數值在3種字串間輪替。<br>
畢竟在 JS 中直接定義狀態變數，要單獨定義 class 來加減，還是在目標新增 data-［自己想的名稱］屬性比較直觀。<br>
> 程式在 indexStyle.css 跟 indexScript.js

轉場畫面也是用 SVG，用 fractal noise 的隨機變化模擬電視雜訊。<br>
電視上的雜訊主要是白雜訊 (white / static noise)，網路上也說大多是黑白的，但我記得小時候看到的是彩色的。<br>
所以我就做成彩色的了。<br>

黑白的可以參考這個
* https://css-tricks.com/making-static-noise-from-a-weird-css-gradient-bug/

彩色的可以參考這個
* https://css-tricks.com/grainy-gradients/

參考中國的某篇網站說明，還有 stackoverflow 的討論後，直接利用 animate 把圖片做成持續調整 seed 的動畫。
* https://stackoverflow.com/questions/44242344/generating-images-with-non-repeating-random-patterns
* https://www.zhangxinxu.com/wordpress/2020/10/svg-feturbulence/
> RandomNoise.svg
```svg
<filter id='noiseFilter'>
    <feTurbulence 
        type='fractalNoise' 
        baseFrequency='0.45' 
        numOctaves='3' 
        stitchTiles='stitch'>
        <animate
            attributeName="seed"
            values="0;100;0"
            dur="5s"
            repeatCount="indefinite" />
    </feTurbulence>
</filter>
```

## 壓縮

使用以下工具：
* [TinyPNG](https://tinypng.com/)
* [SVGOMG](https://jakearchibald.github.io/svgomg/)
* [Pixelied](https://pixelied.com/convert/png-converter/png-to-webp)

### 不透明圖片

> [!NOTE]
> .png<br>
> &emsp;-- TinyPng--> .png, min size<br>
> &emsp;-- Pixelied--> .webp, 100% quality<br>
> &emsp;-- TingPng--> .webp, min size

### 透明圖片
> [!NOTE]
> .png -- TinyPng--> .png, min size

### SVG
> [!NOTE]
> .svg -- SVGOMG--> .svg, min size

### 程式

參考[外國的文章](https://nitropack.io/blog/post/minify-resources/)，使用以下工具
* https://www.toptal.com/developers/javascript-minifier

> [!CAUTION]
> CSS 壓縮工具基本上壓縮完程式就壞掉了，所以不要用。<br>
> 然後，HTML 壓縮沒什麼意義，只會降低可讀性。<br>
> 文章推薦的其他 JS 壓縮工具，無法處理利用 importmap 引用 Three.js 函式庫的 starryScript.js。

## 發佈

### 存放程式

嗯...我相信你都在看 Github 了，應該知道我的程式在 Github 上吧。

### 自動部署

用 [Netlify](https://www.netlify.com/) 串 Github 可以在專案維持私人的狀態下部署，還能在更新程式時自動更新網站。<br>
根據過往經驗，沒有主動處理可能不會搜尋得到網站，子網頁 (sitemap) 還可能會出 bug 收錄不到搜尋引擎裡。<br>

## 版權
> 不放感覺怪怪的。

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="創用 CC 授權條款" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />本著作係採用<a rel="license" href="http://creativecommons.org/licenses/by/4.0/">創用 CC 姓名標示 4.0 國際 授權條款</a>授權.
