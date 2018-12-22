const ResourceRep = think.service('resourceRep');
module.exports = class extends think.Logic {
  async addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      label: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      icon: {
        string: true,       // 字段类型为 String 类型
        length: {max: 20}, //长度不能大于2
      },
      addr: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 128}, //长度不能大于2
      },
      type: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 10}, //长度不能大于2
      },
      pId: {
        int: true,     // 字段必填
      },
      projectId: {
        int: true,     // 字段必填
        required: true,     // 字段必填
      },
      sort: {
        int: true,     // 字段必填
      },
      display: {
        required: true,     // 字段必填
        int: {min: 0, max: 1},     // 字段必填
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
    let createdAt = this.getDate();
    let name = this.post('name');
    let pId = this.post('pId');
    let label = this.post('label');
    let icon = think.isEmpty(this.post('icon')) ? this.post('icon') : '';
    let addr = this.post('addr');
    let type = this.post('type');
    let projectId = this.post('projectId');
    let sort = think.isEmpty(this.post('sort')) ? this.post('sort') : 0;
    let display = think.isEmpty(this.post('display')) ? this.post('display') : 0;

    const param = {
      name: name,
      pId: pId,
      label: label,
      icon: icon,
      addr: addr,
      type: type,
      sort: sort,
      projectId: projectId,
      display: display,
      craetedAt: createdAt,
      updatedAt: createdAt
    }

    console.log(param);
    let result = await ResourceRep.craete(param);
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
      projectId: this.get('projectId'),
    }
    let list = await ResourceRep.getList(param);
    return this.success(list);
  }
  async getInfoAction() {
    let id = this.get('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ResourceRep.getInfo(id);
    return this.success(result);
  }
  async updateAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      label: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      icon: {
        string: true,       // 字段类型为 String 类型
        length: {max: 20}, //长度不能大于2
      },
      addr: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 128}, //长度不能大于2
      },
      type: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 10}, //长度不能大于2
      },
      pId: {
        int: true,     // 字段必填
      },
      id: {
        int: true,     // 字段必填
      },
      projectId: {
        int: true,     // 字段必填
      },
      sort: {
        int: true,     // 字段必填
      },
      display: {
        required: true,     // 字段必填
        int: {min: 0, max: 1},     // 字段必填
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
    let name = this.post('name');
    let id = this.post('id');
    let pId = this.post('pId');
    let label = this.post('label');
    let icon = this.post('icon');
    let addr = this.post('addr');
    let type = this.post('type');
    let sort = this.post('sort');
    let display = this.post('display');
    let projectId = this.post('projectId');
    const param = {
      name: name,
      pId: pId,
      id: id,
      label: label,
      icon: icon,
      addr: addr,
      type: type,
      sort: sort,
      projectId: projectId,
      display: display,
    }
    let result = await ResourceRep.update(param);
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
    let result = await ResourceRep.disable(id);
    return this.success(result);
  }
  async enableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ResourceRep.enable(id);
    return this.success(result);
  }
  async getParentResourceAction() {
    const where = {
      projectId: this.get('projectId'),
      name: this.get('name')
    }

    let result = await ResourceRep.getPresource(where);
    return this.success(result)
  }

  // 获取项目下所有资源并呈现树状接口
  async getSourceTreeAction() {
    let rules = {
      projectId: {
        required: true, // 字段必填
        int: true,
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
    const projectId = this.get('projectId');

    let result = await ResourceRep.getSourceTree(projectId);
    return this.success(result)
  }

};
