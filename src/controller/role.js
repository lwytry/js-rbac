const Base = require('./base.js');
const roleRep = think.service('roleRep');

module.exports = class extends Base {
  async addAction() {
    let createdAt = this.getDate();
    const param = {
      name: this.post('name'),
      projectId: this.post('projectId'),
      description: this.post('description'),
      createdAt: createdAt,
      updatedAt: createdAt
    }
    let result = await roleRep.craete(param);
    if (result == 0) {
      return this.fail(2, "名称不能重复")
    }
    return this.success(result);
  }

  async getListAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      name: this.get('name'),
      projectId: this.get('projectId'),
    }
    let list = await roleRep.getList(param);
    return this.success(list);
  }
  async getInfoAction() {
    let id = this.get('id')

    let result = await roleRep.getInfo(id);
    return this.success(result);
  }
  async updateAction() {
    let name = this.post('name');
    let id = this.post('id');
    let description = this.post('description');
    const param = {
      id: id,
      name: name,
      description: description,
    }
    let result = await roleRep.update(param);
    if (result == 0) {
      return this.fail(2, "名称不能重复或资源不存在")
    }
    return this.success(result)
  }
  async disableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await roleRep.disable(id);
    return this.success(result);
  }
  async enableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await roleRep.enable(id);
    return this.success(result);
  }

  // 获取项目所有可用资源
  async getResourceListAction() {
    const param = {
      page: 1,
      num: 10,
      name: this.get('name')
    }
    let list = await roleRep.getResourceList(param);
    return this.success(list);
  }

  // 为角色分配资源
  async setSourceAction() {
    let resourceIds = JSON.parse(this.post('resourceIds'));
    let roleId = this.post('roleId');
    const param = {
      roleId: roleId,
      resourceIds: resourceIds
    }
    let result = await roleRep.addRoleSource(param);
    if (result == 0) {
      return this.fail(2, "添加失败")
    }
    return this.success(result)
  }

  // 获取角色所有资源
  async getSourceAction() {
    let param = {
      roleIds: this.get('roleIds'),
      isTree: this.get('isTree')
    }
    let result = await roleRep.getRoleSource(param);
    if (result == 0 && (!typeof result == 'object')) {
      return this.fail(2, "获取失败")
    }
    return this.success(result);
  }

};
