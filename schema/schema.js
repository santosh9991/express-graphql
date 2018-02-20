const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');
// const companies = require('./companies');
const users = [
  {id:12,firstName:'lasya',age:'13'},
  {id:1,firstName:'kow',age:7}];
const CompanyType = new graphql.GraphQLObjectType({
  name:"Company",
  fields:()=>({
    id: {type: graphql.GraphQLString},
    name: {type: graphql.GraphQLString},
    description: {type: graphql.GraphQLString},
    users:{
      type: new graphql.GraphQLList(UserType),
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then(res=>res.data)
      }
    }
  })
});
const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  fields:()=> ( {
    id: {type: graphql.GraphQLString},
    firstName: {type: graphql.GraphQLString},
    age:{type: graphql.GraphQLInt},
    company:{
      type: CompanyType,
      resolve(parentValue,args){
        console.log(parentValue);
        // companies.getCompany(parentValue.companyId,())
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(res=>res.data)
      }
    }
  })

});

const RootQuery = new graphql.GraphQLObjectType({
  name : 'RootQueryType',
  fields: {
    user:{
      type: UserType,
      args:{id: {type:graphql.GraphQLString}},
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(res=>res.data);
      }
    },
    company:{
      type: CompanyType,
      args:{id:{type:graphql.GraphQLString}},
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(res=>res.data);
      }
    }
  }
});
module.exports = new graphql.GraphQLSchema({
  query: RootQuery
});
