/**
 * Created by wangxue on 2017/8/31.
 */

//获取门店收藏夹信息
paiPath = "/{shop}/skuFavorite/get/byShop";
method = "get";

request = null;

response =
{
  "data":
  {
    skufavoriteList: [],
    skufavcategory: []
  },
  "success": true,
  "message": null,
  "fields": {
    totalCount: "0",
    favProdLimit: "200"
  },
  "total": null,
  "more": false
};