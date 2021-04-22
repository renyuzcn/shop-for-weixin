/**
 1 输入框绑定事件  input
    1 获取到输入的值
 * 2 合法性
 * 3 检验通过 把输入款的值 发送到后台
 * 4 返回的数据打印到页面上
 2 防抖(防止抖动)   定时器
    0 防抖  一般是用在输入框  防止重新输入  重复发送请求
    1 节流   一般是用在页面的下拉和上拉等等  
    2 定义全局的定时器 id
 * 
 */
 import { request } from "../../request/index.js";
 import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        goods:[],
        //取消的按钮 是否显示
        isFocus:false,
        //输入框的值
        inpValue:''

    },
    TimeId:-1,
    //输入框的值改变  就会触发的事件
    handleInput(e){
        // console.log(e);
        //获取输入框的值
        const {value}=e.detail;
        if(!value.trim())
        {
            this.setData({
                goods:[],
                isFocus:false
            })
            //值不合法
            return;
        }
        //准备发送请求获取数据(clearTimeout清除定时器id)
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId=setTimeout(() => {
        this.qsearch(value);
        }, 1000);//稳定后几秒
    },
    //发送请求 获取搜索建议 数据
    async qsearch(query){
        const res=await request({url:"/goods/qsearch",data:{query}});
        this.setData({
        goods:res
        })
    },
    handleCancel(){
        this.setData({
            inpValue:'',
            goods:[],
            isFocus:false
        })
    }

  
})