/**
 * Created by dsj on 2017/4/7.
 */

 //上传excel文件，返回值 获得商品的重复记录（可能发生） + 本次上传操作的“唯一ID”
 paiPath = "/{shop}/checkBill/upload";
 method = "POST";

 request = null; /*采用附件上传的接口进行*/


 response =
{
  "data": [], // 重复的记录的barcode
  "success": true,
  "message": null,
  "fields": null,
  "total": null,
  "more": false,
  "summary": "18221201154_s02c0302_20170406194256"// 本次上传操作的“唯一ID”(checkId)
}