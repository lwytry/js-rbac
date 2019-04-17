const Base = require('./base.js');
const ProjectRep = think.service('projectRep');
const TemplateRep = think.service('templateRep');

module.exports = class extends Base {
  // 添加项目
  async addAction() {
    let createdAt = this.getDate();
    let name = this.post('name');
    const param = {
      name: name,
      craetedAt: createdAt,
      updatedAt: createdAt,
    }
    let result = await ProjectRep.craeteReqId(param);
    if (result == 0) {
      return this.fail(1, "添加失败")
    }
    return this.success(result.insertId);
  }

  // 添加项目
  async addByTemplateAction() {
    let createdAt = this.getDate();
    let name = this.post('name');
    let templateId = this.post('tId');
    const param = {
      name: name,
      craetedAt: createdAt,
      updatedAt: createdAt,
      templateId: templateId,
    }
    let projectResult = await ProjectRep.craeteReqId(param);
    if (projectResult == 0) {
      return this.fail(1, "添加失败")
    }
    let data = {
      templateId: templateId,
      projectId: projectResult.insertId,
      createdAt: createdAt,
      updatedAt: createdAt
    };
    let result = await TemplateRep.synchroTemplateSource(data);
    if (result == 0) {
      ProjectRep.delete(projectResult.insertId)
      return this.fail(1, "同步失败")
    }
    return this.success(projectResult.requestId);
  }

  async getListAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      name: this.get('name')
    }
    let list = await ProjectRep.getList(param);
    return this.success(list);
  }

  // 获取详情
  async getInfoAction() {
    let id = this.get('id')

    let result = await ProjectRep.getInfo(id);
    return this.success(result);
  }

  // 更新
  async updateAction() {
    let name = this.post('name');
    let id = this.post('id');
    const param = {
      id: id,
      name: name
    }
    let result = await ProjectRep.update(param);
    return this.success(result)
  }

  // 禁用
  async disableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ProjectRep.disable(id);
    return this.success(result);
  }

  // 启用
  async enableAction() {
    let id = this.post('id');
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ProjectRep.enable(id);
    return this.success(result);
  }

};
