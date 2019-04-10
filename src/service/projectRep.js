const uuidv1 = require('uuid/v1');
const model = think.model('project');

module.exports = class extends think.Service {
  async craete(param) {
    while (true) {
      var requestId = uuidv1();
      let info = await model.where({requestId: requestId}).find();
      if (think.isEmpty(info)) {
        break;
      }
    }
    let data = {
      name: param.name,
      requestId: requestId,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    }
    let projectId = await think.model('project').add(data);
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
    let model = think.model('project');
    let info = await model.where({id: id}).find();
    return info;
  }
  // gerInfo for requestId
  async getInfoByRequestId(requestId) {
    let model = think.model('project');
    let info = await model.where({requestId: requestId}).find();
    return info;
  }
  async update(param) {
    let id = param.id
    const data = {
      name: param.name,
    }
    let model = think.model('project');
    let info = await model.where({id: id}).update(data);
    return info;
  }
  async disable(id) {
    let model = think.model('project');
    let info = await model.where({id: id}).update({status: 0});
    return info;
  }
  async enable(id) {
    let model = think.model('project');
    let info = await model.where({id: id}).update({status: 1});
    return info;
  }

  async getProjectList(param) {
    let model = think.model('project');
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
    console.log(where)
    let data =  await model.where(where).order('id DESC').page(page).select();
    return data;
  }
}
