const {
  GraphQLList,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
} = require('graphql');

const _ = require("underscore");
const PostsList = require('./data/posts');
const AuthorsList = require('./data/authors');
const {CommentList, ReplyList} = require('./data/comments');
const AddressList = require("./data/address");

const Post = new GraphQLObjectType({
  name:"Post",
  description:"一篇文章",
  fields:()=>({
    _id:{
      type:new GraphQLNonNull(GraphQLString),//不允许为空
    },
    title:{
      type:new GraphQLNonNull(GraphQLString),//不允许为空
    },
    category:{
      type:GraphQLString
    },
    layout:{
      type:GraphQLString
    },
    content:{
      type:GraphQLString
    },
  })
});

const AddressContent = new GraphQLObjectType({
  name:"AddressContent",
  description:"地址子信息",
  fields:()=>({
    Id:{
      type:GraphQLInt
    },
    Code:{
      type:GraphQLString
    },
    Name:{
      type:GraphQLString
    },
    FirstStr:{
      type:GraphQLString
    },
  })
});

const Address = new GraphQLObjectType({
  name:"Address",
  description:"地址信息",
  fields:()=>({
    ShortKey:{
      type:GraphQLString
    },
    Content:{
      type:new GraphQLList(AddressContent),
      args:{
        limit:{type:GraphQLInt}
      },
      resolve:(source,{limit})=>{
        // console.log(source);//返回的是address查询得到的值
        if(limit){
          //如果有限制结果数
          return _.first(source.Content,limit);
        }
        else{
          return source.Content;
        }
      }
    },
  })
});

// 查询根目录(关于查询的动作都需要在这里声明)
const Query = new GraphQLObjectType({
  name: 'BlogSchema',
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
      resolve: function(source, {message},request) {
        console.log("it:",it);
        return `hello: ${message}`;
      }
    },
    // 文章查询
    posts:{
      type:new GraphQLList(Post),
      args:{
        index:{type:GraphQLInt}
      },
      resolve:(source,args)=>{
        return [PostsList[args.index]]
      }
    },
    // 文章查询(不需要参数)
    postsnoargs:{
      type:new GraphQLList(Post),
      resolve:(source)=>{
        return [PostsList[0]]
      }
    },
    // 地址查询
    address:{
      type:new GraphQLList(Address),
      args:{
        nameKey:{type:GraphQLString}
      },
      resolve:(source,{nameKey})=>{
        return [_.find(AddressList,item=>item.ShortKey===nameKey.toUpperCase())]
      }
    }
  })
});

// 操作根目录(关于操作的动作都需要在这里声明)
const Mutation = new GraphQLObjectType({
  name:"Mutation",
  description:"增删改数据",
  fields:()=>({
    createAddress:{
      type:AddressContent,
      args:{
        Id:{
          type:new GraphQLNonNull(GraphQLInt)
        },
        Code:{
          type:new GraphQLNonNull(GraphQLString)
        },
        Name:{
          type:new GraphQLNonNull(GraphQLString)
        },
        FirstStr:{
          type:new GraphQLNonNull(GraphQLString)
        }
      },
      resolve:(source,args)=>{
        let address = Object.assign({},args);//获取数据
        
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
        }
        else{
          return null;
        }
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation:Mutation
});

module.exports = Schema;