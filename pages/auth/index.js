// pages/auth/index.js
import { login } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

    //获取用户信息
    async handleGetUserInfo(e){
        try {
            // console.log(e);
            //1 获取用户信息
            const { encryptedData, rawData, iv, signature } = e.detail;
            //获取小程序登录成功后的值code
            const { code } = await login();
            const loginParams = { encryptedData, rawData, iv, signature, code };
            // console.log(code);
            //发送请求  获取用户的token值
            //  let {token}="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
            // console.log(res);
            //把token存入到缓存中  ，同时跳转到回上一个页面
            wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
            wx.navigateBack({
                // delta: 1表示返回上一层  2 表示上两层
                delta: 1
            });
        } catch (error) {
            console.log(error);
        }
      
    }
})