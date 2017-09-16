/**
 * Created by dsj on 2017/3/14.
 */
router = [
  // 盘点
  {path:"checkBill/", name:"checkBillList", module:"盘点管理", page:"盘点单列表"},
  {path:"checkBill/", name:"checkBillDtl", module:"盘点管理", page:"盘点单详情"},
  {path:"checkBill/", name:"checkBillUpload", module:"盘点管理", page:"盘点单文件上传"},
  {path:"checkBill/", name:"checkBillImport", module:"盘点管理", page:"盘点单文件导入"},

  /*
   * UX路径：
   *   http://ftp.hddomain.cn/wikifs/PDC/DNET/site/dpos/1.8-SNAPSHOT/server/dpos-ux/prototype/pc/index.html#g=1&p=盘点单列表
   *   http://ftp.hddomain.cn/wikifs/PDC/DNET/site/dpos/1.8-SNAPSHOT/server/dpos-ux/prototype/pc/index.html#g=1&p=盘点单详情
   *
   * checkBillList 的接口
   *   获取盘点单列表 query类型，无条件，默认单号逆序 20行。 疑问？ 每次进来都获得一遍，有必要么，UX问题
   *
   * checkBillDtl 的接口
   *   获取盘点单单头 get类型，单头
   *  获取盘点单明细 query （还带翻页）？
   *
   * checkBillUpload 的接口
   *   上传excel文件，返回值 获得商品的重复记录（可能发生） + 本次上传操作的“唯一ID”
   *
   * checkBillImport 的接口
   *   获得盘点商品列表 query类型，过滤条件为“状态”，无排序条件，如能附带”不可识别“、”可识别“的总数量更好，就不用新的接口了。
   *   清空门店商品库存数据接口 save类型
   *   导入盘点商品 import 类型，必要返回值：成功导入品相数量 + 新盘点单的UUID
   *
   * */

  // 库存
  {path:"inv/", name:"invAdjList", module:"库存管理", page:"库存调整记录查询"},
  /*
   * UX路径：
   *   http://hddenv/svn/qfpd/PDPOS/2.release/PC%E7%89%88/%E5%BA%93%E5%AD%98/%E5%BA%93%E5%AD%98%E8%B0%83%E6%95%B4%E8%AE%B0%E5%BD%95%E6%9F%A5%E8%AF%A2/UI/kucuntiaozheng.png
   *
   * invAdjList 的接口
   *   获取记录列表 post，有条件，默认排序？
   *     条件： 商品(名称、条码、自编码类似)、标签(类似)、操作人(类似)、时间范围(调整时间[,])，
   *
   * */

  // 收银缴款
  {path:"employeePayDelivery/", name:"employeePayDeliveryList", module:"收银缴款", page:"收银缴款列表"},
  /*
  * UX路径:http://ftp.hddomain.cn/wikifs/PDC/DNET/site/dpos/1.9.5-SNAPSHOT/server/dpos-ux/prototype/pc/index.html#g=1&p=收银缴款列表
  * 需要接口:
  * 1. 获取 班次列表, 请后台自带排序
  * 2. 获取 收银缴款单 列表, 查询条件: 收银员%=%, 长短款 [,] 状态=, 班次=, 生成日期段[,]; 排序支持:生成日期, 单号, 待缴款, 实缴款, 长短款
  * 3. ?? 不知道待缴款的那个第一条信息是不是也在接口2中能包含?
  * */

  {path:"employeePayDelivery/", name:"employeePayDeliveryDtl", module:"收银缴款", page:"收银缴款明细"},
  /*
   * UX路径:http://ftp.hddomain.cn/wikifs/PDC/DNET/site/dpos/1.9.5-SNAPSHOT/server/dpos-ux/prototype/pc/index.html#g=1&p=缴款单详情_待签字_
   * 需要接口:
   * 1. 获取 收银缴款单信息
   * 2. 获取 收银缴款单的历史操作信息
   * 3. 签字 接口
   * 4. 处理 接口
   * 5. 删除 接口
   * 6. 作废 接口
   *
   * 7. 打印 接口 _ 这个应该是调用 dbrowser 的接口
   * */



  {path:"employeePayDelivery/", name:"employeePayDeliveryMod", module:"收银缴款", page:"收银缴款编辑"},
  /*
   * UX路径:http://ftp.hddomain.cn/wikifs/PDC/DNET/site/dpos/1.9.5-SNAPSHOT/server/dpos-ux/prototype/pc/index.html#g=1&p=缴款页面
   * 需要接口:
   * 1. 获取 收银缴款单信息
   * 2. 编辑保存接口
   * */

  // 报表
  {path:"report/", name:"rptBusinessAnalysis", module:"报表", page:"经营分析报表"},
  /*
   * UX路径:http://hddenv/svn/qfpd/PDPOS/2.release/PC版/运营/报表/经营分析报表.html
   * 大致需要接口:
   * 1. 获取 商品标签接口
   * 2. 获取 商品列表, 查询条件: 条码和名称
   * 3. 获取 汇总图(销售额/进货额) 查询条件: 日期段 [,] ; 商品标签 = ; 商品 = ;
   * 4. 获取 趋势图(大量数据)  查询条件: 日期段 [,] ; 商品标签 = ; 商品 = ; 时间段 [,]
   * 5. 获取 列表数据展示的接口 查询条件: 日期段 [,] ; 商品标签 = ; 商品 = ;

   * */

  {path:"report/", name:"rptPeriodAnalysis", module:"报表", page:"时段统计报表"},
  {path:"report/", name:"rptSkuAnalysis", module:"报表", page:"单品销售报表"},
  {path:"report/", name:"rptTagAnalysis", module:"报表", page:"标签统计报表"},


  // 销售功能
  {path:"sale/", name:"saleList", module:"销售", page:"销售单查询列表"},
  {path:"sale/", name:"saleDtl", module:"销售", page:"销售单明细"},
  {path:"sale/", name:"saleAdd", module:"销售", page:"销售单新增"},
  {path:"sale/", name:"saleMod", module:"销售", page:"销售单编辑"},

  // 销售退功能
  {path:"saleReturn/", name:"saleReturnList", module:"销售退货", page:"销售退货单查询列表"},
  {path:"saleReturn/", name:"saleReturnDtl", module:"销售退货", page:"销售退货单明细"},
  {path:"saleReturn/", name:"saleReturnAdd", module:"销售退货", page:"销售退货单新增"},
  {path:"saleReturn/", name:"saleReturnMod", module:"销售退货", page:"销售退货单编辑"},

  //加个null，上面写的内容就不用考虑最后是否不需要逗号了。
  null
];


