/**
 * Created by luyongjie on 2017/6/11.
 */

//获取分析报表数据
paiPath = "/{shopUuid}/report/operationanalysis";
method = "POST";

request = {
  "body": {//一般查询条件
    "filters": [
      {
        "property": 'date:[,]', // 日期范围，精确到天 (必填)
        "value": ['2017-05-01', '2017-05-08']
      },
      {
        "property": 'shopSkuTag:in', // 商品标签 （1.9.5版本不提供）
        "value": []
      }, {
        "property": 'shopSku:=', // 商品uuid等于,如果查询条件存在商品等于，则不考虑商品标签查询条件 （1.9.5版本不提供）
        "value": []
      }
    ],
    "start": "",
    "limit": 10
  },//查询条件
  "params": {
    "scope": "DAY",  // DAY MONTH YEAR 2个日期时间段间隔进行判断 如果查询时间段小于40天，则按天(传DAY)，如果大于40天，则按自然月(传MONTH)，如果大于365天，则按自然年传(YEAR)
    "eveningWorkStart": "23:00", //默认夜班开始时间段
    "eveningWorkEnd": "07:00" //默认夜班结束
  }
}

response =
  {
    "data": [
      {
        "date": "2017-05-06 00:00:00", // 日期
        "axisLabel": "2015-05-06", // x轴坐标
        "saleAmount": 100, // 销售额
        "saleNumber": 10, // 销售笔数
        "saleAmountAvg": 10, // 客单价（销售额/销售笔数）
        "returnAmount": 0, // 退货额
        "returnNumber": 0, // 退货笔数
        "orderAmount": 0, // 批发金额
        "orderNumber": 0, // 批发笔数
        "retailCostAmount": 0, // 销售成本额
        "returnCostAmount": 0, // 退货成本额
        "wholesaleCostAmount": 0, // 批发成本额
        "retailGrossAmount": 0, // 销售毛利额
        "returnGrossAmount": 0, // 退货毛利额
        "wholesaleGrossAmount": 0, // 批发毛利额
        "saleGrossRate": 50, // 销售毛利率%
        "eveningAmount": 0, // 夜班销售额
        "purchaseAmount": 0, // 进货金额
        "purchaseNumber": 0, // 进货笔数
        "saleCount": 0, // 销售品项
        "ivnCount": 0 // 库存品项(1.9.5版本不提供)
          },
      {
        "date": "2017-05-06 00:00:00", // 日期
        "axisLabel": "2015-05-07", // x轴坐标
        "saleAmount": 100, // 销售额
        "saleNumber": 10, // 销售笔数
        "saleAmountAvg": 10, // 客单价（销售额/销售笔数）
        "returnAmount": 0, // 退货额
        "returnNumber": 0, // 退货笔数
        "orderAmount": 0, // 批发金额
        "orderNumber": 0, // 批发笔数
        "retailCostAmount": 0, // 销售成本额
        "returnCostAmount": 0, // 退货成本额
        "wholesaleCostAmount": 0, // 批发成本额
        "retailGrossAmount": 0, // 销售毛利额
        "returnGrossAmount": 0, // 退货毛利额
        "wholesaleGrossAmount": 0, // 批发毛利额
        "saleGrossRate": 50, // 销售毛利率%
        "eveningAmount": 0, // 夜班销售额
        "purchaseAmount": 0, // 进货金额
        "purchaseNumber": 0, // 进货笔数
        "saleCount": 0, // 销售品项
        "ivnCount": 0 // 库存品项(1.9.5版本不提供)
      }],
    "success": true,
    "message": [""],
    "fields": {},
    "total": 10,
    "summary": {
      "totalSaleAmount": 100,  //总销售
      "totalPurchaseAmount": 0  //总进货
    }
  }