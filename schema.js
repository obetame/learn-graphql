const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull
} = require('graphql');

const _ = require("underscore");
const PostsList = require('./data/posts');
const AuthorsList = require('./data/authors');
const {CommentList, ReplyList} = require('./data/comments');
const AddressList = require("./data/address");

const Post = new GraphQLObjectType({
  name:"Post",
  description:"一个文章",
  fields:()=>({
    _id:{
      type:new GraphQLNonNull(GraphQLString)
    },
    title:{
      type:new GraphQLNonNull(GraphQLString)
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
        // console.log(source);
        if(limit){
          return _.first(source.Content,limit);
        }
        else{
          return source.Content;
        }
      }
    },
  })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    echo: {
      type: GraphQLString,
      description: '回应你输入的内容',
      args: {
        message: {type: GraphQLString}
      },
      resolve: function(source, {message}) {
        return `hello: ${message}`;
      }
    },
    posts:{
      type:new GraphQLList(Post),
      args:{
        index:{type:GraphQLInt}
      },
      resolve:(source,args)=>{
        return [PostsList[args.index]]
      }
    },
    postsnoargs:{
      type:new GraphQLList(Post),
      resolve:(source)=>{
        return [PostsList[0]]
      }
    },
    address:{
      type:new GraphQLList(Address),
      args:{
        nameKey:{type:GraphQLString}
      },
      resolve:(source,{nameKey})=>{
        return [_.find(AddressList,item=>item.ShortKey.toLowerCase()===nameKey.toLowerCase())]
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query,
});

module.exports = Schema;