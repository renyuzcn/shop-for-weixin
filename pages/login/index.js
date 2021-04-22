// pages/login/index.js
Page({
    handleGetUseriInfo(e){
        // console.log(e);
        const {userInfo}=e.detail;
        wx.setStorageSync("userinfo", userInfo);
        wx.navigateBack({
            delta: 1
        });
          
          
    }
})