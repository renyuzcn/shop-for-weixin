/*
1 获取用户的收货地址
    1 绑定点击事件
    2 电调用小程序内置 api  获取收货地址  wx.chooseAddress(得走下面2)

    2获取用户 对小程序 所授予  获取地址的 权限 状态  scope
        1 假设用户 点击获取收货地址的提示框   确定   authSetting scope.address
             scop 值  true   直接调用 获取收货地址
        2 假设用户 从来没有调用过 收货地址的api
             scop  值  undefined   直接调用 获取收货地址
        3 用户 点击获取地址的提示框  取消   
             scop 值  false
             1 诱导用户 自己打开授权设置页面(wx.openSetting)  当前用户重新给与  获取地址的时候
             2 获取收货地址
        4 把获取到的收货地址 存入到 本地存储中
2 页面加载完毕
    0 onLoad  onShow
    1 获取本地存储中的地址数据
    2 把数据 设置给data中的一个变量
3 onShow
    0 回到了商品详情页面 第一次添加商品的时候  手动添加了属性
        1 num=1
        2 checked=ture;
    1 获取本地存储中的的地址数据
    2 把购物车数据 填充到data中
4 全选的实现  数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据来进行计算   所有的商品被选中 checked=true  全选被选中
5 总价格和总数量
    1 都需要商品被选中  我们才拿他来计算
    2 获取购物车数组
    3 遍历
    4 判断商品是否被选中
    5 总价格+=商品的单价*商品的数量
    5 总数量+=商品的数量
    6 把计算后的价格和数量都设置回data中即可
6 商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 重新填充回data中和缓存中
    5 重新计算全选。 总价格总数量。。
7 全选和反选
    1 全选复选框绑定事件 change
    2 获取 data中的全选变量 allChecked
    3 直接取反 ！allChecked
    4 遍历购物车数组  让里面的商品选中状态 跟随着 allChecked改变而改变
    5 把购物车数组 和 allChecked 重新设置回data中  把购物重新设置回缓存中
8 商品数量的编辑功能
    1 "-""+"按钮绑定同一个点击事件   区分关键   自定义属性
         1 "+"  "+1"
         2 "-"  "-1"
    2 传递被点击的商品id    goods_id
    3 获取到data中的购物车数组   来获取需要被修改的商品对象
    4 当购物车数量 =1 同时 用户点击"-""
       弹窗询问用户是否删除    弹窗  api：wx.showModal
       1确定 执行删除
       2取消 什么都不做   
    4 直接修改商品对象的数量  num
    5 把购物车数组  重新设置回缓存中  和data中    this.setCart
9 点击结算
    1 判断有没有收获地址
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面
*/
import { getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"; 
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
    data:{
        address:[],
        cart:[],
        allChecked:false,
        totalPrice:0,
        totalNum:0
    },
    onShow(){
        //获取缓存中的收货地址信息
        const address=wx.getStorageSync("address")
        //获取缓存中的购物车数据
        const cart=wx.getStorageSync("cart")||[];
        //         //计算全选
        // //ever 数组方法  会遍历  会接收一个回调函数  那么每一个回调函数都返回true ，那么ever方法的返回值为true
        // //只要有一个回调函数返回了false  那么不再循环执行 ，直接返回false
        // //空数组 调用 every方法 返回值就是true
        // // const allChecked=cart.length?cart.every(v=>v.checked):false;
        // let allChecked=true;
        // //总价格  总数量
        // let totalPrice=0;
        // let totalNum=0;
        // cart.forEach(v=>{
        //     if(v.checked){
        //         totalPrice+=v.num*v.goods_price;
        //         totalNum+=v.num;
        //     }
        //     else{
        //         allChecked=false;
        //     }
        // })
        // //判断数组是否为空
        // allChecked=cart.length!=0?allChecked:false;
        // //给data赋值
        // this.setData({
        //     address,
        //     cart,
        //     allChecked,
        //     totalPrice,
        //     totalNum
        // })
        this.setData({
            address
        });
        this.setCart(cart);
    },
    async handleChangeAddress(){
        // console.log("干一行  行一行  一行行  行行行");
        //2 获取收货地址
        // wx.chooseAddress({
        //     success: (result) => {
        //         console.log(result);
        //     }
        // });
        // wx.getSetting({
        //     success: (result) => {
        //         console.log(result);
                
        //     },
        //     fail: () => {},
        //     complete: () => {}
        // });
        /*
        //获取权限状态(/*内都为未优化的操作)
        wx.getSetting({
            success: (result) => {
                //获取权限状态   只要发现一些属性名很怪异的时候  都要使用  []形式来获取属性值
                const scopeAddress=result.authSetting["scope.address"];
                if(scopeAddress===true||scopeAddress===undefined){
                    wx.chooseAddress({
                        success: (result1) => {
                            console.log(result1);
                        }
                    });
                      
                }else{
                    //用户  以前 拒绝过授予权限  先诱导用户打开授权页面
                    wx.openSetting({
                        success: (result2) => {
                            //可以调用  获取收货地址代码
                            wx.chooseAddress({
                                success: (result3) => {
                                    console.log(result3);
                                }
                            });
                        }
                    });
                      
                }
            },
            fail: () => {},
            complete: () => {}
        });*/
        try {//正确的
              //1 获取 权限状态的
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            //判断 权限状态
            if (scopeAddress === false || scopeAddress === undefined) {
                await openSetting();
            }
            let address= await chooseAddress();
            address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
            //存入到缓存中
            wx.setStorageSync("address", address);
              
        }
         catch (error) {
            console.log(error);
        }
    },
    //商品的选中
    async handleItemChange(e){
        //获取被修改的商品id
        const goods_id=e.currentTarget.dataset.id;
        //获取购物车数组
        let {cart}=this.data;
        //找到被修改的商品对象
        let index=cart.findIndex(v=>v.goods_id===goods_id);
        //选中 状态取反
        cart[index].checked=!cart[index].checked
        this.setCart(cart);
        
    },


    //设置购物车状态同时 重新计算 底部工具栏的数据  全选 总价格 购买的数量
    setCart(cart){
        let allChecked=true;
        //总价格  总数量
        let totalPrice=0;
        let totalNum=0;
        cart.forEach(v=>{
            if(v.checked){
                totalPrice+=v.num*v.goods_price;
                totalNum+=v.num;
            }
            else{
                allChecked=false;
            }
        })
        //判断数组是否为空
        allChecked=cart.length!=0?allChecked:false;
        this.setData({
            cart,
            totalNum,
            totalPrice,
            allChecked
        });
        wx.setStorageSync("cart",cart);
    },


    //商品的全选功能
    handleItemAllChange(){
        //获取data中的数据
        let {cart,allChecked}=this.data;
        //修改值
        allChecked=!allChecked;
        //循环修改cart中的数组
        cart.forEach(v=>{v.checked=allChecked});
        //修改后的值 填充回data中，或者缓存中
        this.setCart(cart);
    },


    //商品数量的编辑功能
    //获取传递过来的参数  
    async handleItemNumEdit(e){
        const {operation,id}=e.currentTarget.dataset;
        //获取购物车数组
        let {cart}=this.data;
        //找到需要修改的商品的索引
        const index=cart.findIndex(v=>v.goods_id===id);
        //判断是否要执行删除
        if(cart[index].num===1&&operation===-1)
        {
            //弹窗提示
            // wx.showModal({
            //     title: '提示',
            //     content: '您是否要删除',
            //     success: (res)=> {
            //       if (res.confirm) {
            //           cart.splice(index,1);
            //           this.setCart(cart);
            //       } else if (res.cancel) {
            //         console.log('用户点击取消')
            //       }
            //     }
            //   })


            //弹窗提示
            const res=await showModal({content:"您是否要删除"});
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
          
        }  else {
            //修改数量
            cart[index].num += operation;
            //设置回缓存和data中
            this.setCart(cart);
        
        }

    },


    //点击  结算
    async handlePay(){
        //判断收货地址
        const {address,totalNum}=this.data;
        if(!address.userName){
         await showToast({title:"您还没有选着收货地址"})
            return;
        }
        //判断用户有没有选购商品的
        if(totalNum===0){
         await showToast({title:"您还没有选购商品"})
            return;
        }
        //跳转到  支付页页面
        wx.navigateTo({
            url: '/pages/pay/index',
        });
          
    }

})