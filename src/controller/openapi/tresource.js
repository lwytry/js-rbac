const Base = require('./base.js');
const TResourceRep = think.service('tresourceRep');

module.exports = class extends Base {
  async addAction() {
    let createdAt = this.getDate();
    let name = this.post('name');
    let pId = this.post('pId');
    let label = this.post('label');
    let icon = think.isEmpty(this.post('icon')) ? '' : this.post('icon') ;
    let addr = this.post('addr');
    let type = this.post('type');
    let tId = this.post('tId');
    let sort = think.isEmpty(this.post('sort')) ? 0 : this.post('sort');
    let display = think.isEmpty(this.post('display')) ? 0 : this.post('display');

    const param = {
      name: name,
      pId: pId,
      label: label,
      icon: icon,
      addr: addr,
      type: type,
      sort: sort,
      tId: tId,
      display: display,
      craetedAt: createdAt,
      updatedAt: createdAt
    }

    let result = await TResourceRep.craete(param);
    if (result == 0) {
      return this.fail(1, '显示名称重复');
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
      label: this.get('label'),
      tId: this.get('tId'),
    }
    let list = await TResourceRep.getList(param);
    return this.success(list);
  }
  async getInfoAction() {
    let id = this.get('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await TResourceRep.getInfo(id);
    return this.success(result);
  }
  async updateAction() {
    let name = this.post('name');
    let id = this.post('id');
    let label = this.post('label');
    let icon = this.post('icon');
    let addr = this.post('addr');
    let type = this.post('type');
    let sort = this.post('sort');
    let display = this.post('display');
    let tId = this.post('tId');
    let pId = think.isEmpty(this.post('pId')) ? 0 : this.post('pId');

    const param = {
      name: name,
      pId: pId,
      id: id,
      label: label,
      icon: icon,
      addr: addr,
      type: type,
      sort: sort,
      display: display,
      tId: tId,
    }

    if (id == pId) {
      return this.fail(1, '父资源不能添加本身');
    }
    let result = await TResourceRep.update(param);
    if (result == 0) {
      return this.fail(1, '显示名称重复');
    }
    return this.success(result)
  }
  async disableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await TResourceRep.disable(id);
    return this.success(result);
  }
  async enableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await TResourceRep.enable(id);
    return this.success(result);
  }

  async getParentResourceAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      tId: this.get('tId'),
      name: this.get('name')
    }

    let result = await TResourceRep.getPresource(param);
    return this.success(result)
  }

  // 获取项目下所有资源并呈现树状接口
  async getSourceTreeAction() {
    let tId =  this.get('tId'),

    result = await TResourceRep.getSourceTree(tId);
    return this.success(result)
  }

};
