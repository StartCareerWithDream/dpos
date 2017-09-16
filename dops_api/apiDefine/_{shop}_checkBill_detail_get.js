/**
 * Created by dsj on 2017/4/7.
 */

//获取盘点单明细.单头 get类型，单头
paiPath = "/{shop}/checkBill/detail/get";
method = "GET";

request = null;
  checkBill="string";  //query参数：单据uuid

response =
{
  "data": {
    "id": "aa87edd7-6a2f-4a4a-8220-9630fa6bfb32",       //单据uuid
    "version": 0,
    "created": null,        //生成时间
    "creator": null,        //操作人
    "lastModified": null,
    "lastModifier": null,
    "shop": "s02c0302",
    "number": "170407-001",   /*单号*/
    "createMethod": "Excel导入生成",    /*生成方式*/
    "profitQty": -200,    /*盈亏数量*/
    "costAmount": 40000,    /*盈亏成本*/
    "saleAmount": -11000,   /*盈亏金额*/
    "remark": "导入Excel文件名为《库存盘点2003.xls》",    /*备注*/
    "lines": []
  },
  "success": true,
  "message": null,
  "fields": null,
  "total": null,
  "more": false,
  "summary": {
    "prevId": "e6270914-8580-4a75-b388-9dcb12a26a4f", /*// 上一单id*/
    "nextId": "6bc91c9c-7431-4c39-bc74-7942d91ba959"  //*/ 下一单id*/
  }
}