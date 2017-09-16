/**
 * Created by jsama on 2017/6/13.
 */
//缴款登记详情
paiPath = "/{shop}/paydelivery/get";
method = "get";

request = null;
id="string";  //query参数：uuid


response =
{
  "data": {
    "id": "7a37cb7a-d9a3-4e06-8c12-3e7e55face02",
    "version": 0,
    "created": "2017-06-09 12:00:08",
    "creator": {
      "id": null,
      "code": null,
      "name": null,
      "newUcn": false
    },
    "lastModified": null,
    "lastModifier": {
      "id": null,
      "code": null,
      "name": null,
      "newUcn": false
    },
    "generateDate": "2017-06-09 12:00:08",
    "shop": "a02c0702",
    "cashier": "收银员",
    "cashierMobile": "13012868758",
    "workShift": null,
    "number": null,//缴款单单号
    "state": null,
    "remark": null,
    "waitToPayAmount": 13,//应缴金额
    "realPayAmount": null,//实缴金额
    "overShort": null,
    "paymentRecords": [
      {
        "uuid": "bfddeb48-49ab-4c04-a813-b3eb1ca9f523",
        "paymentMethod": "现金",
        "amount": 10,
        "realPayAmount": 0
      },
      {
        "uuid": "d5e56132-a70f-41e6-8947-9e9022d0d530",
        "paymentMethod": "其他",
        "amount": 3,
        "realPayAmount": 0
      }
    ]
  },
  "success": true,
  "message": null,
  "fields": null,
  "total": null
};