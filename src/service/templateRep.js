const model = think.model('template');
const uuidv1 = require('uuid/v1');

module.exports = class extends think.Service {
  async craete(param) {
    let data = {
      name: param.name,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    }
    let projectId = await think.model('template').add(data);
    return projectId;
  }
  async getList(param) {
    const page = [
      param.page,
      param.num,
    ]
    let where = {
      deleted: ['!=', 1],
    }
    if (!think.isEmpty(param.name)) {
      where.name = ['like', '%' + param.name +'%'];
    }
    let data =  await model.where(where).order('id DESC').page(page).countSelect();
    return data;
  }
  async getInfo(id) {
    let info = await model.where({id: id, deleted: 0}).find();
    return info;
  }
  async update(param) {
    let id = param.id
    const data = {
      name: param.name,
    }
    let info = await model.where({id: id}).update(data);
    return info;
  }
  async delete(id) {
    let info = await model.where({id: id}).update({deleted: 1});
    return info;
  }

  // 角色资源创建关联
  async addTemplateSource(param) {
    const model = think.model('template_resource');
    let ret = await model.lock(true).where({tId: param.tId}).select();

    if (!think.isEmpty(ret)) {
      let affectedRows = await model.where({tId: param.tId}).delete();
      if (affectedRows == 0) {
        return 0;
      }
    }
    if (think.isEmpty(param.resourceIds)) {
      return 1;
    }
    let insertData = []
    for (var index in param.resourceIds) {
      insertData.push({'tId': param.tId, 'resourceId': param.resourceIds[index]});
    }

    let insertIds = await model.addMany(insertData);
    return insertIds;
  }


  // 获取模板相关资源
  async getTemplateSource(param) {
    let ret = await model.query(`SELECT
    	c.id,
    	c.pId,
    	c.label
    FROM
    	permission_template AS a
    	LEFT JOIN permission_tresource AS c ON a.id = c.tId 
    WHERE
    	a.id IN ( ` + param.tIds + ` ) and c.id is NOT NULL`);
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

  // 从模板同步资源到当前项目
  async synchroTemplateSource(param) {
    let tId = param.templateId;
    let projectId = param.projectId;
    let createdAt = param.createdAt;
    let updatedAt = param.updatedAt;
    let templateSourceModel = think.model('tresource');
    let templateResources = await templateSourceModel.where({tId: tId, status: 1}).order('pId ASC').select();
    if (think.isEmpty(templateResources)) {
      return -1;
    }
    await model.startTrans();
    try {
      let pIds = {};
      for (var index in templateResources) {
        let insertPIdsFlag = 0;
        let insertData = {
          projectId: projectId,
          name: templateResources[index].name,
          label: templateResources[index].label,
          icon: templateResources[index].icon,
          addr: templateResources[index].addr,
          type: templateResources[index].type,
          sort: templateResources[index].sort,
          display: templateResources[index].display,
          createdAt: createdAt,
          updatedAt: updatedAt
        };
        if (templateResources[index].pId == 0) {
          insertData.pId == 0;
          insertPIdsFlag = 1;
        } else {
          insertData.pId = pIds[templateResources[index].pId]
          if (think.isEmpty(insertData.pId)) {
            continue;
          }
        }
        let roleSourceModel = think.model('resource').db(model.db());
        let requestId = "";
        while (true) {
          requestId = uuidv1();
          let info = await roleSourceModel.where({requestId: requestId, projectId: projectId}).find();
          if (think.isEmpty(info)) {
            break;
          }
        }
        insertData["requestId"] = requestId;
        let insertId = await roleSourceModel.add(insertData);

        if (insertId <=0) {
          await model.rollback();
          break;
        }

        if (insertPIdsFlag == 1) {
          pIds[templateResources[index].id] = insertId;
        }
      }

      await model.commit();
    } catch (e) {
      await model.rollback();
      return 0;
    }

    return 1;
  }

  async getRequestId(projectId) {
    let model = think.model('resource').db(model.db());
    while (true) {
      var requestId = uuidv1();
      let info = await model.where({requestId: requestId, projectId: projectId}).find();
      if (think.isEmpty(info)) {
        return requestId;
      }
    }
  }

}
