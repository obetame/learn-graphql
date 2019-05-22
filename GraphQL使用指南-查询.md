# GraphQL使用指南(查询)

> Graphql 为查询而生,核心是定制化查询自己所需要的数据,所以我们首先试试它的查询功能吧.

### 准备工作

1. 克隆库:

```shell
git clone https://github.com/zhouyuexie/learn-graphql
```

2. 安装依赖:

```shell
cd learn-graphql && npm install
```

3. 运行:

```shell
npm start
```

现在打开你的浏览器输入`http://localhost:12580/graphql`,或者[点击这里](http://localhost:12580/graphql).

![](http://ww3.sinaimg.cn/large/006y8lVagw1facg09cnhlj30v20ow40r.jpg)

### GraphQL 初试

在左边窗口输入以下内容:

```js
{
  echo(message:"world")
}
```

你会在右边窗口看到这个返回的数据:

```js
{
  "data": {
    "echo": "hello: world"
  }
}
```

**提示:**右上角有个Docs,点击它你可以看到你可以看到有关查询的信息.

![](http://ww4.sinaimg.cn/large/006y8lVagw1facipgde5uj309l08zq3j.jpg)

你可以看到上面那行`echo(message:String):String`,说明echo接受一个message的参数,并且返回一个string类型的数据,点击echo你可以看到更详细的内容.

### 有参数查询

> 上面 `echo` 只是一个简单的演示,并没有查询字段,现在我们开始根据客户端的要求返回定制的数据吧.

现在让你查询`posts`你应该知道怎么开始了吧?对的,我们想看文档,点击右上角开始吧.

上图就有你想要的东西,你会看到`posts`模式接受一个整数型的`index`,然后返回一个`Post`类型数据,我们开始试试吧:

```js
{
  posts(index:1) {
    _id,
    title,
    content
  }
}
```

大概返回如下数据:

```js
{
  "data": {
    "posts": [
      {
        "_id": "03390abb5570ce03ae524397d215713b",
        "title": "New Feature: Tracking Error Status with Kadira",
        "content": "Here is a ...."
      }
    ]
  }
}
```

### 无参数查询

目前为止我们的查询都需要一个参数,毕竟查询的时候大多数都是需要参数的,现在我们来试试一个不需要参数的例子.

```js
{
  postsnoargs {
    _id,
    title,
    content
  }
}
```

好了,执行一下吧!你会发现没什么不同,就是服务器返回的数据是"固定"的而已,对于获取一些首页这类数据我们不需要给定参数是非常有用的.

### 嵌套查询

有时候我们需要对查询到的数据进行筛选,比如限制大小,这时候就需要一个嵌套查询来实现这个功能了.

比如下面这个查询`A`开头的全国省市信息:

```js
{
  address(nameKey: "A") {
    ShortKey,
    Content(limit: 5) {
      Id,
      Code,
      Name,
      FirstStr
    }
  }
}
```

服务器返回:

```js
{
  "data": {
    "address": [
      {
        "ShortKey": "A",
        "Content": [
          {
            "Id": 36,
            "Code": "152900",
            "Name": "阿拉善盟",
            "FirstStr": "A"
          },
          {
            "Id": 39,
            "Code": "210300",
            "Name": "鞍山市",
            "FirstStr": "A"
          },
          {
            "Id": 105,
            "Code": "340800",
            "Name": "安庆市",
            "FirstStr": "A"
          },
          {
            "Id": 155,
            "Code": "410500",
            "Name": "安阳市",
            "FirstStr": "A"
          },
          {
            "Id": 293,
            "Code": "513200",
            "Name": "阿坝藏族羌族自治州 ",
            "FirstStr": "A"
          }
        ]
      }
    ]
  }
}
```

其中的`Content`字段加上了限制返回前五个市的信息,注意其中的limit是服务器设置的,并不是Graphql的关键字.

### 多种查询混合

这其实很简单,也就是将上面的几个查询混合写到一起就可以了:

```js
{
  address(nameKey:"A") {
    ShortKey,
    Content(limit:2) {
      Id,
      Code,
      Name,
      FirstStr
    }
  },

  posts(index:1) {
    _id,
    title
  }
}
```

服务器返回:

```js
{
  "data": {
    "address": [
        {
        "ShortKey": "A",
        "Content": [
          {
            "Id": 36,
            "Code": "152900",
            "Name": "阿拉善盟",
            "FirstStr": "A"
          },
          {
            "Id": 39,
            "Code": "210300",
            "Name": "鞍山市",
            "FirstStr": "A"
          }
        ]
      }
    ],
    "posts": [
        {
        "_id": "03390abb5570ce03ae524397d215713b",
        "title": "New Feature: Tracking Error Status with Kadira"
      }
    ]
  }
}
```

### 查询别名

有时候我们想这样查找使数据分开,方便自己各个地方调用:

```js
{
  postsnoargs {
    title
  },
  postsnoargs {
    _id
  }
}
```

我们设想得到的数据是这样的:

```js
{
  "data": {
    "postsnoargs": {
      "title": [
        "title": "Sharing the Meteor Login State Between Subdomains",
      ],
      "_id": [
       "_id": "0176413761b289e6d64c2c14a758c1c7"
      ]
    }
  }
}
```

但其实服务器返回的是这样的:

```js
{
  "data": {
    "postsnoargs": [
      {
        "title": "Sharing the Meteor Login State Between Subdomains",
        "_id": "0176413761b289e6d64c2c14a758c1c7"
      }
    ]
  }
}
```

这时候我们就需要设置别名了,否则服务器返回的时候会合并你的数据:

```js
{
  posttitle:postsnoargs {
    title
  },
  postid:postsnoargs {
    _id
  }
}
```

服务器返回:

```js
{
  "data": {
    "posttitle": [
      {
        "title": "Sharing the Meteor Login State Between Subdomains"
      }
    ],
    "postid": [
      {
        "_id": "0176413761b289e6d64c2c14a758c1c7"
      }
    ]
  }
}
```

![](http://ww1.sinaimg.cn/large/006y8lVagw1facj8uzam0j30uz0bv77h.jpg)

### 总结

以上就是你使用Graphql查询所需要知道的内容,后面我将开始介绍Mutations操作.