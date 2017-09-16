/**
 * Created by jsama on 2017/6/13.
 */
//缴款登记查询
paiPath = "/{shop}/paydelivery/query";
method = "POST";

request =
{
  "start": 5,
  "limit": 10,
  "filters": [
    {
      "property": "cashier:%=%",//收银员姓名
      "value": "xxx"
    },
    {
      "property": "osrange:[,]",//长短款
      "value": [5, 10]
    },
    {
      "property": "date:[,]",//日期
      "value": ["2017-06-08 12:30:50", "2017-06-09 15:30:50"]
    },
    {
      "property": "state:=",//状态，可选值（待签字， 待处理， 已处理， 已作废）
      "value": "待处理"
    },
    {
      "property": "workShift:=",//班次,可选值（早班， 中班， 晚班）
      "value": "早班"
    }
  ],
  "sorters": [
    {
      "property": "generateDate",//生成日期
      "direction": "desc"
    },
    {
      "property": "waitToPayAmount",//待缴款金额
      "direction": "desc"
    },
    {
      "property": "realPayAmount",//实缴金额
      "direction": "desc"
    },
    {
      "property": "number",//缴款单号
      "direction": "desc"
    },
    {
      "property": "overShort",//长短款
      "direction": "desc"
    }
  ]
};


response =
{
  "data": [
    {
      "id": "7a37cb7a-d9a3-4e06-8c12-3e7e55face02",
      "version": 0,
      "created": null,
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
      "number": null,
      "state": null,
      "remark": null,
      "waitToPayAmount": 13,
      "realPayAmount": null,
      "overShort": null,
      "paymentRecords": []
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 1
};