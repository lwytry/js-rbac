const model = think.model('role');
module.exports = class extends think.Service {
  async craete(param) {
    let where = {
      projectId: param.projectId,
      name: param.name
    }
    if (!think.isEmpty(param.userId)) {
      where.userId = param.userId;
    }
    let info = await model.where(where).find();
    if (!think.isEmpty(info)) {
      return 0;
    }

    let data = {
      name: param.name,
      projectId: param.projectId,
      description: param.description,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    }
    if (!think.isEmpty(param.userId)) {
      data.userId = param.userId;
    }
    let projectId = await model.add(data);
    return projectId;
  }
  async getList(param) {
    let model = think.model('role');
    const page = [
      param.page,
      param.num,
    ]
    let where = {}
    where['permission_role.deleted'] = ['!=', 1];
    where['permission_role.userId'] = 0;

    if (!think.isEmpty(param.name)) {
      where['permission_role.name'] = ['like', '%' + param.name +'%'];
    }
    if (!think.isEmpty(param.projectId)) {
      where['permission_role.projectId'] = param.projectId;
    }
    let data =  await model.join('permission_project ON permission_project.id = permission_role.projectId').where(where).field('permission_role.*,permission_project.name as pName').order('id DESC').page(page).countSelect();
    return data;
  }
  async getListByUserId(param) {
    let model = think.model('role');
    const page = [
      param.page,
      param.num,
    ]

    let where = 'deleted != 1';
    where = where + ' and projectId=' + param.projectId;
    if (!think.isEmpty(param.name)) {
      where = where + ' and name like "%' + param.name +'%"';
    }
    if (!think.isEmpty(param.userId)) {
      where = where + ' and (userId = 0 OR userId = ' + param.userId + ')';
    } else {
      where = where + ' and userId=0';
    }
    console.log(page);
    let data =  await model.where(where).order('id DESC').page(page).countSelect();
    return data;
  }
  async getInfo(id) {
    let info = await model.where({id: id}).find();
    return info;
  }
  async update(param) {
    let id = param.id;
    let name = param.name;
    let description = param.description;
    const where = {
      id: id,
    }

    let info = await model.where(where).find();
    if (think.isEmpty(info)) {
      return 0;
    }

    const data = {
      name: name,
      description: description,
    }
    let ret = await model.where({id: id}).update(data);
    return ret;
  }
  async disable(id) {
    let info = await model.where({id: id}).update({status: 0});
    return info;
  }
  async enable(id) {
    let info = await model.where({id: id}).update({status: 1});
    return info;
  }

  // 角色资源创建关联
  async addRoleSource(param) {
    const model = think.model('role_resource');
    let ret = await model.lock(true).where({roleId: param.roleId}).select();

    if (!think.isEmpty(ret)) {
      let affectedRows = await model.where({roleId: param.roleId}).delete();
      if (affectedRows == 0) {
        return 0;
      }
    }

    let insertData = []
    for (var index in param.resourceIds) {
      insertData.push({'roleId': param.roleId, 'resourceId': param.resourceIds[index]});
    }

    let insertIds = await model.addMany(insertData);
    return insertIds;
  }

  // 获取角色相关资源
  async getRoleSource(param) {
    let ret = await model.query(`SELECT
    	DISTINCT b.resourceId,
    	c.id,
    	c.pId,
    	c.label
    FROM
    	permission_role AS a
    	LEFT JOIN permission_role_resource AS b ON a.id = b.roleId
    	LEFT JOIN permission_resource AS c ON c.id = b.resourceId 
    WHERE
    	a.id IN ( ` + param.roleIds + ` ) and c.id is NOT NULL`);
    if (think.isEmpty(param.isTree)) {
      return ret;
    }
    return this.getTree(ret,0);
  }

  getTree(listArray, id){
    const subSrray = [];
    for(let index in listArray){
      if (id == listArray[index].pId){
        subSrray.push(listArray[index]);
        listArray[index].children = this.getTree(listArray,listArray[index].id);
      }
    }
    return subSrray;
  }

}
