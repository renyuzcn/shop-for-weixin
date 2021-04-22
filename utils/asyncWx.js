// promise   形式的  getsetting
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          

    })
}
// promise   形式的  chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          

    })
}
// promise   形式的  openSetting
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
          

    })
}
// promise   形式的  showModal
// @param {object} param   参数是一个对象
export const showModal=(content)=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: '您是否要删除',
            success: (res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })
        return;
    })
}
// promise   形式的  showToast
// @param {object} param   参数是一个对象
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title:title,
            icon: 'none',
            success: (res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })
        return;
    })
}
/**
 * 
// promise   形式的 wx- login

 
 */
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
             timeout:10000,
            success: (res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}
/**
promise   形式的 wx- requestPayment
 * 
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
       wx.requestPayment({
           ...pay,
           success: (result) => {
               resolve(result)
           },
           fail: (error) => {
               reject(err)
           },
       });
         
    })
}