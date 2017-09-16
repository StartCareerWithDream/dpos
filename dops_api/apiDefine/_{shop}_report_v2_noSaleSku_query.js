/**
 * Created by dsj on 2017/7/21.
 */

 //商品销售统计报表
 paiPath = "/{shop}/report/v2/noSaleSku/query";
 method = "POST";

 // Query参数
 request = {
   "start": 0,
   "limit": 0,
   "filters": [
     {
       "property": "date:[,]",  /*精确到天*/
       "value": ['2017-07-20','2017-07-21']
     },
     {
       "property": "tags:in",   /*标签名称包含*/
       "value": []
     },
     {
       "property": "shopSkuKeyword:%=%",  /*商品条码或名称类似于*/
       "value": ""
     }

   ],
   "sorters": [
     {
       "property": "string",
       "direction": "string"
     }
   ]
 }

 response ={
   "data": [
     {
       "shopSku": "string",
       "shopSkuName": "string",
       "shopSkuBarcode": "string",
       "shopSkuTags": "string",
       "invQty": 0,
       "invAmount": 0,
       "lastInPrice": 0,
       "salePrice": 0
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
   "total": {}
 }