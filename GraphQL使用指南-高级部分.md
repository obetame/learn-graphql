# GraphQL 使用指南(高级部分)

> Graphql的高级部分虽然平时可能用的并不多，但是有些时候可以提升我们的开发效率，减少重复代码

## 分片

> 分片(Fragment)是一段能够复用的片段

如果我们需要查询三个不同文章的信息，那么我们可能会做如下的查询:

```
{
  firstPost: findPostById(id: "0176413761b289e6d64c2c14a758c1c7") {
    title
    id: _id
  }
  secondPost: findPostById(id: "03390abb5570ce03ae524397d215713b") {
    title
    id: _id
  }
  thirdPost: findPostById(id: "0be4bea0330ccb5ecf781a9f69a64bc8") {
    title
    id: _id
  }
}
```

可以看到我们查询 posts 一遍又一遍，一个好的程序员应该遵循一个规则："Don't repeat yourself"，尽量避免写重复的代码，否则后期难以维护、重构困难

那么我们有什么方法可以复用这一块经常用到的片段呢？我们可以使用`Graphql`中的`fragment`：

```
fragment post on Post {
  title
  id: _id
}
```

上面的就是一个分片，`Post`是一个`findPostById`返回值的类型，你可以在右上角的文档中查找到它的定义

我们使用这个`fragment`来复用需要使用的属性，下面我们就开始使用这个分片:

```
fragment post on Post {
  title
  id: _id
}

{
  firstPost: findPostById(id: "0176413761b289e6d64c2c14a758c1c7") {
    ...post
  }
  secondPost: findPostById(id: "03390abb5570ce03ae524397d215713b") {
    ...post
  }
  thirdPost: findPostById(id: "0be4bea0330ccb5ecf781a9f69a64bc8") {
    ...post
  }
}
```

使用了对象展开符`...`，类似于ES6的解构特性，还可以在使用的时候增加`subField`：

那我们来试试:

```
fragment post on Post {
  title
  id: _id
}

{
  firstPost: findPostById(id: "0176413761b289e6d64c2c14a758c1c7") {
    ...post
    layout
  }
  secondPost: findPostById(id: "03390abb5570ce03ae524397d215713b") {
    ...post
    category
  }
  thirdPost: findPostById(id: "0be4bea0330ccb5ecf781a9f69a64bc8") {
    ...post
  }
}
```

分片可以进行嵌套，所以只要是服务器定义过的数据类型，你都可以定义成分片进行使用，这种模式能大量减少你写重复代码的时间.

分片还有内联分片(Inline Fragments)，可以点击[这里查看](https://graphql.cn/learn/queries/#inline-fragments)

## 使用变量

很多时候我们查询的条件是一样的，如果每一次都重复的写代码去查询，那效率是非常低的，而且没法根据代码判断条件来进行查询

因此Graphql提供了`query`关键字来定义一块类似于函数的`field`，`$size`参数是可选的，默认值为5：

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

我们还可以与分片一起使用：

```
fragment post on Post {
  title
  id: _id
}

query takeThreePostWithIds(
  $firstId: ID
  $secondId: ID
  $thirdId: ID
) {
  firstPost: findPostById(id: $firstId) {
    ...post
    layout
  }
  secondPost: findPostById(id: $secondId) {
    ...post
    category
  }
  thirdPost: findPostById(id: $thirdId) {
    ...post
  }
}
```

并在`Query Variables`中输入：

```json
{
  "firstId": "0176413761b289e6d64c2c14a758c1c7",
  "secondId": "03390abb5570ce03ae524397d215713b",
  "thirdId": "0be4bea0330ccb5ecf781a9f69a64bc8"
}
```

## 指令

> 在上面的例子中我们使用variables可以进行动态查询，还有一种情况我们也是需要动态的修改查询内容，比如说部分UI组件需要一些简略信息，而另一些需要详情信息

我们进行如下的查询城市信息：

```
query findFirstPagePost {
  findCityByKey(nameKey: "Z") {
    ShortKey
    Content(limit: 4) {
      Name
      Code
      Id
    }
  }
}
```

但是我们突然有另一个需求是只需要他们的`Name`，其它的并不需要：

```
query findFirstPagePost($withOther: Boolean!) {
  findCityByKey(nameKey: "Z") {
    ShortKey
    Content(limit: 4) {
      Name
      Code @include(if: $withOther)
      Id @include(if: $withOther)
    }
  }
}
```

![directives](/images/query_with_directives.png)

除了`@include(if: Boolean)`之外还有

- `@include(if: Boolean)`：为true的时候返回内容里才会有这个值
- `@skip(if: Boolean)`：为true的时候跳过显示这个字段

这两个是Graphql提供的执行，你还可以自定义指令

## 元字段

通过使用`__typename`来获取服务器的`field`查询返回的值是什么类型

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
