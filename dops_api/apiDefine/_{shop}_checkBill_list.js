/**
 * Created by dsj on 2017/4/7.
 */


//获取盘点单列表 query类型，无条件，默认单号逆序 20行
paiPath = "/{shop}/checkBill/list";
method = "POST";

request =
{
  "start": 0,
  "limit": 20,
  "sorters": [
    {
      "property": "number",     //单号排序
      "direction": "asc或desc"
    },
    {
      "property": "created",    //生成时间排序
      "direction": "asc或desc"
    }
  ]
}

response =
{
  "data": [
    {
      "id": "6bc91c9c-7431-4c39-bc74-7942d91ba959",         //单据uuid，在跳转单据详情时使用
      "version": 0,
      "created": null,                                      //生成时间
      "creator": null,                                      //操作人
      "lastModified": null,
      "lastModifier": null,
      "shop": "s02c0302",
      "number": "170407-002",                                      //单号
      "createMethod": "Excel导入生成",                                      //生成方式
      "profitQty": 1100,                                      //盈亏数量
      "costAmount": 2050000,                                      //盈亏成本
      "saleAmount": 76700,                                      //盈亏金额
      "remark": "导入Excel文件名为《库存盘点2003.xls》",
      "lines": []
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 1
}