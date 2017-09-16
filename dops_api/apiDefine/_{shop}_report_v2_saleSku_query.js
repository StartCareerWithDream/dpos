/**
 * Created by dsj on 2017/7/21.
 */

//商品销售统计报表
paiPath = "/{shop}/report/v2/saleSku/query";
method = "POST";

// Query参数
request = {
    "start": 0,
    "limit": 0,
    "filters": [
        {
            "property": "date:[,]", /*精确到天*/
            "value": ['2017-07-20', '2017-07-21']
        },
        {
            "property": "tags:in", /*标签名称包含*/
            "value": []
        },
        {
            "property": "shopSkuKeyword:%=%", /*商品条码或名称类似于*/
            "value": ""
        }

    ],
    "sorters": [
        {
            "property": "string",
            "direction": "string"
        }
    ]
}

response = {
    "data": [
        {
            "shopSku": "7744dca3-a981-4505-9a2e-af39326f14a5",
            "shopSkuName": "久紧迷情装安全套12只",
            "shopSkuBarcode": "6921207706059",
            "shopSkuTags": null,
            "invQty": -1.0000,
            "saleQty": 1.0000,
            "saleAmount": 45.0000,
            "saleCostAmount": 0.0000,
            "saleGrossAmount": 45.0000
        }
    ],
    "success": true,
    "message": [
        "string"
    ],
    "fields": [
        {
            "key": "string"
        }
    ],
    "total": 0
}