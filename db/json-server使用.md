# 1.json-server使用
* 1.1.安装
```shell
npm install -g json-server
```

* 1.2.使用
```shell
json-server --watch db.json  --port 3000
```
* 增删改查
```js
//查询
axios.get("http://locahost:3000/users")
//按条件查询
axios.get("http://locahost:3000/users?name=张三")
//关联查询,向下查询--包含子资源
axios.get("http://locahost:3000/users/1?_expand=profile")
//关联查询,向上查询--包含父资源
axios.get("http://locahost:3000/profiles/1?_expand=user")
//增加
axios.post("http://locahost:3000/users",{
    name:"张三",
    age:18
})
//修改,会覆盖原有数据
axios.put("http://locahost:3000/users/1",{
    name:"张三",
    age:18
})
//修改,只修改传入的数据
axios.patch("http://locahost:3000/users/1",{
    age:18
})
//删除
axios.delete("http://locahost:3000/users/1")


```