# GraphQL使用指南(开始)

> 本 GraphQL使用指南是基于JavaScript,但是并不妨碍你理解它,所以其它语言的同学可以先从本教程开始理解和学习什么是 GraphQL以及是否合适你.

### 介绍

`GraphQL` 是一个Facebook于2012开发出来且2015开源的应用层的查询语言,你需要在后台定义一个基于GraphQL的图形模式,然后你的客户端就可以查询他们想要的数据,而不需要后台重新定义一个接口返回你需要的数据.

![graphql介绍](http://ww3.sinaimg.cn/large/006y8lVagw1face0i49unj31kw0wxmzx.jpg)

因为不需要更改你后台,所以这种方式比 `REST API` 方式更好,让我们可以在不同的客户端上灵活改变数据显示.

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

而如果你使用的是REST定义的接口,那么你可能需要使用多个接口才能获取到你想要的数据,否则需要跟后端进行交涉才能得到自己想要的数据格式.

**GraphQL 是一个规范.**

这意味着你可以在任何语言上实现 GraphQL.[点击这里](http://facebook.github.io/graphql/)你可以查看更多关于 GraphQL 的介绍.Facebook 有一个对于[JavaScript](https://github.com/graphql/graphql-js)的 GraphQL 实现.

本教程只致力于理解GraphQL,因此所有实现不一定能应用于生产,社区有挺多相关的生产框架,比如[graphpack](https://github.com/glennreyes/graphpack),当你完成此教程后,建议从此框架开始开发.

### 资料

1. [From REST to GraphQL](https://0x2a.sh/from-rest-to-graphql-b4e95e94c26b#.o5wtsc878)
2. [learngraphql](https://learngraphql.com)
3. [Facebook GraphQL](https://facebook.github.io/graphql/)
4. [awesome-graphql](https://github.com/chentsulin/awesome-graphql)