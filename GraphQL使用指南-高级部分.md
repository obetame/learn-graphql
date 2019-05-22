# GraphQL使用指南(高级部分)

> 虽然不一定能使用到这些方法,但是了解一下也许后面遇到的需求刚好可以可以用上,增加了陪女朋友的时间呢!

### 分片

> 在 GraphQL 中,分片是一段能够复用的片段.

如果我们需要查询三个不同文章的信息,那么我们可能会做如下的查询:

```js
{
  first:posts(index:1) {
    title,
    category,
    layout
  },
  second:posts(index:2) {
    title,
    category,
    layout
  },
  third:posts(index:3) {
    title,
    category,
    layout
  }
}
```

我们将上面的posts查询进行了一遍又一遍,开始你可能觉得没什么,但是当需要查询的数据有几十个字段的时候你会开始头疼(相信我).

那么我们有什么方法可以复用这一块经常用到的片段呢?

接下来我来给你答案:

```js
fragment post on Post{
  title,
  category,
  layout
}
```

上面的就是一个分片,`Post`是一个已经服务器定义好的类型,你可以看右上角的文档,每个操作名称的后面都会有一个返回的类型.

下面我们就开始使用这个分片:

```js
{
  first:posts(index:1) {
    ...post
  },
  second:posts(index:2) {
    ...post
  },
  third:posts(index:3) {
    ...post
  }
}

fragment post on Post {
  title,
  category,
  layout
}
```

使用了对象展开符`...`,如果你了解ES6的话你肯定对这个特别的熟悉,那么我们是不是可以试试ES6类似的特性?

那我们来试试:

```js
{
  first:posts(index:1) {
    ...post
  },
  second:posts(index:2) {
    ...post,
    category
  },
  third:posts(index:3) {
    ...post,
    layout
  }
}

fragment post on Post {
  title,
  category,
}
```

看起来一点问题都没有,服务器返回了正确的信息,这些我就不解释了,都是一些ES6的东西,如果你不懂ES6那么要抓紧时间了.

### 分片总结

分片也可以嵌套分片,所以只要是服务器定义过的数据类型,你都可以写成一个个的分片,这种模式能大量减少你写重复代码的时间.

### 查询变量

> 正如上面所说的,分片可以减少大量的时间,那么现在我准备说的查询变量就可以增加你生命(好吧我承认我在瞎扯).

对于上面的那个带参数的查询操作,我们查询了`index`等于1,2,3时候的数据,分片减少了你输入相同字段的时间,而查询变量减少了你写分片的时间...

废话补多少,先看代码:

```js
query getFewPosts($index: Int!) {
  first:posts(index:$index){
    ...post
  }
}

fragment post on Post{
  title,
  category,
}
```

然后在查询窗口中输入:

```js
{
  "index":1
}
```

这就是一个简单的变量查询,也可以和分片一起使用,你可以增加几个变量增加使用分片:

```js
query getFewPosts(
  $index: Int!,
  $index1: Int!,
  $index2: Int!
) {
  first:posts(index:$index) {
    ...post
  },
  second:posts(index:$index1) {
    ...post,
    category
  },
  third:posts(index:$index2) {
    ...post,
    layout
  }
}

fragment post on Post {
  title,
  category,
}
```

然后在查询窗口中输入:

```js
{
  "index": 1,
  "index1": 2,
  "index2": 3
}
```

![](http://ww3.sinaimg.cn/large/006y8lVagw1facmao3hrsj30v50jcgol.jpg)

### 总结

这部分都是讲的客户端,后面开始使用express搭建服务器去探索后端的实现.