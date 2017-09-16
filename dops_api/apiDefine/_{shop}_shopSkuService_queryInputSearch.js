/**
 * Created by jsama on 2017/6/13.
 */
//模糊查询
paiPath = "/{shop}/shopSkuService/queryInputSearch";
method = "get";

request =
{
    'page': 1 ,
    'start' : 0 ,
    'limit' : 10 ,
    'filter' : [
    {
        "property":"searchKey:%=%", // 模糊匹配的可以
        "value":"90909102121FJAD"
    }
]
};
//以上为parmas参数


response =
{
    "data": [
        {
            "id": "5545be51-d739-4d86-942d-27bbc58327ba",
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
            "barcode": "691209",
            "name": "691209",
            "qpcText": "",
            "munit": "个",
            "multipack": false,
            "shop": null,
            "code": null,
            "smartCodes": null,
            "state": "normal",
            "salePrice": 0.0,
            "lastInPrice": 12.0,
            "platformSku": "",
            "tags": [],
            "images": [],
            "remark": null,
            "focus": false,
            "inFavorite": false,
            "merchantSku": false,
            "minPackSku": false,
            "inventory": null,
            "invQty": null,
            "minQty": null,
            "costPrice": 0.0,
            "merchant": null,
            "qpcList": [],
            "autoRpl": false,
            "rplSuggestDay": 0,
            "rplSuggestNum": 0,
            "weighed": false,
            "weighingCode": null,
            "qpcSku": null,
            "spec": null,
            "qpc": null,
            "currentSku": false,
            "basicQpcSku": false,
            "shortName": null
        }

    ],
    "success": true,
    "message": null,
    "fields": null,
    "total": 9,
    "more": false
}