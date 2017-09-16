/**
 * Created by zhaorong on 2017/8/31.
 */
//获取销售明细
paiPath = "/{shop}/sale/v2/get";
method = "post";

request = null;
id="string";
fetchContext = true/false;//是否包含上一单下一单id
posNo="string";

response =
{
  "data":{
    "id":"f114aa89-6e35-4964-86fc-abb324740246",
    "version":0,
    "created":"2017-08-31 12:54:38",
    "creator":{//操作人
      "id":"",
      "code":null,
      "name":"",
      "newUcn":false
    },
    "lastModified":"2017-08-31 12:54:38",
    "lastModifier":{//最后修改信息
      "id":"",
      "code":null,
      "name":"",
      "newUcn":false
    },
    "number":"170831-004",//正常单号
    "encryptNumber":"170831-7131",//加密单号
    "posNo":"1",//pos机号
    "shop":"s02c7595",
    "customer":{//会员
      "id":"7341d532-05a7-4191-89ce-5f5efc8771c7",
      "code":"",
      "name":"",
      "newUcn":false
    },
    "amount":2.2000,//金额
    "discountAmount":0.0000,//优惠价格
    "state":null,
    "changeAmount":0.0000,
    "qty":1.0000,//数量
    "shiftName":null,
    "shiftNameDate":null,
    "preId":null,//上一单id
    "nextId":null,//下一单id
    "discount":0,//折扣
    "hasSaleReturn":false,//是否有退货单
    "apiVersion":"v2",
    "paymentInfo":null,
    "payments":[//支付方式
      {
        "id":"1d3df184-a6af-460f-b423-b51bd19ceff7",
        "paymentMethod":"其他",
        "paidAmount":0.0000,
        "payingAmount":0.0000,
        "state":null,
        "artificialState":null,
        "tranId":null,
        "payChannel":"OTHER",
        "created":"2017-08-31 12:54:38",
        "creditPayTime":null
      },
      {
        "id":"9db7ddc8-e96a-4e11-b78e-78621dbda158",
        "paymentMethod":"赊账",
        "paidAmount":0.0000,
        "payingAmount":0.0000,
        "state":"未收款",
        "artificialState":null,
        "tranId":null,
        "payChannel":"CREDIT",
        "created":"2017-08-31 12:54:38",
        "creditPayTime":null
      },
      {
        "id":"b5ea795c-9749-4c54-9f28-e5740a6305ec",
        "paymentMethod":"现金",//支付方式
        "paidAmount":2.2000,
        "payingAmount":0.0000,
        "state":null,
        "artificialState":null,
        "tranId":null,
        "payChannel":"CASH",
        "created":"2017-08-31 12:54:38",
        "creditPayTime":null
      }
    ],
    "lines":[//商品信息
      {
        "id":"565c4d07-32a3-46da-a736-9db26624d77b",
        "line":1,
        "sku":{
          "id":"f6e37952-7f52-4cbe-bed7-15546ab9f5f9",
          "code":"693972140078",
          "name":"鸽鸽蒜香味豆角干69g",
          "newUcn":false
        },
        "platfromSku":"61C1C1B462574D8D87FBA4EBFCF53B2F",
        "price":2.2000,
        "costPrice":0.0000,
        "qty":1.0000,
        "amount":2.2000,
        "skuMunit":"袋",
        "newSku":false,
        "deletable":false
      }
    ],
    "favDetails":[
    ]
  },
  "success":true,
  "message":null,
  "fields":null,
  "total":null,
  "more":false

};