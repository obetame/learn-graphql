# GrqphQL 使用指南(服务器)

> 在之前的几篇教程中,我们讲的是如何查询和Mutation操作,这些都是在客户端那边所进行的,那么服务器这边是如何处理这些请求的呢?这就是这篇教程所要说的东西了.

### 准备工作

1. 克隆库:

```shell
git clone https://github.com/zhouyuexie/learn-graphql
```

2. 安装依赖:

```shell
cd learn-graphql && npm install

cd learn-graphql && git checkout server && npm install
```

3. 运行:

```shell
npm start
```

现在打开你的浏览器输入`http://localhost:12580/graphql`,或者[点击这里](http://localhost:12580/graphql).

> 以下教程的代码都在`schema.js`文件中.

### 类型

GraphQL中有对应JavaScript的类型:

```js
GraphQLObjectType,//自定义类型
GraphQLSchema,//定义视图
GraphQLInterfaceType,//描述多个类型的通用字段
GraphQLList,//其他类型的封装
GraphQLString,//字符串类型
GraphQLInt,//整型
GraphQLFloat,//浮点型
GraphQLEnumType,//可迭代类型
GraphQLNonNull,//不允许为空类型,接受一个graphql类型
```

还有一些比如`GraphQLInputType`等等这类不常用的类型,限于篇幅,我们这里就不做过多的介绍,有兴趣的读者可以去Google一下.

### 查询热身

打开`http://localhost:12580/graphql`后在左边输入:

```js
{
  receivedMessage: echo(message: "wowo")
}
```

然后你会得到服务器的返回:

```js
{
  "data": {
    "receivedMessage": "Hello wowo"
  }
}
```

这是一个非常简单的查询,我们可以看下面的实现代码:

```js
// 查询根目录(关于查询的动作都需要在这里声明)
const Query = new GraphQLObjectType({
  name: 'BlogSchema',//根查询名称
  description: 'Root of the Blog Schema',
  fields: () => ({
    // 回应查询
    echo: {
      type: GraphQLString,
      description: '回应你输入的内容',
      // 参数定义
      args: {
        message: {type: GraphQLString}
      },
      resolve: function(source, {message}) {
        return `hello: ${message}`;
      }
    }
  })
});
```

上面的代码在根查询里定义了一个名为`echo`的查询字段.

1. `type`:值为 `GraphQLString` 说明了它返回的数据是字符串类型.
2. `args`:参数列表,有一个message参数,类型为字符串.
3. `resolve`:返回数据.

**提示:**resovle接受三个参数,第一个参数是当前字段的根字段得到的结果值,而这里已经是根查询了,所以值为`undefined`,而第二个参数是参数对象,第三个是一个`request`对象.

### 测试1

*现在请你自己修改一下这个查询,增加一个参数`name`,然后重启服务器,请求服务器:*

```js
{
  receivedMessage: echo(message: "hello",name:"wowo")
}
```


让服务器返回如下数据:

```js
{
  "data": {
    "receivedMessage": "wowo said hello"
  }
}
```

### 查询

> 有人说上面那个根本不算是查询,这个确实,但是入门一个教程没有人一开始就打击你对吧,下面就是一个更高级点的查询,更加接近 "现实生活" .

**有这样一个需求:我们需要根据文章的ID号查询文章,服务器返回标题和正文等信息.**

开始前我们需要分析一个文章包含什么信息,有什么字段,需要定义出来,如下:

```js
const Post = new GraphQLObjectType({
  name: "Post",
  description: "一篇文章",
  fields:()=>({
    _id: {
      type: new GraphQLNonNull(GraphQLString),//不允许为空
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),//不允许为空
    },
    category: {
      type: GraphQLString
    },
    layout: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    },
  })
});
```

一篇文章包含了id,title,category,layout,content这些信息,其中id和title是不允许空的字符串,如果查询到的数据没有这两个就会报错.

定义好后我们就需要在根查询里面建立一个引用,否则定义的就没法使用:

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
    posts: {
      type: new GraphQLList(Post),
      args:{
        index: { type:GraphQLInt }
      },
      resolve: (source, args) => {
        return [PostsList[args.index]],//返回数组(虽然只有一个)
      }
    }
  });
})
```

文章查询`posts`接收一个`index`参数,这个参数是一个整型.

`resolve`返回存储在`PostsList`数组里的对应文章信息,因为`posts`返回的是一个数组(数组里的数据全是`Post`对象),而我们查询到的数据是一个`Post`对象,所以需要用一个数组号括起来.

**有时候你需要嵌套几个`GraphQLObjectType`来得到自己想要的数据格式,比如项目中的schema.js定义了一个地址查询,定义了三层查询.**

### Mutation

> 客户端查询数据的时候有时候是也伴随着修改数据和创建数据,所以这里也要介绍一下如果操作更新数据.

我们来看看一个Mutation操作:

```js
mutation CREATE{
  createAddress(Id:1, Code:"13156", Name:"信息价", FirstStr:"S"){
    Id,
    Name,
    Code,
  }
}
```

增加一个地级市的信息,这个地级市有以下字段:Id,Code,Name,FirstStr.

`CREATE`是一个mutation名,并不是关键字,你可以随便取其他名字.

`createAddress`是服务器定义好的一个关键字,接收四个字段,大括号里返回的是创建好的信息.

我们再来看看服务器这边:

```js
// 操作根目录(关于操作的动作都需要在这里声明)
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "增删改数据",
  fields:() => ({
    createAddress: {
      type:AddressContent,
      args: {
        Id: {
          type:new GraphQLNonNull(GraphQLInt)
        },
        Code: {
          type:new GraphQLNonNull(GraphQLString)
        },
        Name: {
          type:new GraphQLNonNull(GraphQLString)
        },
        FirstStr: {
          type:new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (source,args) => {
        let address = Object.assign({}, args);//获取数据

        //改为大写
        address.FirstStr = address.FirstStr.toUpperCase();

        let queryData = _.find(AddressList,item=>item.ShortKey===address.FirstStr);//查找的数据

        //检测是否存在FirstStr开头的
        if(queryData){
          // 有这个数据
          //存储数据
          queryData.Content.push(address);
          // console.log(address)
          return address;//返回新存储的数据
        } else{
          return null;
        }
      }
    }
  })
})
```

### 数据库

数据库不打算专门写一篇了,其实也就是将查询和修改数据库的操作放在`resolve`函数里操作就行了.

