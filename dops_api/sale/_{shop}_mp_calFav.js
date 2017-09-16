/**
 * Created by wangxue on 2017/9/4.
 */

paiPath = "/{shop}/mp/calFav";
method = "post";

request = {
  "id": "3a90538a-2814-4aa2-91a9-1284419440d7",
  "version": 0,
  "created": "2017-09-04 10:06:36",
  "creator": {
    "id": "13816638979",
    "code": null,
    "name": "jsama",
    "newUcn": false
  },
  "lastModified": "2017-09-04 10:06:36",
  "lastModifier": {
    "id": "13816638979",
    "code": null,
    "name": "jsama",
    "newUcn": false
  },
  "number": "170904-004",
  "encryptNumber": "170904-5679",
  "posNo": null,
  "shop": "s01c6952",
  "customer": {
    "id": "2265bd46-4dae-4e78-a9ac-21d7cd5de76a",
    "code": "13900000000",
    "name": "13900000000",
    "newUcn": false
  },
  "amount": "79.00",
  "discountAmount": 0,
  "state": null,
  "changeAmount": 0,
  "qty": "3.000",
  "shiftName": null,
  "shiftNameDate": null,
  "preId": "992279ea-676b-4016-9359-c96459b55bd6",
  "nextId": null,
  "discount": 0,
  "hasSaleReturn": false,
  "apiVersion": "v2",
  "paymentInfo": null,
  "payments": [
    {
      "id": "687781c4-3eda-410d-ab71-e833a6d78381",
      "paymentMethod": null,
      "paidAmount": 0,
      "payingAmount": 0,
      "state": null,
      "artificialState": null,
      "tranId": null,
      "payChannel": "ONLINE",
      "created": null,
      "creditPayTime": null
    },
    {
      "id": "f3924a66-ecdf-43f9-8428-91f655adf390",
      "paymentMethod": "现金",
      "paidAmount": "79.00",
      "payingAmount": 0,
      "state": null,
      "artificialState": null,
      "tranId": null,
      "payChannel": "CASH",
      "created": null,
      "creditPayTime": null
    },
    {
      "id": "8544cde4-9bbd-4ad6-82fd-85daa0ca12df",
      "paymentMethod": "其他",
      "paidAmount": "0.00",
      "payingAmount": 0,
      "state": null,
      "artificialState": null,
      "tranId": null,
      "payChannel": "OTHER",
      "created": null,
      "creditPayTime": null
    },
    {
      "id": "4f2bd644-ef77-4895-aec1-52575e14b0df",
      "paymentMethod": "赊账",
      "paidAmount": "0.00",
      "payingAmount": 0,
      "state": "未收款",
      "artificialState": null,
      "tranId": null,
      "payChannel": "CREDIT",
      "created": null,
      "creditPayTime": null
    },
    {
      "id": "23a8fe3c-69cb-41d7-95ef-5967ca6224a3",
      "payChannel": "BALANCE",
      "paymentMethod": "储值",
      "tranId": null,
      "state": null,
      "payingAmount": "79.00"
    }
  ],
  "lines": [
    {
      "id": "44268b24-d1c0-4dd6-986b-212602a59d6b",
      "line": 0,
      "sku": {
        "id": "5045dfd5-341c-4fbc-878e-eb5236218dc6",
        "code": "1234",
        "name": "虽然舍突然",
        "newUcn": false
      },
      "platfromSku": null,
      "price": 60,
      "costPrice": 0,
      "qty": 1,
      "amount": 60,
      "skuMunit": "个",
      "newSku": false,
      "deletable": true
    },
    {
      "id": "c50c64f3-0f6a-43d8-88cf-4bf6992eb52d",
      "line": 0,
      "sku": {
        "id": "b26b2131-f66b-4502-b4e4-4bcfd9c84c12",
        "code": "6914782113121",
        "name": "徐福记彩豆糖11G",
        "newUcn": false
      },
      "platfromSku": "EEE5CB78EC2749CC8C71189A3AD2C5B1",
      "price": 0,
      "costPrice": 0,
      "qty": "1.000",
      "amount": 0,
      "skuMunit": "袋",
      "newSku": false,
      "deletable": true
    },
    {
      "id": "e58bf1a7-ebdd-49f3-a249-997632c381b8",
      "line": 0,
      "sku": {
        "id": "0edd3308-d485-4da8-9f67-6b2a902986f0",
        "code": "6951706721130",
        "name": "優生毛圈襪-(13/14)/淺粉",
        "newUcn": false
      },
      "platfromSku": "C4FCFD64D38A4534BB8D990383B63960",
      "price": "19.00",
      "costPrice": 0,
      "qty": 1,
      "amount": 19,
      "skuMunit": "件",
      "newSku": true,
      "deletable": true
    }
  ],
  "favDetails": [],
  "couponCode": [
    "12431243"
  ]
};

response =
{
  "data": {
    "errCode": "-1",
    "message": "根据券码:12431243没有查到券信息。",
    "favAmount": 0,
    "couponFavs": []
  },
  "success": false,
  "message": [
    "根据券码:12431243没有查到券信息。"
  ],
  "fields": null,
  "total": null,
  "more": false
};