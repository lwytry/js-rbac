const uuidv1 = require('uuid/v1');
const model = think.model('tresource');

module.exports = class extends think.Service {
  async craete(param) {
    let where = {
      tId: param.tId,
      label: param.label,
    }
    if (!think.isEmpty(param.pId)) {
      where.pId = param.pId
    }

    let info = await model.where(where).find();
    if (!think.isEmpty(info)) {
      return 0;
    }

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
    where['permission_tresource.deleted'] = ['!=', 1];
    if (!think.isEmpty(param.name)) {
      where['permission_tresource.name'] = ['like', '%' + param.name +'%'];
    }
    if (!think.isEmpty(param.label)) {
      where['permission_tresource.label'] = param.label;
    }
    if (!think.isEmpty(param.tId)) {
      where['permission_tresource.tId'] = param.tId;
    }
    let data = await model.join('permission_template ON permission_template.id = permission_tresource.tId').where(where).field(
      'permission_tresource.id,' +
      'permission_tresource.label,' +
      'permission_tresource.status,' +
      'permission_tresource.tId,' +
      'permission_tresource.name,' +
      'permission_tresource.icon,' +
      'permission_tresource.createdAt,' +
      'permission_tresource.type,' +
      'permission_tresource.sort,' +
      'permission_tresource.display,' +
      'permission_template.name as tName,' +
      'permission_tresource.addr').order('id DESC').page(page).countSelect();
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
    if (!think.isEmpty(param.tId)) {
      where.tId = param.tId
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
      param.page,
      param.num,
    ]
    let where = {
      deleted: ['!=', 1],
    }
    if (!think.isEmpty(param.name)) {
      where.name = ['like', '%' + param.name +'%'];
    }
    if (!think.isEmpty(param.tId)) {
      where.tId = param.tId;
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

  async getSourceTree(tId) {
    let where = {
      tId: tId,
      deleted: ['!=', 1],
      status: 1,
      pId: 0,
    }
    const result = await model.where(where).field('id, pId, label, icon, addr, type, display, sort').order('sort asc, id asc').select();

    var sourceTree = async function getChild(result) {
      for (var index in result) {
        let ret = await model.where({
          deleted: ['!=', 1],
          status: 1,
          pId: result[index].id,
        }).field('id, pId, label, icon, addr, type, display, sort').order('sort asc, id asc').select();
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
