/*
1.发送请求来获取数据
2.点击轮播图   预览大图
    1.给轮播图绑定点击事件
    2.调用小程序的api   PrevewImage
3.点击加入购物
    1.先绑定点击事件
    2.获取缓存中的购物车数据  数组格式
    3.先判断一下当前的商品是否存在于购物车
    4.已经存在  修改商品数据   执行购物车数量++  重新把购物车数组 填回缓存中
    5.不存在  直接给购物车添加一个新元素  带上购买数量属性   重新把购物车数组 填回缓存中
    6.弹出用户提示
4 商品收藏
    1 页面onshow时，加载缓存中的商品收藏的数据
    2 判断当前商品被收藏
        1 是  改变页面的图标
        2 不是 
    3 点击商品收藏按钮
        1 判断该商品是否存在于缓存数组中
        2 已经存在  把该商品删除掉
        3 没有存在过  把商品添加到收藏数组中   存入到缓存中即可
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:[],
        //商品是否被收藏过
        isCollect:false

    },
    //商品对象
    GoodsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow:function() {
        // options是前一页面传进来的页面参数
        let pages =  getCurrentPages();//当前页面栈
        let currentPage=pages[pages.length-1];
        let options=currentPage.options;
        
        const {goods_id}=options;
        // console.log(goods_id);
        this.getGoodsDetail(goods_id);

        


    },
    //获取商品的详情数据
    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
        this.GoodsInfo=goodsObj;
        //1 获取缓存中的商品收藏的数组
        let collect=wx.getStorageSync("collect")||[];
        //判断当前商品是否收藏     some接收一个回调函数  只要返回一个true 整个表达式就会等于true
        let isCollect=collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                //iphone  部分手机不识别  webp图片格式
                //最好找到后台  让他改!!!!!!!   
                //临时自己改   确保后台存在1.webp  =>1.jpg(goods_introduce点后面的操作)
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics
            },
            isCollect
        })

    },
    // 点击轮播图放大预览
    handlepreviewImage(e){
        // console.log("预览");
        //先构造要预览的图片数组
        const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
        //点击事件触发  接收传递过来的图片url
        const current=e.currentTarget.dataset.url;
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls // 需要预览的图片http链接列表
          })
    },
    //点击加入购物车
    handleCartAdd(){
        // console.log("购物车");
        //1获取缓存中的购物车  数组
        let cart=wx.getStorageSync("cart")||[];
        //2 判断 商品对象是否存在于购物车数组中
        let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        //判断
        if(index===-1){
            //3不存在  第一次添加
            this.GoodsInfo.num=1;
            this.GoodsInfo.checked=true;
            cart.push(this.GoodsInfo);

        }else{
            //4已经存在购物车数据 num++
            cart[index].num++;
        }
        //5把购物车重新添加回缓存中
        wx.setStorageSync('cart', cart);
        //6.弹出提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true,//true  1.5s后才能点击页面  防止用户手抖  疯狂点击按钮  
        });
          
    },
    //点击商品收藏图标
    handleCollect(){
        let isCollect=false;
        //获取缓存中的商品数组收藏数组
        let collect=wx.getStorageSync("collect")||[]
        //判断该商品是否存在于缓存当中
        let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        //当index  != -1表示已经收藏过了
        if(index!==-1){
            //能找到 已经收藏过了  在数组中删除该商品
            collect.splice(index,1);
            isCollect=false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            });
              
              
        }
        else{
            //没有收藏过
            collect.push(this.GoodsInfo);
            isCollect=true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            });
        }
        //把数组存入到缓存中
        wx.setStorageSync("collect", collect);
        //修改data中的属性   isCollect
        this.setData({
            isCollect
        })
          
    }
    
})