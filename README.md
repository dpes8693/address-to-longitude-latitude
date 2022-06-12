# address-to-longitude-latitude
將地址轉換經緯度 (透過 node.js 爬 google map)

⚠️需要安裝node.js⚠️ [下載網址](https://nodejs.org/zh-tw/download/)

可以理解成在電腦本機執行JavaScript的環境所需要的軟體


## 如何使用?
0. 安裝Nodejs環境
1. 下載依賴套件 
    在終端機(cmd)移動到下載的資料夾，安裝指令: `npm install`
2. 在終端機執行程式，執行指令: `node 需要執行的檔案名稱`

共有兩個檔案，建議直接執行一次知道轉換資料的格式

### index.js

執行指令`node index.js`

```js
// 轉換範例1
'台北市士林區中山北路六段197號'
⬇️
{
  coordinates: [ '25.107927', '121.525071' ], 
  addressName: '台北市士林區中山北路六段197號'
}
```
```js
// 轉換範例2
[
  "台北市士林區中山北路六段197號",
  "台北市中山區中山北路三段22號",
  "台北市大安區敦化南路二段69號",
]
⬇️
[
  {
    coordinates: [ '25.107927', '121.525071' ], 
    addressName: '台北市士林區中山北路六段197號'
  },
  {
    coordinates: [ '25.064556', '121.521755' ], 
    addressName: '台北市中山區中山北路三段22號' 
  },
  {
    coordinates: [ '25.030675', '121.549010' ],
    addressName: '台北市大安區敦化南路二段69號'
  }
]
```

### saver.js

執行指令 `node saver.js`

```json

[{"coordinates":["25.107927","121.525071"],"addressName":"台北市士林區中山北路六段197號"},{"coordinates":["25.064556","121.521755"],"addressName":"台北市中山區中山北路三段22號"},{"coordinates":["25.030675","121.549010"],"addressName":"台北市大安區敦化南路二段69號"}]

```