const axios = require("axios"); //方便打API套件
const cheerio = require("cheerio"); //俗稱後端的jQuery，方便抓取html元素
// 爬蟲用 header
let headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
};

// ======================== 範例1
// 示範 "我是地址" => {經緯度,地址}
const getSingleData = async (addressName) => {
  return await addressToLongLan(addressName);
};

getSingleData("台北市士林區中山北路六段197號").then((newData) => {
  console.log(newData);
});

/** 結果1
C:\Users\hyo > node .\index.js
0
已獲取圖片網址: https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&output=thumbnail&thumb=2&panoid=4vwzU1vf9ScZ9cPTEqqifQ&w=256&h=256&yaw=319&pitch=0&thumbfov=75&ll=25.107927,121.525071 

{
  index: 0,
  addressName: '台北市士林區中山北路六段197號',
  coordinates: [ '25.107927', '121.525071' ]
}
*/

// ======================== 範例2
// 示範 [地址1,地址2,地址3]  =>  [{經緯度1,地址1},{經緯度2,地址2},{經緯度3,地址3}]

const myData = [
  "台北市士林區中山北路六段197號",
  "台北市中山區中山北路三段22號",
  "台北市大安區敦化南路二段69號",
];
const getData = async (addressArray) => {
  let counter = 0;
  try {
    return Promise.all(
      addressArray.map((item, index) => {
        counter++;
        return addressToLongLan(item, index);
      })
    );
  } catch (err) {
    console.log(arr);
    return { counter };
  }
};
getData(myData).then((newData) => {
  console.log(newData);
});

/** 結果2
C:\Users\hyo > node .\index.js
0
已獲取圖片網址: https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&output=thumbnail&thumb=2&panoid=4vwzU1vf9ScZ9cPTEqqifQ&w=256&h=256&yaw=319&pitch=0&thumbfov=75&ll=25.107927,121.525071

1
已獲取圖片網址: https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&output=thumbnail&thumb=2&panoid=QadtDg60Yv4p6YghGkBKWQ&w=256&h=256&yaw=235&pitch=0&thumbfov=75&ll=25.064556,121.521755

2
已獲取圖片網址: https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&output=thumbnail&thumb=2&panoid=G3hyLvkx9m6aeCkTJN06Tg&w=256&h=256&yaw=96&pitch=0&thumbfov=75&ll=25.030675,121.549010

[  
  {
    index: 0,
    addressName: '台北市士林區中山北路六段197號',
    coordinates: [ '25.107927', '121.525071' ]
  },
  {
    index: 1,
    addressName: '台北市中山區中山北路三段22號',
    coordinates: [ '25.064556', '121.521755' ]
  },
  {
    index: 2,
    addressName: '台北市大安區敦化南路二段69號',
    coordinates: [ '25.030675', '121.549010' ]
  }
]
 */

// 主程式
async function addressToLongLan(addressName, index = 0) {
  const html = await getGoogleMapHTML(addressName);
  console.log(index);
  const coordinates = getCoordinates(index, html, addressName);
  return coordinates;
}

// 爬蟲
async function getGoogleMapHTML(addressName) {
  // 排除不是"號"結尾的狀況
  const charAt = addressName.lastIndexOf("號");
  if (charAt > -1) addressName = addressName.substring(0, charAt + 1);

  let url = `https://www.google.com/maps/place/${encodeURI(addressName)}`;
  const res = await axios.get(url, {
    headers,
    params: {
      limit: 30,
      skip: 0,
      first: 0,
      order: "hot",
    },
  });
  const html = res.data;
  return html;
}

// 資料處理
function getCoordinates(index, html, addressName) {
  const $ = cheerio.load(html);
  // 爬蟲抓到圖片(裡面有經緯度)
  const mapImg = $('meta[property="og:image"]').attr("content");

  // 判斷http
  const ok = mapImg.indexOf("http") > -1 ? mapImg : "https:" + mapImg;
  console.log("已獲取圖片網址:", ok, "\n");
  const googleMapURL = new URL(ok);
  let flag =
    googleMapURL.searchParams.get("ll") ||
    googleMapURL.searchParams.get("center") ||
    "無法取得";
  const coordinates = flag.split(",");
  return { index, addressName, coordinates };
}
