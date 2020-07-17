const {
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLFloat,
	GraphQLBoolean,
	GraphQLEnumType,
	GraphQLID,
	GraphQLNonNull,
} = require('graphql');

const _ = require('underscore');
const PostsList = require('./data/posts');
const AuthorsList = require('./data/authors');
const { CommentList, ReplyList } = require('./data/comments');
const AddressList = require('./data/address');

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

const AddressContent = new GraphQLObjectType({
	name: 'AddressContent',
	description: '地址子信息',
	fields: () => ({
		Id: {
			type: GraphQLInt,
		},
		Code: {
			type: GraphQLString,
		},
		Name: {
			type: GraphQLString,
		},
		FirstStr: {
			type: GraphQLString,
		},
	}),
});

const Address = new GraphQLObjectType({
	name: 'Address',
	description: '地址信息',
	fields: () => ({
		ShortKey: {
			type: GraphQLString,
		},
		Content: {
			type: GraphQLList(AddressContent),
			args: {
				limit: { type: GraphQLInt },
			},
			resolve: (source, { limit }) => {
				if (limit) {
					return _.first(source.Content, limit);
				} else {
					return source.Content;
				}
			},
		},
	}),
});

const Query = new GraphQLObjectType({
	name: 'QuerySchema',
	description: '查询数据',
	fields: () => ({
		echo: {
			type: GraphQLString,
			description: '将你输入的字符串进行返回',
			args: {
				message: { type: GraphQLString },
			},
			resolve: function(source, { message }) {
				return `hello: ${message}`;
			},
		},
		findPosts: {
			type: GraphQLList(Post),
			description: '分页显示文章',
			args: {
				page: { type: GraphQLNonNull(GraphQLInt) },
				size: { type: GraphQLNonNull(GraphQLInt) },
			},
			resolve: (source, { page, size }) => {
				let isPageZero = page === 0;
				const start = isPageZero ? 0 : (page - 1) * size;
				const end = isPageZero ? (page + 1) * size : page * size;

				return PostsList.slice(start, end);
			},
		},
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
		getFirstPost: {
			type: Post,
			description: '获取第一条博客',
			resolve: source => {
				return PostsList[0];
			},
		},
		findCityByKey: {
			type: Address,
			description: '根据首字母模糊查询各个市',
			args: {
				nameKey: { type: GraphQLString },
			},
			resolve: (source, { nameKey }) => {
				return _.find(
					AddressList,
					item => item.ShortKey === nameKey.toUpperCase()
				);
			},
		},
	}),
});

const Mutation = new GraphQLObjectType({
	name: 'MutationSchema',
	description: '增删改地址信息',
	fields: () => ({
		createAddress: {
			type: AddressContent,
			description: '根据参数新增一个城市',
			args: {
				Id: {
					type: GraphQLNonNull(GraphQLInt),
          description: '地址Id'
				},
				Code: {
					type: GraphQLNonNull(GraphQLString),
				},
				Name: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称'
				},
				FirstStr: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称首字母'
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
		deleteAddressById: {
			type: GraphQLBoolean,
			description: '根据地址Id删除城市',
			args: {
				Id: {
					type: GraphQLNonNull(GraphQLInt),
					description: '地址Id'
				}
			},
			resolve: (source, { Id }) => {

				let deleteStatus = false;
				AddressList.forEach(
					addressGroup => {
						addressGroup.Content.forEach(
							address => {
								if (address.Id == Id) {
									let index = addressGroup.Content.indexOf(address);
									addressGroup.Content.splice(index, 1);
									deleteStatus = true;
								}
							}
						)
					}
				)

				return deleteStatus;
			},
		},
		updateAddressById: {
			type: GraphQLBoolean,
			description: '根据地址Id更改城市信息',
			args:{
				Id: {
					type: GraphQLNonNull(GraphQLInt),
					description: '地址Id'
				},
				Code: {
					type: GraphQLNonNull(GraphQLString),
				},
				Name: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称'
				},
				FirstStr: {
					type: GraphQLNonNull(GraphQLString),
					description: '城市名称首字母'
				},

			},
			resolve: (source, args) => {
				let updateStatus = false;
				AddressList.forEach(
					addressGroup => {
						addressGroup.Content.forEach(
							address => {
								if (address.Id == args.Id) {
									address.Code = args.Code;
									address.Name = args.Name;
									address.FirstStr = args.FirstStr;
									updateStatus = true;
								}
							}
						)
					}
				)

				return updateStatus;
			},
		},
	}),
});

const Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
});

module.exports = Schema;
