const Base = require('./base.js');
const TemplateRep = think.service('templateRep');

module.exports = class extends Base {
  // 添加项目
  async addAction() {
    let createdAt = this.getDate();
    let name = this.post('name');
    const param = {
      name: name,
      craetedAt: createdAt,
      updatedAt: createdAt
    }
    let result = await TemplateRep.craete(param);
    if (result == 0) {
      return this.fail(1, "添加失败")
    }
    return this.success(result);
  }

  async getListAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      name: this.get('name')
    }
    let list = await TemplateRep.getList(param);
    return this.success(list);
  }

  async getInfoAction() {
    let id = this.get('id')

    let result = await TemplateRep.getInfo(id);
    return this.success(result);
  }

  async updateAction() {
    let name = this.post('name');
    let id = this.post('id');
    const param = {
      id: id,
      name: name
    }
    let result = await TemplateRep.update(param);
    return this.success(result)
  }

  async deleteAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await TemplateRep.delete(id);
    return this.success(result);
  }

  // 为角色分配资源
  async setSourceAction() {
    let resourceIds = JSON.parse(this.post('resourceIds'));
    let tId = this.post('tId');

    const param = {
      tId: tId,
      resourceIds: resourceIds
    }
    let result = await TemplateRep.addTemplateSource(param);
    if (result == 0) {
      return this.fail(2, "添加失败")
    }
    return this.success(result)
  }

  // 获取角色所有资源
  async getSourceAction() {
    let param = {
      roleIds: this.get('tIds'),
      isTree: this.get('isTree')
    }
    let result = await TemplateRep.getTemplateSource(param);
    if (result == 0 && (!typeof result == 'object')) {
      return this.fail(2, "获取失败")
    }
    return this.success(result);
  }

};
