//同时发送异步代码的次数
let ajaxTiem=0;
export const request=(params)=>{
    //判断  URL中是否带有字符串/my/ 有的话表示请求的是私有的路径  要带上header   token
    let header={...params.header};
    if(params.url.includes("/my/")){
        //拼接一下header  带上token
        header["Authorization"]=wx.getStorageSync("token");
    }

    ajaxTiem++;
    //显示加载中
    wx.showLoading({
        title: '加载中',
        mask:true//蒙版   表示在该期间无法有其他手势操作
      });
    //定义公共的url
   // url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTiem--;
                if(ajaxTiem===0){
                    //关闭正在等待的图标
                    wx.hideLoading();
                }
                
                
            }
        });
          
    })
}