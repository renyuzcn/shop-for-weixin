import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        //左侧的菜单数据
        leftMenuList:[],
        //右侧的商品数据
        rightContent:[],
        //被点击左侧的菜单
        currentIndex:0,
        //右侧内容滚动条距离顶部的距离
        scrollTop:0

    },
    //接口的返回数据
    Cates:[],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /*
        0.web中的本地储存 和小程序中的本地储存的区别
            1.写代码的方式不一样了
            web：localStorage.setItem("key","value")    localStorage.getItem("key")
            小程序中：wx.setStorageSync('key', value); wx.getStorageSync('key');
            2.储存的时候，有没有做过类型转换
                web：不管存入的是什么类型的数据，最终都会先调试一下  tostring(),把数据变成字符串再存入进去
                小程序:不存在  类型转换这个操作  存什么类型的数据进去，获取的时候就是什么类型
        1.先判断一下本地存储中有没有旧数据
        {time:Date.now(),data:[...]}
        2.没有旧数据  直接发送请求
        3.有旧数据  同时 旧的数据也没有过期 就使用 本都存储中的旧数据即可
        */
       //获取本地存储中的数据(小程序中也是存在本地存储技术)
       const Cates =wx.getStorageSync("cates");
       //判断
       if(!Cates){
           //不存在   发送请求获取数据
        this.getCates();
       }else{
           //有旧的数据 定义过期时间  10s*  改成5分钟
            if(Date.now() - Cates.time>1000*10){
                //重新发送请求
                this.getCates();

            }else{
                //可以使用旧数据
                this.Cates=Cates.data;
                 //构造左侧的大菜单数据
            let leftMenuList=this.Cates.map(v=>v.cat_name);
            //构造右侧的
            let rightContent=this.Cates[0].children;
            this.setData({
                leftMenuList,
                rightContent
            })
            }

       }
        
        

    },
    //获取分类数据
    async getCates(){
        // request({url:"/categories"})
        // .then(res=>{
        //     this.Cates=res.data.message;

        //     //接口的数据存入到本地
        //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})

        //     //构造左侧的大菜单数据
        //     let leftMenuList=this.Cates.map(v=>v.cat_name);
        //     //构造右侧的
        //     let rightContent=this.Cates[0].children;
        //     this.setData({
        //         leftMenuList,
        //         rightContent
        //     })
            
        // })


        //1使用es7的async   await发送请求
        const res=await request({url:"/categories"});
        // this.Cates = res.data.message;
        this.Cates=res;
        //接口的数据存入到本地
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    //左侧菜单点击时间
    handleItemTap(e){
        /*
        1.获取被点击事件的标题身上的索引
        2.给data中currentIndex的数据赋值 
        3.根据不同的索引来渲染右侧的商品
        */
        const {index}=e.currentTarget.dataset;
        let rightContent=this.Cates[index].children;
            this.setData({
                currentIndex:index,
                rightContent,
                //重新设置  右侧内容scroll-view标签的距离顶部的距离
                scrollTop:0
            })
        
    }

})