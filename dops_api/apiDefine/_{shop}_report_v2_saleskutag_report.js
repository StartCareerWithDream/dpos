/**
 * Created by dsj on 2017/7/21.
 */

 //标签统计报表
 paiPath = "/{shop}/report/v2/saleskutag/report";
 method = "POST";

 request ={
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
       "saleSkuTagName": "string",  /*商品标签*/
       "saleAmount": 0,             /*零售额*/
       "saleQty": 0,                /*零售数量*/
       "wholesaleAmount": 0,
       "wholesaleQty": 0,
       "returnAmount": 0,
       "returnQty": 0,
       "saleCostAmount": 0,         /*零售成本额*/
       "saleGrossAmount": 0,        /*零售毛利额*/
       "returnCostAmount": 0,
       "returnGrossAmount": 0,
       "wholesaleCostAmount": 0,
       "wholesaleGrossAmount": 0
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
   "total": {},
   "summary": {
     "totalSaleAmount": 0,      /*零售额合计*/
     "totalSaleQty": 0,         /*零售数量合计*/
     "totalSaleCostAmount": 0,         /*零售成本额合计*/
     "totalSaleGrossAmount": 0,        /*零售毛利额合计*/
     "totalReturnAmount": 0,
     "totalWholesaleAmount": 0
   }
 }