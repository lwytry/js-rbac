const Base = require('./base.js');
const roleRep = think.service('roleRep');

module.exports = class extends Base {

  // 获取角色所有资源
  async getSourceAction() {
    let param = {
      roleIds: this.get('roleIds'),
      isTree: this.get('isTree')
    }
    let result = await roleRep.getRoleSource(param);
    if (result == 0 && (!typeof result == 'object')) {
      return this.fail(1001, "获取失败")
    }
    return this.success(result);
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
      return this.fail(1001, "添加失败")
    }
    return this.success(result)
  }

  // 添加角色
  async addAction() {
    let projectId = await this.ctx.ProjectId;
    let createdAt = this.getDate();
    const param = {
      name: this.post('name'),
      projectId: projectId,
      userId: this.post('userId'),
      description: this.post('description'),
      createdAt: createdAt,
      updatedAt: createdAt
    }
    let result = await roleRep.craete(param);
    if (result == 0) {
      return this.fail(1001, "名称不能重复")
    }
    return this.success(result);
  }

  async getListAction() {
    let projectId = await this.ctx.ProjectId;

    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      userId: this.get('userId'),
      name: this.get('name'),
      projectId: projectId,
    }
    let list = await roleRep.getList(param);
    return this.success(list);
  }

};
