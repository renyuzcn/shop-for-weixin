/**
 * 1  点击"+""触发tap点击事件
 *  1调用小程序内置的 选择图片的api  wx-choosImage
 * 2 获取到图片的路径  数组
 * 3 把图片路径 存到 data中
 * 4 页面就可以根据 图片数组 进行循环显示 自定义组件
 *2 点击自定义图片 组件
    1获取被点击的元素索引
    2 获取data中的图片的数组
    3 根据索引  数组中删除对于的元素
    4 把数组重新设置回data中
 *3  点击""提交"
    1 获取文本域的内容  类似  输入框的获取
        1 data中定义变量  表示 输入框的内容
        2 文本域绑定 输入事件（bindinput） 事件触发时  把输入框的值存入到变量中
    2 对这些内容进行合法性验证
    3 通过验证  用户选着的图片 上传到专门的图片的服务器  返回图片外网的链接
        1遍历数组
        2挨个上传
        3自己再来维护数组图片  存放  图片上传到外网的链接
    4 文本域 和 外网的图片的路径  一起提交到服务器 前段的模拟  不会发送请求到后台
    5 清空当前页面
    6返回上一页

 * 
 */
Page({

    
    data: {
        tabs:[
            {
                id:0,
                value:"体验问题",
                isActive:true

            },
            {
                id:1,
                value:"商品、商家投诉",
                isActive:false

            },
        ],
        //被选中的图片路径
        chooseImg:[],
        // 文本域的值
        valueText:""
    },
    //外网图片的路径数组
    UpLoadImgs:[],
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
    //点击""+"选择图片
    handleAddImg(){
        //调用选择图片api
        wx.chooseImage({
            //表示最多x=9张图片
            count: 9,
            //所选的图片的尺寸
            sizeType: ['original', 'compressed'],
            // 选择图片的来源
            sourceType: ['album', 'camera'],
            success: (result) => {
                // console.log(result);
                this.setData({
                    chooseImg:[...this.data.chooseImg,...result.tempFilePaths]
                })
            }
        });
          
    },
    handleDeleImg(e){
        // 1获取被点击的元素索引
        const {index}=e.currentTarget.dataset;
        //获取data中的图片的数组
        let {chooseImg}=this.data;
        // console.log(index);
        // 根据索引  数组中删除对于的元素  splice()
        chooseImg.splice(index,1);
        // 把数组重新设置回data中
        this.setData({
            chooseImg
        })
    },
    //文本的输入事件
    handleTextInput(e){
       this.setData({
        valueText:e.detail.value
       })
    },
    //提交按钮
    handleSubmit(){
        const {valueText,chooseImg}=this.data;
        
        // console.log(valueText);
        if(!valueText.trim())
        {
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
              return;
        }
        //准备上传图片  到专门的图片服务器
        // 上传文件的api 不支持 多个文件一起上传所以需要遍历数组挨个上传
        //显示正在上传等待的图片
        wx.showLoading({
            title: "正在上传中",
            mask: true,
        });
          //判断没有需要上传的图片数组
          if(chooseImg.length!=0)
          {
              //遍历数组
              chooseImg.forEach((v, i) => {
                  wx.uploadFile({
                      //要上传到哪里
                      url: 'https://imgurl.org', 
                      //上传的路径
                      filePath: v,
                      //上传的文件名称， 后台来获取文件   （自定义）的File
                      name: "file",
                      //顺带的文本信息
                      formData: {},
                      success: (result) => {
                          
        
                        /*   3自己再来维护数组图片  存放  图片上传到外网的链接
                        console.log(result);
                           let url = JSON.parse('result.data').url;
                           this.UpLoadImgs.push(url);*/
                          //  console.log(this.UpLoadImgs);
                          // 所有的图片都上传完毕了才触发
                          if (i === chooseImg.length - 1) {
                              // 上传成功 关闭弹窗
                              wx.hideLoading();
                              console.log("把文本的内容和外网的图片数组  提交到后台中");
                              // 提交都成功了
                              // 重置页面
                              this.setData({
                                  chooseImg: [],
                                  valueText: ""
                              })
                              //返回上一个页面
                              wx.navigateBack({
                                  delta: 1
                              });
                          }
                      }
                  });
              })
          }
          else{
              wx.hideLoading();
              console.log("只是提交了文本");
              wx.navigateBack({
                  delta: 1
              });
                
          }

        
    }
    
})