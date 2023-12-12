欢迎使用 Reservation Handler！该插件可以在酒店订单打印界面帮助你获取关键信息，如客人姓名、订房数量、房价等，并将这些信息写出到剪贴板，以便与RPA软件（如AutoHotkey、UiBot）进行配套使用，实现本地自动化。请按照以下说明正确使用该插件。

## 支持的代理商列表

Reservation Handler 目前支持以下酒店代理商：

* **深圳捷旅**
* **广州奇利**
* **携程酒店**
* **美团酒店商家**
* **飞猪酒店**

注：以下两个代理商仅支持从163邮箱中打开：

* **Agoda 培量订单（Quantum）**
* **FedEx Hotel Reservation邮件**
请确保你的订单来自以上列出的代理商之一，以确保插件正常工作。

## 获取订单信息

1. **选择订单页面**
    1. 导航到你的酒店订单页面。
    2. 打开插件前，确认已选择了正确的订单页面（订单打印）。
2. **生成订单信息**
    1. 在浏览器工具栏中找到并点击 Reservation Handler 插件图标。
    2. 在插件界面中，你将看到一个按钮或选项，用于生成订单信息。点击它。
    3. 插件会自动分析当前订单页面的内容，并生成相应的 JSON 字符串。
3. **写出到剪贴板**
    1. 在生成的 JSON 数据下方，你会看到一个“复制”按钮。点击它，将订单信息写出到剪贴板。
## 注意事项

在某些情况下，为了正确获取订单信息，你可能需要执行以下额外步骤：

**点击“此框架”**

* 对于一些代理商，如 奇利的“查询所有订单”页面、Agoda 培量订单 和 FedEx Hotel Reservation，你可能需要在订单页面中点击“此框架”，在当前或新窗口、新标签页中打开订单，以确保插件正常获取订单信息。
## JSON 数据结构

插件生成的 JSON 数据包含以下字段：

```json
{
  "identifier": "ReservationHandler",
  "agent": "fliggy",
  "orderId": 3677060125483689000,
  "guestNames": ["陈某人"],
  "roomType": "城景标准中床房",
  "roomQty": 1,
  "remarks": "下午茶1套",
  "ciDate": "20240205",
  "coDate": "20240206",
  "roomRates": [1330, 1220],
  "bbf": [2, 2]
}
```
* **identifier**: 插件标识符，便于自动化软件对剪贴板监听时获取。
* **agent**: 代理商名称信息。
* **orderId**: 订单ID。
* **guestNames**: 客人姓名列表。
* **roomType**: 房间类型。
* **roomQty**: 订房数量。
* **remarks**: 订单备注。
* **ciDate**: 入住日期，格式为 yyyyMMdd。
* **coDate**: 退房日期，格式为 yyyyMMdd。
* **roomRates**: 房价列表。
* **bbf**: 早餐数量列表，与房价列表对应。
>注意：字段名称和值的具体含义将取决于订单页面的内容和插件的版本。


**特有字段**

在部分代理商的 JSON 中包含特有字段：

* **携程**
```json
{
  "payment":"现付" 
  // 区分支付方式。一般为"现付"或"预付"。
}
```
* **飞猪**
```json
{
  "payment":"信用住", 
  // 区分支付方式。一般为"信用住"或"预付"。
  "invoiceMemo":"由酒店开具,发票金额CNY 1000.00"
  // 发票开票方及开票金额信息。
}
```
* **Agoda**
```json
{
  "contacts":{
    "phone":13300003333,
    "email":"sample@sample.com"
  }
  // 订单预留的客人联系方式。
}
```

### **FedEx 的 JSON 数据结构**

由于FedEx 的订单和一般 OTA 代理商的内容有较大差别，单独列明说明：

```json
{
  "identifier":"ReservationHandler",
  "agent":"fedex",
  "resvType":"ADD",
  "roomQty":2,
  "flightIn":"FX9053",
  "flightOut":"CX0983",
  "ciDate":"20231216",
  "ETA":"04:38",
  "coDate":"20231217",
  "ETD":"06:40",
  "stayHours":"26:02",
  "daysActual":2,
  "roomRates":[1265, 1265],
  "crewNames":["JOHN DOE","MICHAEL BAY"],
  "tripNum":"2046/11",
  "tracking":"6050568"
 }
```
* **identifier**: 插件标识符，便于自动化软件对剪贴板监听时获取。
* **agent**: 代理商名称信息。
* **resvType**: 订单类型，一般为 CHANGE 或  ADD。
* **roomQty**: 订房数量。
* **flightIn****:**In-Bound 航班号。
* **flightOut****:**Out-Bound 航班号。
* **remarks**: 订单备注。
* **ciDate**: 入住日期，格式为 yyyyMMdd。
* **ETA**: 抵达时间，格式为 HH:MM。
* **coDate**: 退房日期，格式为 yyyyMMdd。
* **ETD**: 时间，格式为 HH:MM。
* **stayHours**: 在酒店居停时长，格式为 HH:MM。
* **daysActual**: 以24小时为收费单位计算的收费房晚数。
* **roomRates**: 房价列表。
* **crewNames**: 客人姓名列表。
* **tripNum**: Trip 识别码。
* **tracking**: 订单号码。

## 常见问题

**Q: 插件没有生成订单信息怎么办？**

A: 确保你已经在正确的订单页面上打开了插件，并尝试刷新页面后重新生成。

**Q: 我应该如何解释特定字段的含义？**

A: 请参考上述的 JSON 数据结构，每个字段都有相应的说明。