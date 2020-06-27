# GraphQL 使用指南(Mutaions)

> Mutations(突变) 不知道怎么翻译比较好，暂时直接英文吧，可以理解为增删改

## 开始

我们看看文档是怎么样的.

![Mutation Document](/images/mutation_schema_document.gif)

理解了查询，那么 `Mutaions` 也是比较好理解的.也就是通过 GraphQL 来修改服务器的数据.

来看一个简单的例子，创建一个地址信息:

```
mutation createAddressInfo {
  createAddress(Id: 100, Name: "新城市", Code: "1234556", FirstStr: "X") {
    Id
    Code
    Name
    FirstStr
  }
}
```

可以看到不需要以`{`开头、`}`结尾了，且参数不需要固定顺序

服务器返回的数据:

```json
{
  "data": {
    "createAddress": {
      "Id": 100,
      "Code": "1234556",
      "Name": "新城市",
      "FirstStr": "X"
    }
  }
}
```

我们来分析一下这个 `Mutation` 操作吧,其实很简单:

- `createAddressInfo`是一个名字，你可以随便定义，甚至不给这个名字都可以，这只是一个操作的集合，你可以在一个集合里执行多个创建
- `createAddress`是服务器已经定义好的操作，这个文档有详细信息，让你知道需要发送什么数据，最开始的Gif已经展示过了

**参数类型后面的`!`代表这个字段是必须的，否则服务器不接受这个请求**

## 合并 Mutation 操作

和查询一样，`Mutation` 也可以同时多种操作同时发送的.

```
mutation createAddressInfo {
  address1: createAddress(Id: 100, Name: "新城市", Code: "1234556", FirstStr: "X") {
    Id
    Code
    Name
    FirstStr
  }
  address2: createAddress(Id: 101, Name: "超一线城市", Code: "123457", FirstStr: "C") {
    Id
    Code
    Name
    FirstStr
  }
}
```

服务器返回:

```json
{
  "data": {
    "address1": {
      "Id": 100,
      "Code": "1234556",
      "Name": "新城市",
      "FirstStr": "X"
    },
    "address2": {
      "Id": 101,
      "Code": "123457",
      "Name": "超一线城市",
      "FirstStr": "C"
    }
  }
}
```

**注意: 如果我们的操作都是`createAddress`的话就需要设置别名**

## 定义变量

左上输入框输入：

```
mutation createA($id: Int!, $code: String!, $name: String = "城市") {
  createAddress(Id: $id, Name: $name, Code: $code, FirstStr: "A") {
    Id
    Code
    Name
    FirstStr
  }
}
```

可以看到我们定义了一个`mutation`操作叫做`createA`，它接受三个参数，前两个是必须传的，最后一个具有一个默认值"城市"

然后我们打开左下角的`Query Variables`输入框输入以下内容：

```json
{
  "id": 200,
  "code": "200000",
  "name": "阿布道市"
}
```

执行后可以看到创建成功。

![Mutation Address By Variables](/images/mutation_address_by_variables.png)

## 教程地址

1. [GraphQL 使用指南-开始](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-%E5%BC%80%E5%A7%8B.md)
2. [GraphQL 使用指南-查询.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-%E6%9F%A5%E8%AF%A2.md)
3. [GraphQL 使用指南-修改.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-%E4%BF%AE%E6%94%B9.md)
4. [GraphQL 使用指南-高级部分.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-%E9%AB%98%E7%BA%A7%E9%83%A8%E5%88%86.md)
5. [GraphQL 使用指南-服务器实现.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL使用指南-服务器实现.md)
