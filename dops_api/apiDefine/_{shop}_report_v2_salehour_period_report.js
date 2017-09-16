/**
 * Created by dsj on 2017/7/21.
 */

 //时段统计报表

paiPath = "/{shop}/report/v2/salehour/period/report";
 method = "POST";

 // query 参数
 tagNames = ['1','2','3']  /*标签名称集合, 不用于过滤。用于查询具体标签在某时段的报表，最多3个 */

 // body 参数
 request = {
  "start": 0,
  "limit": 0,
  "filters": [
   {
    "property": "date:[,]",  /*精确到天*/
    "value": ['2017-07-20','2017-07-21']
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
    "date": "00:00 -- 01:00",   /*零售时段*/
    "saleAmount": 0,            /*零售总额*/
    "saleCount": 0,             /*交易笔数*/
    "wholesaleAmount": 0,
    "wholesaleCount": 0,
    "returnAmount": 0,
    "returnCount": 0,
    "saleCostAmount": 0,        /*零售成本额*/
    "saleGrossAmount": 0,       /*零售毛利额*/
    "returnCostAmount": 0,
    "returnGrossAmount": 0,
    "wholesaleCostAmount": 0,
    "wholesaleGrossAmount": 0,
    "tags": [
     {
      "saleSkuTagName": "string", /*标签名称*/
      "saleAmount": 0,          /*标签 - 零售金额*/
      "saleQty": 0,             /*标签 - 零售数量*/
      "wholesaleAmount": 0,
      "wholesaleQty": 0,
      "returnAmount": 0,
      "returnQty": 0,
      "saleCostAmount": 0,
      "saleGrossAmount": 0,
      "returnCostAmount": 0,
      "returnGrossAmount": 0,
      "wholesaleCostAmount": 0,
      "wholesaleGrossAmount": 0
     }
    ]
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
  "total":0
 }
