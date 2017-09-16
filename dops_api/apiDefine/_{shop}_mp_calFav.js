/**
 * Created by wangxue on 2017/9/4.
 */
paiPath = "/{shop}/mp/calFav";
method = "post";

request = {
  "id": "d0e54d15-cb74-4312-a884-fa788370ae08",
  "version": 0,
  "created": "2017-09-04 10:28:23",
  "creator": {
    "id": "13816638979",
    "code": null,
    "name": "jsama",
    "newUcn": false
  },
  "lastModified": "2017-09-04 10:28:23",
  "lastModifier": {
    "id": "13816638979",
    "code": null,
    "name": "jsama",
    "newUcn": false
  },
  "number": "170904-005",
  "encryptNumber": "170904-7853",
  "posNo": null,
  "shop": "s01c6952",
  "customer": null,
  "amount": "4560.00",
  "discountAmount": 0,
  "state": null,
  "changeAmount": 0,
  "qty": "2.000",
  "shiftName": null,
  "shiftNameDate": null,
  "preId": "3a90538a-2814-4aa2-91a9-1284419440d7",
  "nextId": null,
  "discount": 0,
  "hasSaleReturn": false,
  "apiVersion": "v2",
  "paymentInfo": null,
  "payments": [
    {
      "id": "62daa4d3-0485-4ab6-a5b3-b80fff679db0",
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
      "id": "d2eb8b4c-9c90-4b38-aa48-c185418f3920",
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
      "id": "2ddd1833-485e-497c-a82b-bf98bf47b654",
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
      "id": "7ea654b5-51d2-4c16-8c7a-346d4795d023",
      "paymentMethod": "现金",
      "paidAmount": "4560.00",
      "payingAmount": 0,
      "state": null,
      "artificialState": null,
      "tranId": null,
      "payChannel": "CASH",
      "created": null,
      "creditPayTime": null
    }
  ],
  "lines": [
    {
      "id": "57aed88d-d895-4ff5-8956-350db671007f",
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
      "id": "4b6f334f-56ae-42de-a2a1-5986a2def131",
      "line": 0,
      "sku": {
        "id": "d3c561f9-8fc8-4746-b614-6b791c12a4c0",
        "code": "6925647667338",
        "name": "雅诗兰秀妆美白活肤精华液",
        "newUcn": false
      },
      "platfromSku": "fc5a108c-a7f0-11e6-a8ce-6c92bf31542f",
      "price": 4500,
      "costPrice": 0,
      "qty": 1,
      "amount": 4500,
      "skuMunit": "瓶",
      "newSku": false,
      "deletable": true
    }
  ],
  "favDetails": [],
  "couponCode": [
    "1341234"
  ]
};

response = {
  "data": {
    "errCode": "-1",
    "message": "根据券码:1341234没有查到券信息。",
    "favAmount": 0,
    "couponFavs": []
  },
  "success": false,
  "message": [
    "根据券码:1341234没有查到券信息。"
  ],
  "fields": null,
  "total": null,
  "more": false
};