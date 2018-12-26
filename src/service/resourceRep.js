const uuidv1 = require('uuid/v1');
const model = think.model('resource');

module.exports = class extends think.Service {
  async craete(param) {
    while (true) {
      var requestId = uuidv1();
      let info = await model.where({requestId: requestId, projectId: param.projectId}).find();
      if (think.isEmpty(info)) {
        break;
      }
    }
    let where = {
      projectId: param.projectId,
      label: param.label,
    }
    if (!think.isEmpty(param.pId)) {
      where.pId = param.pId
    }

    let info = await model.where(where).find();
    if (!think.isEmpty(info)) {
      return 0;
    }
    // 当pid = 0 时 把pidzhiwei

    param.requestId = requestId;

    try {
      var insertId = await model.add(param);
    } catch (e) {
      return 0;
    }
    return insertId;
  }
  async getList(param) {
    const page = [
      param.page,
      param.num,
    ]
    let where = {}
    where['permission_resource.deleted'] = ['!=', 1];
    if (!think.isEmpty(param.name)) {
      where['permission_resource.name'] = ['like', '%' + param.name +'%'];
    }
    if (!think.isEmpty(param.label)) {
      where['permission_resource.label'] = param.label;
    }
    if (!think.isEmpty(param.projectId)) {
      where['permission_resource.projectId'] = param.projectId;
    }
    let data = await model.join('permission_project ON permission_project.id = permission_resource.projectId').where(where).field(
      'permission_resource.id,' +
      'permission_resource.label,' +
      'permission_resource.status,' +
      'permission_resource.projectId,' +
      'permission_resource.name,' +
      'permission_resource.icon,' +
      'permission_resource.createdAt,' +
      'permission_resource.type,' +
      'permission_resource.sort,' +
      'permission_resource.display,' +
      'permission_project.name as pName,' +
      'permission_resource.addr').order('id DESC').page(page).countSelect();
    return data;
  }
  async getInfo(id) {
    let info = await model.where({id: id}).find();
    return info;
  }
  async update(param) {
    let id = param.id
    const data = {
      name: param.name,
      pId: param.pId,
      label: param.label,
      icon: param.icon,
      addr: param.addr,
      type: param.type,
      sort: param.sort,
      display: param.display,
    }
    let where = {
      label: param.label,
    }
    if (!think.isEmpty(param.pId)) {
      where.pId = param.pId
    }
    let info = await model.where(where).find();
    if (!think.isEmpty(info) && info.id != id) {
      return 0;
    }
    let ret = await model.where({id: id}).update(data);
    return ret;
  }
  // 获取父资源
  async getPresource(param) {
    let page = [
      1,
      10
    ]
    let where = {
      deleted: ['!=', 1],
    }
    if (!think.isEmpty(param.name)) {
      where.name = ['like', '%' + param.name +'%'];
    }
    if (!think.isEmpty(param.projectId)) {
      where.projectId = param.projectId;
    }
    let result = await model.where(where).order('id DESC').page(page).select();
    return result;
  }
  async disable(id) {
    let info = await model.where({id: id}).update({status: 0});
    return info;
  }
  async enable(id) {
    let info = await model.where({id: id}).update({status: 1});
    return info;
  }

  async getSourceTree(projectId) {
    let where = {
      projectId: projectId,
      deleted: ['!=', 1],
      status: 1,
      pId: 0,
    }
    const result = await model.where(where).field('id, pId, label, sort').order('sort asc, id asc').select();

    var sourceTree = async function getChild(result) {
      for (var index in result) {
        let ret = await model.where({
          deleted: ['!=', 1],
          status: 1,
          pId: result[index].id,
        }).field('id, pId, label, sort').order('sort asc, id asc').select();
        result[index].children = ret;
        if (!think.isEmpty(ret)) {
          result[index].children = await getChild(result[index].children)
        }
      }
      return result;
    }(result)
    return sourceTree;
  }

}
