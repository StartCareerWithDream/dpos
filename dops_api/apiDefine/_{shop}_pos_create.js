/**
 * Created by wangxue on 2017/8/31.
 */

//绑定手机号到门店调用接口
paiPath = "/{shop}/pos/create";
method = "post";

request = {
  "id": "b88fda66-b9b6-4db6-b890-6735b48d96e6", //id
  "machineCode": "128033222656BFEBFBFF000306C3", //本机的code
  "shop": "s02c6699"
};

response =
{
  "data":
    {
      "cashDrawerCmd": "27,112,1,128,128",
      "created": "2017-09-01 10:04:51",
      "creator": {
        "code": null,
        "id": "13816638979",
        "name": "jsama",
        "newUcn":false
      },
      "id": "b88fda66-b9b6-4db6-b890-6735b48d96e6",
      "lastModified": "2017-09-01 10:04:51", //最后修改时间
      "lastModifier": { //最后修改人
        "code": null,
        "id": "13816638979",
        "name": "jsama",
        "newUcn":false
      },
      "machineCode": "128033222656BFEBFBFF000306C3",//本机的code
      "openCashDrawer": false,
      "posNo": "18512188044",
      "printSaleReturnTicket": false,
      "printSaleTag": false,
      "printSaleTicket": false,
      "saleReturnPrinter": null,
      "saleTagPrinter": null,
      "saleTicketEncryptNumber": false,
      "shop": "s02c6699",
      "version": "0"
    }
  ,
  "success": true,
  "message": null,
  "fields": null,
  "total": null,
  "more": false
};