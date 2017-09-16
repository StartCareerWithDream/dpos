/**
 * Created by dsj on 2017/4/7.
 */

 //获得盘点商品列表 query类型，过滤条件为“状态”，无排序条件，如能附带”不可识别“、”可识别“的总数量更好
 paiPath = "/{shop}/checkBill/import/preview";
 method = "POST";

 request =
 {
   "start": 0,
   "limit": 20,
   "filters": [
     {
       "property": "state:=",
       "value": ""      /*"normal"(可识别的)/"undefined"(不可识别的), state不传查询全部*/
     }
   ]
 }
    checkId="string";  //外加一个query参数：// 本次上传操作的“唯一ID”

 response =
 {
   "data": [
     {
       "lineNo": 0,
       "shopSkuId": "string",
       "shopSkuBarcode": "string",  /*商品条码*/
       "shopSkuName": "string", /*商品名称*/
       "qty": 0, // 商品数量，即导入的盘点数目
       "invQty": 0, // 当前库存数量
       "profitQty": 0 // 导入与当前库存数差
     }
   ],
   "success": true,
   "message": [
     "string"
   ],
   "fields": [
     {
       "key": "string"
     }
   ],
   "total": {
     "normalCount": 10, // 可识别总条数
     "undefinedCount": 0 // 不可识别总条数
   }
 }