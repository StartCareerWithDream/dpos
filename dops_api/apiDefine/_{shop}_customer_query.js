/**
 * Created by zhaorong on 2017/8/31.
 */
//获取会员列表 query类型，10行
paiPath = "/{shop}/customer/query";
method = "GET";

request =
{
  "page":1,
  "start": 0,
  "limit": 10,
  "query":"",
  "filter":[
    {
      "property":"searchKey:%=%",
      "value":""
    },{
      "property":"state:=",
      "value":""
    }
  ]
};

response =
{
  "data": [
    {
      "id":"7341d532-05a7-4191-89ce-5f5efc8771c7",
      "version":4,
      "created":null,
      "creator":null,
      "lastModified":null,
      "lastModifier":null,
      "shop":null,
      "name":"赵蓉",
      "phone":"18726081447",
      "smartCodes":null,
      "address":"",
      "user":null,
      "member":null,
      "remark":"",
      "state":null,
      "newContact":null,
      "lastActivityDate":"2017-08-31 12:54:38",
      "tags":[
        "VIP"
      ]
    }
  ],
  "success": true,
  "message": null,
  "fields": null,
  "total": 1
};
