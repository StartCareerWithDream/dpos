/**
 * Created by dsj on 2017/5/17.
 */

 //接口说明 库存调整记录查询
 paiPath = "/{shop}/inv/adjustment/query";
 method = "POST";

 request =
 {
   "start": 0,
   "limit": 0,
   "filters": [  // 支持的条件—sku:%=%, tag:=, user:%=%, date:[,]
     {
       "property": "tag:=",
       "value": "五金"
     },
     {
       "property": "user:%=%",
       "value": "常山"
     },
     {
       "property": "date:[,]",
       "value": ["2017-05-10 00:00:00", "2017-05-16 00:00:00"]  // 支持yyyy-mm-dd 和 yyyy-mm-dd hh24:mi:ss 格式
     }
   ]
 }


response =
{
  "data": [
    {
      "id": "59658f4f-5ab5-4ac6-9ae5-082d21ca2477",
      "version": 0,
      "created": "2017-05-16 11:01:17",  // 调整时间
      "creator": {
        "id": "18221201154",
        "code": null,
        "name": "<li>常山赵子龙</li>",
        "newUcn": false
      },
      "lastModified": "2017-05-16 11:01:17",
      "lastModifier": {
        "id": "18221201154",
        "code": null,
        "name": "<li>常山赵子龙</li>",
        "newUcn": false
      },
      "shop": "s02c0302",
      "shopSku": "05468ecc-25e2-4087-b3fc-96e96f86b480", // 商品id
      "shopSkuName": "43", // 商品名
      "originalQty": 10, // 原数量
      "newQty": 5, // 调整后数量
      "reason": "",
      "adjustMethod": "adjust", // 调整方式
      "adjustMethodName": "损溢", // 调整方式中文
      "costAmount": -40, // 成本额
      "saleAmount": -50 // 售价额
    },
    {
      "id": "230cc2fd-9a2d-4a00-82ea-885ff46680e1",
      "version": 0,
      "created": "2017-05-16 11:00:00",
      "creator": {
        "id": "18221201154",
        "code": null,
        "name": "<li>常山赵子龙</li>",
        "newUcn": false
      },
      "lastModified": "2017-05-16 11:00:00",
      "lastModifier": {
        "id": "18221201154",
        "code": null,
        "name": "<li>常山赵子龙</li>",
        "newUcn": false
      },
      "shop": "s02c0302",
      "shopSku": "05468ecc-25e2-4087-b3fc-96e96f86b480",
      "shopSkuName": "43",
      "originalQty": 0,
      "newQty": 10,
      "reason": "",
      "adjustMethod": "adjust",
      "adjustMethodName": "损溢",
      "costAmount": 0,
      "saleAmount": 0
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 2
}