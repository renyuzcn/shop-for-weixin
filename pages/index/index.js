//0 引入 用来发送请求的 方法   一定要把路径补全
import { request } from "../../request/index.js";
Page({
  
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catasList:[],
    //楼层 数组
    floorList:[]
    
  },
  //页面开始加载的时候 就会触发的生命周期时间
  onLoad: function(options){
    //1.发送异步请求获取轮播图数据
    //优化的手段可以通过es6的promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
        
    //   },
    // });
    this.getSwiperList();
    this.getCatasList();
    this.getFloorList();
  },
  //获取轮播图数据的代码
  getSwiperList(){
    request({ url:"/home/swiperdata"})
    .then(result=>{
          result.forEach((v,i)=>{
            result[i].navigator_url=v.navigator_url.replace('main','index');
          });
          this.setData({
          swiperList:result
        })
    })
  },
  //获取导航栏数据代码
  getCatasList(){
    request({ url:"/home/catitems"})
    .then(result=>{
          this.setData({
            catasList:result
        })
    })
  },
    //获取楼层数据代码
    getFloorList(){
      request({ url:"/home/floordata"})
      .then(result=>{
        for(let k=0;k<result.length;k++)
        {
          result[k].product_list.forEach((v,i)=>{
            result[k].product_list[i].navigator_url=v.navigator_url.replace('?','/index?');
          })
        }
            this.setData({
              floorList:result
          })
      })
    }
});
