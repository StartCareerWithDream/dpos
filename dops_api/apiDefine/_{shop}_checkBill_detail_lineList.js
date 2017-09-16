/**
 * Created by dsj on 2017/4/7.
 */

//获取盘点单明细.商品行 （还带翻页）
paiPath = "/{shop}/checkBill/detail/lineList";
method = "POST";

request =
{
  "start": 0,
  "limit": 20
}

  checkBill="string";  //外加一个query参数：单据uuid

response =    /*返回应该按照 lineNo 排序*/
{
  "data": [
    {
      "id": "faa456e1-a2bb-418e-8472-6438bb6d734b",
      "version": 0,
      "created": null,
      "creator": null,
      "lastModified": null,
      "lastModifier": null,
      "shop": "s02c0302",
      "checkBill": "6bc91c9c-7431-4c39-bc74-7942d91ba959",
      "lineNo": 6,    /*行号*/
      "shopSku": "0b809626-6bc1-422e-ad73-e08a9673b611",
      "shopSkuName": "贝因美动物磨牙饼100G",    /*商品名称*/
      "shopSkuBarcode": "690451780270",   /*商品条码*/
      "qty": 600,	// 数量
      "invQty": 600,	// 当时库存数量
      "profitQty": 0,	// 盈亏数量
      "costAmount": 0,  // 盈亏成本
      "saleAmount": 0	// 盈亏金额
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 1
}