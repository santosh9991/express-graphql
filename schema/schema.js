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

const mutation = new graphql.GraphQLObjectType({
  //Mutation helps in modifying or creating objects
  name: 'Mutation',
  fields: {
    addUser: {
    //type of record that we are going to return
    type: UserType,
    //Arguments required to create a user object
    args: {
      //firstName and age are required fields
      firstName: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
      age: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
      companyId: {type: graphql.GraphQLString}
    },
    resolve(parentValue,{firstName,age}){
      return axios.post('http://localhost:3000/users',{firstName,age}).
      then(res=>res.data)
    }
  },
  deleteUser: {
    type: UserType,
    args: {
      id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
    },
    resolve(parentValue,args){
      return axios.delete(`http://localhost:3000/users/${args.id}`)
      .then(res=>res.data)
    }
  },
  editUser:{
    type: UserType,
    args: {
      id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
      firstName: {type: graphql.GraphQLString},
      companyId: {type: graphql.GraphQLString},
      age: {type:graphql.GraphQLInt}
    },
    resolve(parentValue,args){
      return axios.patch(`http://localhost:3000/users/${args.id}`,args).then(res=>res.data);
    }
  }
}
})
module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation//mutation:mutation
});
