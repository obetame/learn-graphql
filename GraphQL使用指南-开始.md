# GraphQL 使用指南(开始)

> 本 GraphQL 使用指南是基于 JavaScript,但是并不妨碍你理解它,所以其它语言的同学可以先从本教程开始理解和学习什么是 GraphQL 以及是否合适你.

### 介绍

`GraphQL` 是一个 Facebook 于 2012 开发出来且 2015 开源的应用层的查询语言,你需要在后台定义一个基于 GraphQL 的图形模式,然后你的客户端就可以查询他们想要的数据,而不需要后台重新定义一个接口返回你需要的数据.

![graphql介绍](http://ww3.sinaimg.cn/large/006y8lVagw1face0i49unj31kw0wxmzx.jpg)

Graphql 不需要更改、新增后端 API 来获取数据,因此这种方式比 `REST API` 方式更适合快速变化的业务需求,让我们可以在不同的客户端上灵活改变数据显示.

我们来看看简单的 GraphQL 查询:

```js
{
  post {
    title,
    content,
    author {
      name
    },
    comments {
      content,
      author {
        name
      }
    }
  }
}
```

后台返回的数据:

```js
{
  data:{
    post:{
      title: "query data",
      content: "query data",
      author: {
        name: "query data"
      },
      comments: [
        {
          content: "query data",
          author: {
            name: "query data"
          }
        },
        {
          content: "query data",
          author: {
            name: "query data"
          }
        }
      ]
    }
  }
}
```

而如果你使用的是 REST 定义的接口,那么你可能需要使用多个接口才能获取到你想要的数据,否则需要跟后端进行交涉才能得到自己想要的数据格式.

**需要注意的是：GraphQL 是一个规范.**

这意味着你可以在任何语言上实现 GraphQL.[点击这里](http://facebook.github.io/graphql/)你可以查看更多关于 GraphQL 的介绍.Facebook 有一个对于[JavaScript](https://github.com/graphql/graphql-js)的 GraphQL 实现.

本教程只致力于理解 GraphQL,因此所有实现不一定能应用于生产,社区有挺多相关的生产框架,比如[graphpack](https://github.com/glennreyes/graphpack),当你完成此教程后,建议从此框架开始开发.

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

### 资料

1. [From REST to GraphQL](https://0x2a.sh/from-rest-to-graphql-b4e95e94c26b#.o5wtsc878)
2. [learngraphql](https://learngraphql.com)
3. [Facebook GraphQL](https://facebook.github.io/graphql/)
4. [awesome-graphql](https://github.com/chentsulin/awesome-graphql)
