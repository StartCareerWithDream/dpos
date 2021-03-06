/**
 * Created by jsama on 2017/6/13.
 */
//缴款登记保存
paiPath = "/{shop}/paydelivery/save";
method = "POST";

request = {
  "id": "7a37cb7a-d9a3-4e06-8c12-3e7e55face02",//缴款单uuid
  "remark": "xxx",//备注
  "waitToPayAmount": 13,
  "realPayAmount": 0,
  "overShort": 13,
  "paymentRecords": [
    {
      "paymentMethod": "现金",
      "amount": 10,
      "realPayAmount": 0
    },
    {
      "paymentMethod": "其他",
      "amount": 3,
      "realPayAmount": 0
    }
  ],
  "version" : 0
};


response =
{
  "data": {
    "id": "7a37cb7a-d9a3-4e06-8c12-3e7e55face02",
    "version": 1,
    "created": "2017-06-11 16:04:42",
    "creator": {
      "id": null,
      "code": null,
      "name": null,
      "newUcn": false
    },
    "lastModified": "2017-06-11 16:04:42",
    "lastModifier": {
      "id": null,
      "code": null,
      "name": null,
      "newUcn": false
    },
    "shop": "a02c0702",
    "cashier": "xxx",
    "cashierMobile": "13012868758",
    "workShift": null,
    "number": "170611-001",
    "state": "WAITSIGN",
    "remark": null,
    "waitToPayAmount": 13,
    "realPayAmount": null,
    "overShort": null,
    "paymentRecords": [
      {
        "uuid": "49cd0940-4424-4519-bd2b-05377a36894f",
        "paymentMethod": "其他",
        "amount": 3,
        "realPayAmount": 0
      },
      {
        "uuid": "d5736e9d-e166-41f4-b3c3-cc4107d95c4e",
        "paymentMethod": "现金",
        "amount": 10,
        "realPayAmount": 0
      }
    ]
  },
  "success": true,
  "message": null,
  "fields": null,
  "total": null
};