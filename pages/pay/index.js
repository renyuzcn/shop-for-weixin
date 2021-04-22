/*
1 页面加载的时候
    1 从缓存中获取购物车数据  渲染到页面中
        这些数据  checked=true
2 微信支付  
    1 哪些人 哪些账号  可以实现微信支付
    2 企业账号
    2 企业账号的小程序后台中  必须给 开发者  添加上白名单
        1个appid  可以绑定多个开发者
        2 这些开发者就可以共用这个 appid  和他的开发权限
3 支付按钮
    1 先判断缓存中有没有token
    2 没有 跳转到 授权页面
    3 有token..
    4 创建订单  获取订单编号
    5 已经完成微信支付了
    6 收到删除缓存中 已经被选中的了的商品
    7 重新把删除后的购物车数据 填充回缓存
    8 再跳转页面

 */
import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWx.js"; 
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data:{
        address:[],
        cart:[],
        totalPrice:0,
        totalNum:0
    },
    onShow(){
        //获取缓存中的收货地址信息
        const address=wx.getStorageSync("address")
        //获取缓存中的购物车数据
        let cart=wx.getStorageSync("cart")||[];
        //过滤后的购物车
        cart=cart.filter(v=>v.checked);
        this.setData({
            address
        });
        //总价格  总数量
        let totalPrice=0;
        let totalNum=0;
        cart.forEach(v=>{
            totalPrice+=v.num*v.goods_price;
            totalNum+=v.num;
          
        })
        //判断数组是否为空
        this.setData({
            cart,
            totalNum,
            totalPrice,
            address
        });
    },
    //点击支付的功能
    async handleOrderPay()
    {
        try {
            //判断缓存中有没有token
        const token=wx.getStorageSync("token");
        //判断
        if(!token)
        {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return;
        }
        //3创建订单
        //3.1 准备  请求头参数
        // const header={Authorization:token}
        //3.2 准备请求体参数
        const order_price=this.data.totalPrice;
        const consignee_addr=this.data.address.all;
        const cart=this.data.cart;
        let goods=[];
        cart.forEach(v=>goods.push({
            goods_id:v.goods_id,
            goods_number:v.num,
            goods_price:v.goods_price
        }))
        const orderParams={order_price,consignee_addr,goods}
        //4 准备发送请求  创建订单  来获取订单编号          请求方式 post
        //order_number   为返回参数(接口内的)
        const {order_number}=await request({url:"/my/orders/create",method:"post",data:orderParams});
        // console.log(order_number);
        //准备 发起预支付的接口
        const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"post",data:order_number});
        // console.log(res);
        //直接发起微信支付
        await wx.requestPayment(pay);
        // console.log(res);
        //查询后台  订单状态
        const res=await request({url:"/my/orders/chkOrder",method:"post",data:order_number});
        // console.log(res);
        await showToast({title:"支付成功"})
        //要手动删除已经支付了的商品
        let newcart=wx.getStorageSync("cart");
        newcart=newcart.filter(v=!v.checked);
        wx.setStorageSync("cart", newcart);
          
        //支付成功  跳转到订单页面
        wx.navigateTo({
            url: '/pages/order/index'
        });
        }
        catch (error) {
            await showToast({title:"支付失败"})
            console.log(error);
        }
    }
})



  