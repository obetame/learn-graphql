# GraphQL 使用指南(服务器)

> 在之前的几篇教程中，我们讲的是如何查询和 Mutation 操作，这些都是在客户端那边所进行的，那么服务器这边是如何处理这些请求的呢?这就是这篇教程所要说的东西了.

以下教程的代码都在`schema.js`文件中.

### Graphql 类型

GraphQL 中有对应 JavaScript 的类型:

```js
GraphQLObjectType, //自定义类型
GraphQLSchema, //定义视图
GraphQLInterfaceType, //描述多个类型的通用字段
GraphQLList, //其他类型的封装
GraphQLString, //字符串类型
GraphQLInt, //整型
GraphQLFloat, //浮点型
GraphQLEnumType, //可迭代类型
GraphQLNonNull, //不允许为空类型,接受一个graphql类型
```

还有一些比如`GraphQLInputType`等等这类不常用的类型，限于篇幅，我们这里就不做过多的介绍，有兴趣的读者可以去 Google 一下.

### 热身

```
{
	receivedMessage: echo(message: "world")
}
```

然后你会得到服务器的返回:

```json
{
	"data": {
		"receivedMessage": "hello: world"
	}
}
```

这是一个非常简单的查询，对应的实现代码:

```js
// 查询根目录(关于查询的动作都需要在这里声明)
const Query = new GraphQLObjectType({
	name: 'QuerySchema', // 跟查询名称
	description: '查询数据',
	fields: () => ({
		// 回应
		echo: {
			type: GraphQLString, // 返回类型为字符串
			description: '将你输入的字符串进行返回', // 功能描述
			args: {
				message: { type: GraphQLString }, // 接受的参数
			},
			resolve: function(source, { message }) {
				return `hello: ${message}`;
			},
		},
	}),
});
```

上面的代码在根查询里定义了一个名为`echo`的查询`field`.

1. `type`: 值为 `GraphQLString` 说明了它返回的数据是字符串类型
2. `args`: 参数列表，有一个 message 参数，类型为字符串
3. `resolve`: 执行逻辑，此函数返回的值会被作为 response，可以返回 Promise

**提示:** `resovle`接受三个参数，第一个参数是当前字段的根字段得到的结果值，而这里已经是根查询了，所以值为`undefined`，而第二个参数是参数对象，第三个是一个`request`对象.

### 测试 1

_现在请你自己修改一下这个`echo`，给他增加一个参数`name`，然后重启服务器，请求服务器:_

```
{
  receivedMessage: echo(message: "hello world", name: "Graphql")
}
```

让服务器返回如下数据:

```json
{
	"data": {
		"receivedMessage": "hello Graphql"
	}
}
```

### 查询

**有这样一个需求: 我们需要根据文章的 ID 号查询文章，服务器返回标题和正文等信息**

开始前我们需要分析一个文章包含什么信息，有什么字段，需要定义出来，如下:

```js
const Post = new GraphQLObjectType({
	name: 'Post',
	description: '博客文章',
	fields: () => ({
		_id: {
			type: GraphQLNonNull(GraphQLString),
		},
		title: {
			type: GraphQLNonNull(GraphQLString),
		},
		category: {
			type: GraphQLString,
		},
		layout: {
			type: GraphQLString,
		},
		content: {
			type: GraphQLString,
		},
	}),
});
```

一篇文章包含了 id，title，category，layout，content 这些信息，其中 id 和 title 是不允许空的字符串，如果查询到的数据没有这两个就会报错.

定义好后我们就需要在根查询里面建立一个引用，否则定义的就没法使用:

```js
// 查询根目录(关于查询的动作都需要在这里声明)
const Query = new GraphQLObjectType({
	name: 'BlogSchema',
	description: 'Root of the Blog Schema',
	fields: () => ({
		// 回应查询
		echo: {
			// ...
		},
		// 文章查询
		findPostById: {
			type: Post,
			description: '根据文章id查询文章',
			args: {
				id: { type: GraphQLID },
			},
			resolve: (source, args) => {
				const post = PostsList.find(post => post._id === args.id);

				if (!post) {
					throw new Error('Not found');
				}

				return post;
			},
		},
	}),
});
```

然后就调用`findPostById`查询文章，它接收一个 ID 类型的`id`参数

`resolve`返回存储在`PostsList`数组里的对应文章信息，因为`findPostById`返回的是`Post`类型

**有时候你需要嵌套几个`GraphQLObjectType`来得到自己想要的数据格式，比如项目中的 schema.js 定义了一个地址查询，定义了三层查询.**

### Mutation

> 客户端查询数据的时候有时候是也伴随着修改数据和创建数据，所以这里也要介绍一下如果操作更新数据.

我们来看看一个 Mutation 操作:

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

增加一个地级市的信息，这个地级市有以下字段:Id，Code，Name，FirstStr.

- `createAddressInfo`是一个 mutation 名，并不是关键字，你可以随便取其他名字.
- `createAddress`是服务器定义好的一个`field`，服务器实现代码如下：

```js
// 操作根目录(关于操作的动作都需要在这里声明)
const Mutation = new GraphQLObjectType({
	name: 'MutationSchema',
	description: '增删改地址信息',
	fields: () => ({
		createAddress: {
			type: AddressContent,
			args: {
				Id: {
					type: GraphQLNonNull(GraphQLInt),
					description: '地址Id',
				},
				Code: {
					type: GraphQLNonNull(GraphQLString),
				},
				Name: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称',
				},
				FirstStr: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称首字母',
				},
			},
			resolve: (source, args) => {
				let address = Object.assign({}, args);

				address.FirstStr = address.FirstStr.toUpperCase();

				let queryData = _.find(
					AddressList,
					item => item.ShortKey === address.FirstStr
				);

				if (queryData) {
					queryData.Content.push(address);
					return address;
				}

				return null;
			},
		},
	}),
});
```

你也可以在`fields`里新增其它的更新逻辑，相信你已经知道如何操作了

### 数据库

数据库不打算专门写一篇了，其实也就是将查询和修改数据库的操作放在`resolve`函数里操作就行了

`resolve`函数支持返回Promise，因此可以使用`async`操作数据库

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
