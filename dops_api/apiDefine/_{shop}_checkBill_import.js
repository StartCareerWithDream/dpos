/**
 * Created by dsj on 2017/4/7.
 */

 //导入盘点商品 import 类型，必要返回值：成功导入品相数量 + 新盘点单的UUID
 paiPath = "/{shop}/checkBill/import";
 method = "GET";

 request = null;
    checkId="string";  //外加一个query参数：// 本次上传操作的“唯一ID”
    importId="string"; //前台当前页面生成，防止重复提交用的，uuid()


 response =
   {
     "data": "", //盘点单uuid
     "success": true,
     "message": null,
     "fields": null,
     "total": 0 //导入品相数
   }
