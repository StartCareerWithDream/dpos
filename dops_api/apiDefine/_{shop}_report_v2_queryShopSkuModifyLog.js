/**
 * Created by dsj on 2017/5/17.
 */

//接口说明 库存调整记录查询
paiPath = "/{shop}/report/v2/queryShopSkuModifyLog";
method = "POST";

request = {
    'start' : 0 ,
    'limit' : 30 ,
    'filters' : [
        {
            "property":"searchKey:=", // 商品uuid
            "value":"90909102121FJAD"
        },{
            "property":"operator:=", //操作人
            "value":"章三"
        },{
            "property":"changeType:in", //修改内容
            "value":"salePrice"
        },{
            "property":"updateDate:[,]", // 时间从
            "value":"2017-08-19"
        }
    ]
};


response =
{
    "data": [
        {
            "id": "2d562f0f-7770-4f2f-9211-73019edd4cfb",
            "name": "sjkjfkskskskjfkskjfksssffsfsf1", // 名称
            "barcode": "1212", // 条码
            "updateId": null,
            "updateName": "links供应商",// 操作人
            "updateTime": "2017-08-17 20:15:46", // 修改时间
            "shop": "a01c8002",
            "shopSku": "23c73319-4e77-40a7-bf56-cb4e6a3dbf25",
            "changeType": "barcode;lastInPrice;salePrice;",
            "originalVal": "{\"lastInPrice\":0.0000,\"costPrice\":0.0000,\"barcode\":\"\",\"salePrice\":0.0000,\"code\":\"\"}",
            "newVal": "{\"lastInPrice\":12.00,\"costPrice\":0.0000,\"barcode\":\"1212\",\"salePrice\":12.00,\"code\":\"\"}" // 修改内容
        }
    ],
    "success": true,
    "message": null,
    "fields": null,
    "total": 1,
    "more": false
}