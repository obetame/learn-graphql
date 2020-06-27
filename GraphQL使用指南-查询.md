# GraphQL 使用指南(查询)

> Graphql 为查询而生,核心是客户端可以定制化查询自己所需要的数据。

下面让我们来一探究竟吧！

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

### GraphQL 初试

![编辑器界面](/images/editor.png)

首先认识一下这个刚刚打开的调试界面，这是[graphiql](https://github.com/graphql/graphiql)提供的调试界面，在这里你可以很方便的进行 graphql 学习。

1. 左边是一个编辑器，你可以输入查询内容，它提供了智能类型提示、联想、快捷键、代码格式化、查询历史等功能
2. 左下是一个变量输入区域，后面会介绍到
3. 右边是根据左边的查询返回的值。

第一次进来可以看到左边有一些注释，这些注释是读取 URL 上 query 参数中的值的，因此你的输入可以通过分享 URL 给你的同事，方便同事之间推锅...

_`graphql`的输入需要以`{`开始，`}`结束_

尝试在左边窗口输入以下内容，或者点击这个打开[echo 查询](<http://localhost:12580/graphql?query=%0A%7B%0A%20%20echo(message%3A%20%22world%22)%0A%7D>):

```
{
    echo(message: "world")
}
```

你会在右边窗口看到这个返回的数据:

```
{
  "data": {
    "echo": "hello: world"
  }
}
```

_`echo`并不是 Graphql 提供的语法，它是后端定义的一个类似于函数的`field`并提供给客户端进行调用而已_

### Graphql 文档

有两种方式可以查看使用文档：

1. 鼠标移动你刚输入的`echo`上面你可以看到有弹出框显示着它的文档内容，并且可以点击上面的链接进行跳转查看
2. 手动点击右上角的`Docs`去搜索`echo`

要查看所有支持的`query`（查询）和`mutation`（新增修改），可以点击右上角：

![QuerySchema](/images/query_schema.gif)

根据上面的查询得知使用方式是：`echo(message: String): String`

这说明`echo`接受一个`String`类型的`message`参数,并且返回的数据类型也为`String`

直接打开右上角的`Docs`可以查看此后端支持哪些`query`（查询）和`mutation`（新增修改）：

### 含参查询

> 上面 `echo` 只是一个简单的演示，并没有真正的查询，现在我们开始根据客户端的要求返回定制的数据吧

查询语法：

```
{
	field(arg: "value") {
		subField
	}
}
```

- `field`：后端定义可以使用的查询"领域"，可能不太好理解，你可以把它当初一个可以远程调用的函数名，我们可以通过查看`Docs`知道支持哪些域
- `arg`：参数
- `subField`：可以对包含在`field`中的字段继续过滤

现在让你查询文章你应该知道怎么开始了吧？首先我们需要查看文档，从点击右上角开始吧

```
{
  findPostById(id: "0176413761b289e6d64c2c14a758c1c7") {
    title
    layout
  }
}
```

右边输出如下数据:

```json
{
	"data": {
		"findPostById": [
			{
				"title": "Sharing the Meteor Login State Between Subdomains",
				"layout": "blog_post"
			}
		]
	}
}
```

### 无参数查询

目前为止我们的查询都需要一个参数,毕竟查询的时候大多数都是需要参数的,现在我们来试试一个不需要参数的例子.

```
{
  getFirstPost {
    title
    layout
  }
}
```

右边输出：

```json
{
	"data": {
		"getFirstPost": {
			"title": "Sharing the Meteor Login State Between Subdomains",
			"layout": "blog_post"
		}
	}
}
```

### 嵌套查询

有时候我们需要对查询到的数据进行筛选,比如限制大小,这时候就需要一个嵌套查询来实现这个功能了.

比如下面这个查询`A`开头的全国省市信息:

```
{
  findCityByKey(nameKey: "Z") {
    ShortKey
    Content(limit: 4) {
      Name
    }
  }
}
```

服务器返回:

```json
{
	"data": {
		"findCityByKey": {
			"ShortKey": "Z",
			"Content": [
				{
					"Name": "张家口市"
				},
				{
					"Name": "镇江市"
				},
				{
					"Name": "舟山市"
				},
				{
					"Name": "漳州市"
				}
			]
		}
	}
}
```

其中的`Content`字段加上了限制返回前 4 个市的信息,注意其中的 `limit` 是服务器设置的,并不是 Graphql 的关键字，当然你可以去掉`limit`以获取所有的值。

### 多种查询混合

这其实很简单,也就是将上面的几个查询混合写到一起就可以了:

```
{
  getFirstPost {
    title
  }
  findCityByKey(nameKey: "Z") {
    ShortKey
    Content(limit: 4) {
      Name
    }
  }
}
```

服务器返回:

```json
{
  "data": {
    "getFirstPost": {
      "title": "Sharing the Meteor Login State Between Subdomains"
    },
    "findCityByKey": {
      "ShortKey": "Z",
      "Content": [
        {
          "Name": "张家口市"
        },
        {
          "Name": "镇江市"
        },
        {
          "Name": "舟山市"
        },
        {
          "Name": "漳州市"
        }
      ]
    }
  }
}
```

### 查询别名

通常后端定义的`field`名称都是符合自文档化，主要是为了更加的适合阅读和使用，但是graphql默认返回的值是以`field`命名。

这种情况下对于前端来说使用上会有一定的局限性，因此我们可以使用查询别名来自定义返回值的名称

比如上面的那个例子，返回的值包含了`getFirstpost`、`findCityByKey`，这与我们平时使用的还不太一样，因此我们可以使用别名：

```
{
  post: getFirstPost {
    title
  }
  city: findCityByKey(nameKey: "Z") {
    ShortKey
    Content(limit: 4) {
      Name
    }
  }
}
```

会返回以下的值：

```json
{
  "data": {
    "post": {
      "title": "Sharing the Meteor Login State Between Subdomains"
    },
    "city": {
      "ShortKey": "Z",
      "Content": [
        {
          "Name": "张家口市"
        },
        {
          "Name": "镇江市"
        },
        {
          "Name": "舟山市"
        },
        {
          "Name": "漳州市"
        }
      ]
    }
  }
}
```

还有更多的使用方式，防止他们将数据进行合并：

```
{
  cityId: findCityByKey(nameKey: "Z") {
    Content(limit: 5) {
      Id
    }
  }
  cityName: findCityByKey(nameKey: "Z") {
    Content(limit: 5) {
      Name
    }
  }
}
```

以下就是我们预期获取的值:

```json
{
  "data": {
    "cityId": {
      "Content": [
        {
          "Id": 9
        },
        {
          "Id": 84
        },
        {
          "Id": 95
        },
        {
          "Id": 119
        },
        {
          "Id": 136
        }
      ]
    },
    "cityName": {
      "Content": [
        {
          "Name": "张家口市"
        },
        {
          "Name": "镇江市"
        },
        {
          "Name": "舟山市"
        },
        {
          "Name": "漳州市"
        },
        {
          "Name": "淄博市"
        }
      ]
    }
  }
}
```

对于字段名也可以自定义名称，比如：

```
{
  myPost: findPostById(id: "0176413761b289e6d64c2c14a758c1c7") {
    title
    id: _id
  }
}
```

得到：

```json
{
  "data": {
    "myPost": {
      "title": "Sharing the Meteor Login State Between Subdomains",
      "id": "0176413761b289e6d64c2c14a758c1c7"
    }
  }
}
```

### 定义变量

很多时候我们查询的条件是一样的，如果每一次都重复的写代码去查询，那效率是非常低的，而且没法根据代码判断条件来进行查询

因此Graphql提供了变量，类似于可以定义一个函数，传递不同的参数进行查询：

```
query findFirstPagePost($size: Int = 5) {
  findPosts(page: 1, size: $size) {
    title
    layout
  }
}
```

然后我们打开左下角的`Query Variables`输入框输入以下内容，由于`$size`具有默认值，因此也可以不传递参数：

```json
{
  "size": 3
}
```

![Query Post By Variables](/images/query_post_by_variables.png)

### 总结

以上就是你使用 Graphql 查询所需要知道的内容,后面我将开始介绍 Mutations 操作.

## 教程地址

1. [GraphQL 使用指南-开始](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5
%8D%97-%E5%BC%80%E5%A7%8B.md)
2. [GraphQL 使用指南-查询.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-%E6%9F%A5%E8%AF%A2.md)
3. [GraphQL 使用指南-修改.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87
%E5%8D
%97-%E4%BF%AE%E6%94%B9.md)
4. [GraphQL 使用指南-高级部分.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL%E4%BD%BF%E7%94%A8%E6%8C%87
%E5%8D%97-%E9%AB%98%E7%BA%A7%E9%83%A8%E5%88%86.md)
5. [GraphQL 使用指南-服务器实现.md](https://github.com/zhouyuexie/learn-graphql/blob/master/GraphQL使用指南-服务器实现.md)
