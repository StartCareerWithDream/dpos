/**
 * Created by zhaorong on 2017/8/31.
 */
//获取销售单查询列表 query类型，30行
paiPath = "/{shop}/sale/v2/list";
method = "GET";

request =
{
  "start": 0,
  "limit": 30,
  "filter":[
    {
      "property":"posNo=",//pos机号
      "value":""
    },
    {
      "property":"sku=",//商品的sku
      "value":""
    },
    {
      "property":"realAmount>=",//金额>=
      "value":""
    },
    {
      "property":"realAmount<=",//金额<=
      "value":""
    },
    {
      "property":"customer=",//会员
      "value":"7341d532-05a7-4191-89ce-5f5efc8771c7"
    },
    {
      "property":"paymentIn",//支付方式
      "value":[]
    },
    {

      "property":"operator%=%",//操作人
      "value":""

    },
    {

      "property":"orderNum%=%",//流水号
      "value":""

    },
    {
      "property":"discountAmount>=",//优惠金额>=
      "value":""
    },
    {
      "property":"discountAmount<=",//优惠金额<=
      "value":""
    },
    {
      "property":"created bco",//时间
      "value":[
        "2017-07-30 00:00:00",
        "2017-08-31 00:00:00"
      ]
    }
  ]
};

response =
{
  "data": [
    {
      "amount":2.2,
      "apiVersion":"v2",
      "changeAmount": 0,
      "created": "2017-08-31 12:54:38",
      "creator":{
        id: "",
        code:"",
        name: "",
        newUcn:false
      },
      "customer":{
        id: "",
        code: "",
        name: "",
        newUcn:false
      },
      "discount": null,
      "discountAmount":"",
      "encryptNumber": null,
      "favDetails": [],
      "hasSaleReturn": false,
      "id": "f114aa89-6e35-4964-86fc-abb324740246",
      "lastModified": "2017-08-31 12:54:38",
      "lastModifier": {id: "18726081447", code: null, name: "赵蓉", newUcn: false},
      "lines": [],
      "nextId": null,
      "number": "170831-004",
      "paymentInfo": "现金",
      "payments": [],
      "posNo": "1",
      "preId": null,
      "qty": 1,
      "shiftName": null,
      "shiftNameDate": null,
      "shop": "s02c7595",
      "state": null,
      "version": 0
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "summary":{
    "creditPaidAmount": 0,
    "creditPaidQty": 0,
    "creditUnPaidAmount":0,
    "creditUnPaidQty": 3,
    "totalAmount": 59.2,
    "totalDiscountAmount": 0,
    "totalQty": 8
  },
  "total": 1
};

