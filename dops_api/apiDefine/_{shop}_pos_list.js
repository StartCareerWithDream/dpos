/**
 * Created by zhaorong on 2017/8/31.
 */
//获取pos机列表 query类型，25行
paiPath = "/{shop}/pos/list";
method = "GET";

request =
{
  "page":1,
  "start": 0,
  "limit": 25,
  "query":"",
  "filter":[
    {
      "property":"searchKey:%=%",
      "value":""
    },{
      "property":"state:=",
      "value":""
    }
  ]
};

response =
{
  "data": [
    {
      "id":"bddd1abb-9729-45e7-816f-b948c5c31e49",
      "version":0,
      "created":null,
      "creator":null,
      "lastModified":null,
      "lastModifier":null,
      "shop":"s02c7595",
      "machineCode":"127928365056BFEBFBFF000306C3",
      "posNo":1,
      "saleReturnPrinter":null,
      "printSaleReturnTicket":false,
      "printSaleTicket":false,
      "saleTicketEncryptNumber":false,
      "printSaleTag":false,
      "saleTagPrinter":null,
      "openCashDrawer":false,
      "cashDrawerCmd":"27,112,1,128,128"
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 1
};
