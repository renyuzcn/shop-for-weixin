// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        tabs:[
            {
                id:0,
                value:"综合",
                isActive:true

            },
            {
                id:1,
                value:"销量",
                isActive:false

            },
            {
                id:2,
                value:"价格",
                isActive:false

            },
        ],
        goodsList:[]
    },
    //接口要的参数
    QueryParams:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10

    },
    totalPages:1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //  console.log(options);
        this.QueryParams.cid=options.cid||"";
        this.QueryParams.query=options.query||"";
        this.getGoodsList();

        
        
    },
    
    //获取商品列表数据
    async getGoodsList(){
        const res=await request({url:"/goods/search",data:this.QueryParams});
        //获取总条数
        const total=res.total;
        //计算总页数
        this.totalPages=Math.ceil(res.total/this.QueryParams.pagesize)
        // console.log(res);
        this.setData({
            //拼接的数组
            goodsList:[...this.data.goodsList,...res.goods]
        })
        //关闭下拉刷新的窗口   如果没有调用下拉刷新的窗口  直接关闭也不会报错
        wx.stopPullDownRefresh();
          
    },

    //标题的点击事件
    handleTabsItemChange(e){
        // console.log(e);
        //获取被点击的标题索引
        const {index}=e.detail;
        //2.修改源原数组
        let {tabs}=this.data;
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
        //赋值到data中
        this.setData({
            tabs
        })
    },
    //页面上滑   滚动条触底事件
    onReachBottom(){
        // console.log("页面触底");
        if(this.QueryParams.pagenum>=this.totalPages){
            // console.log("没有下一页数据");
            wx.showToast({ title: '没有下一页数据了'});
              

        }else{
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    //下拉刷新事件
    onPullDownRefresh(){

        // console.log("刷新");
        //重置数组
        this.setData({
            goodsList:[]
        })
        //重置页码
        this.QueryParams.pagenum=1;
        //发送请求
        this.getGoodsList();
    }
})